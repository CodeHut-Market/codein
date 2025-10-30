import { createClient, User } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { CodeSnippet } from '@shared/api';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Type definition for user metadata
interface UserMetadata {
  username?: string;
  user_name?: string;
  full_name?: string;
  bio?: string;
  description?: string;
  avatar_url?: string;
  picture?: string;
}

// Type definition for Supabase user
interface SupabaseUser extends User {
  user_metadata: UserMetadata;
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    const { username } = params;

    if (!username) {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Fetch user by username from Supabase Auth
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // Find user by username in user metadata
    const user: SupabaseUser | undefined = users.users.find((u: SupabaseUser) => 
      u.user_metadata?.username === username || 
      u.user_metadata?.user_name === username ||
      u.user_metadata?.full_name === username ||
      u.email?.split('@')[0] === username
    );

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
    const userMetadata = user.user_metadata || {};
    const userResponse = {
      user: {
        id: user.id,
        username: userMetadata.username || 
                  userMetadata.user_name || 
                  userMetadata.full_name || 
                  user.email?.split('@')[0] || 'Unknown',
        email: user.email || '',
        bio: userMetadata.bio || 
             userMetadata.description || 
             "Full-stack developer passionate about React, Node.js, and building amazing user experiences.",
        avatar: userMetadata.avatar_url || 
                userMetadata.picture || 
                `https://ui-avatars.com/api/?name=${encodeURIComponent(userMetadata.full_name || 'User')}&background=6366f1`,
        totalSnippets: snippets.length,
        totalDownloads: 0, // TODO: implement from your data structure
        rating: 5.0, // TODO: implement from your data structure
        createdAt: user.created_at || new Date().toISOString(),
      },
      snippets: snippets,
    };

    return NextResponse.json(userResponse);

  } catch (error) {
    console.error('Error in GET /api/users/username/[username]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}