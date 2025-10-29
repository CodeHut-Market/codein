import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { CodeSnippet } from '@/../../../../shared/api';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Fetch user by ID from Supabase Auth
    const { data: user, error: userError } = await supabase.auth.admin.getUserById(id);
    
    if (userError) {
      console.error('Error fetching user:', userError);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Fetch user's snippets (you might need to implement this based on your data structure)
    // For now, returning empty array
    const snippets: CodeSnippet[] = [];

    // Build user response
    const userResponse = {
      user: {
        id: user.user.id,
        username: user.user.user_metadata?.username || 
                  user.user.user_metadata?.user_name || 
                  user.user.user_metadata?.full_name || 
                  user.user.email?.split('@')[0] || 'Unknown',
        email: user.user.email || '',
        bio: user.user.user_metadata?.bio || 
             user.user.user_metadata?.description || 
             "Full-stack developer passionate about React, Node.js, and building amazing user experiences.",
        avatar: user.user.user_metadata?.avatar_url || 
                user.user.user_metadata?.picture || 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user.user_metadata?.full_name || 'User')}&background=6366f1`,
        totalSnippets: snippets.length,
        totalDownloads: 0, // TODO: implement from your data structure
        rating: 5.0, // TODO: implement from your data structure
        createdAt: user.user.created_at || new Date().toISOString(),
      },
      snippets: snippets,
    };

    return NextResponse.json(userResponse);

  } catch (error) {
    console.error('Error in GET /api/users/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}