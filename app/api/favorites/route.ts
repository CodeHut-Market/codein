import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Get user's favorite snippets
export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('sb-access-token');

    if (!token) {
      return NextResponse.json(
        { message: "Authentication required" },
        { status: 401 }
      );
    }

    // Get user from token
    const { data: { user }, error: userError } = await supabase.auth.getUser(token.value);
    
    if (userError || !user) {
      return NextResponse.json(
        { message: "Invalid authentication" },
        { status: 401 }
      );
    }

    // Get user's favorites with snippet details
    const { data: favorites, error } = await supabase
      .from('favorites')
      .select(`
        id,
        created_at,
        snippet:snippets (
          id,
          title,
          description,
          language,
          code,
          author_id,
          created_at,
          updated_at,
          downloads,
          likes,
          views,
          tags,
          is_public,
          profiles!author_id (
            username,
            first_name,
            last_name,
            avatar_url
          )
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

    return NextResponse.json({ favorites: favorites || [] });

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
    const cookieStore = cookies();
    const token = cookieStore.get('sb-access-token');

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
    const { data: { user }, error: userError } = await supabase.auth.getUser(token.value);
    
    if (userError || !user) {
      return NextResponse.json(
        { message: "Invalid authentication" },
        { status: 401 }
      );
    }

    // Check if snippet exists
    const { data: snippet, error: snippetError } = await supabase
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
    const { data: existingFavorite, error: checkError } = await supabase
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
    const { data: favorite, error: insertError } = await supabase
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
    const cookieStore = cookies();
    const token = cookieStore.get('sb-access-token');

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
    const { data: { user }, error: userError } = await supabase.auth.getUser(token.value);
    
    if (userError || !user) {
      return NextResponse.json(
        { message: "Invalid authentication" },
        { status: 401 }
      );
    }

    // Remove from favorites
    const { error: deleteError } = await supabase
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