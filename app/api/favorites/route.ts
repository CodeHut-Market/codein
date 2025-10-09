import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// Create Supabase client that can read cookies
function createServerSupabaseClient(request: NextRequest) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
      },
    }
  );
}

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get user's favorite snippets
export async function GET(request: NextRequest) {
  try {
    // Get auth header or cookie
    const authHeader = request.headers.get('Authorization');
    const cookieStore = cookies();
    
    // Try multiple cookie names for Supabase session
    const possibleTokens = [
      cookieStore.get('sb-access-token'),
      cookieStore.get('sb-auth-token'),
      cookieStore.get('supabase-auth-token')
    ].filter(Boolean);

    let token = authHeader?.replace('Bearer ', '');
    
    // If no auth header, try cookies
    if (!token && possibleTokens.length > 0) {
      token = possibleTokens[0]?.value;
    }

    // If still no token, try to get from Supabase client
    if (!token) {
      const supabase = createServerSupabaseClient(request);
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (session?.access_token) {
        token = session.access_token;
      }
    }

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required", authenticated: false },
        { status: 401 }
      );
    }

    // Get user from token using admin client
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { message: "Invalid authentication", authenticated: false },
        { status: 401 }
      );
    }

    // Get user's favorites with snippet details
    // Note: favorites table has composite key (user_id, snippet_id), no separate 'id' column
    const { data: favorites, error } = await supabaseAdmin
      .from('favorites')
      .select(`
        user_id,
        snippet_id,
        created_at,
        snippets (
          id,
          title,
          description,
          language,
          code,
          author,
          author_id,
          created_at,
          updated_at,
          downloads,
          rating,
          tags,
          price,
          category,
          framework,
          visibility,
          allow_comments,
          featured
        )
      `)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Database error:', error);
      return NextResponse.json(
        { message: "Failed to fetch favorites" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      favorites: favorites || [], 
      authenticated: true 
    });

  } catch (error) {
    console.error('Favorites fetch error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Add snippet to favorites
export async function POST(request: NextRequest) {
  try {
    // Get auth header or cookie
    const authHeader = request.headers.get('Authorization');
    const cookieStore = cookies();
    
    const possibleTokens = [
      cookieStore.get('sb-access-token'),
      cookieStore.get('sb-auth-token'),
      cookieStore.get('supabase-auth-token')
    ].filter(Boolean);

    let token = authHeader?.replace('Bearer ', '');
    
    if (!token && possibleTokens.length > 0) {
      token = possibleTokens[0]?.value;
    }

    if (!token) {
      const supabase = createServerSupabaseClient(request);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        token = session.access_token;
      }
    }

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { snippetId } = await request.json();

    if (!snippetId) {
      return NextResponse.json(
        { message: "Snippet ID is required" },
        { status: 400 }
      );
    }

    // Get user from token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { message: "Invalid authentication" },
        { status: 401 }
      );
    }

    // Check if snippet exists
    const { data: snippet, error: snippetError } = await supabaseAdmin
      .from('snippets')
      .select('id')
      .eq('id', snippetId)
      .single();

    if (snippetError || !snippet) {
      return NextResponse.json(
        { message: "Snippet not found" },
        { status: 404 }
      );
    }

    // Check if already favorited
    const { data: existingFavorite, error: checkError } = await supabaseAdmin
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('snippet_id', snippetId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database error:', checkError);
      return NextResponse.json(
        { message: "Failed to check favorite status" },
        { status: 500 }
      );
    }

    if (existingFavorite) {
      return NextResponse.json(
        { message: "Snippet is already in favorites" },
        { status: 409 }
      );
    }

    // Add to favorites
    const { data: favorite, error: insertError } = await supabaseAdmin
      .from('favorites')
      .insert({
        user_id: user.id,
        snippet_id: snippetId,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database error:', insertError);
      return NextResponse.json(
        { message: "Failed to add to favorites" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Added to favorites",
      favorite
    });

  } catch (error) {
    console.error('Add favorite error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

// Remove snippet from favorites
export async function DELETE(request: NextRequest) {
  try {
    // Get auth header or cookie
    const authHeader = request.headers.get('Authorization');
    const cookieStore = cookies();
    
    const possibleTokens = [
      cookieStore.get('sb-access-token'),
      cookieStore.get('sb-auth-token'),
      cookieStore.get('supabase-auth-token')
    ].filter(Boolean);

    let token = authHeader?.replace('Bearer ', '');
    
    if (!token && possibleTokens.length > 0) {
      token = possibleTokens[0]?.value;
    }

    if (!token) {
      const supabase = createServerSupabaseClient(request);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.access_token) {
        token = session.access_token;
      }
    }

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const snippetId = searchParams.get('snippetId');

    if (!snippetId) {
      return NextResponse.json(
        { message: "Snippet ID is required" },
        { status: 400 }
      );
    }

    // Get user from token
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      return NextResponse.json(
        { message: "Invalid authentication" },
        { status: 401 }
      );
    }

    // Remove from favorites
    const { error: deleteError } = await supabaseAdmin
      .from('favorites')
      .delete()
      .eq('user_id', user.id)
      .eq('snippet_id', snippetId);

    if (deleteError) {
      console.error('Database error:', deleteError);
      return NextResponse.json(
        { message: "Failed to remove from favorites" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Removed from favorites"
    });

  } catch (error) {
    console.error('Remove favorite error:', error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}