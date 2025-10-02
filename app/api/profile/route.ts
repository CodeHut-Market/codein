import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Initialize Supabase clients
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client for user authentication
const supabaseClient = createClient(supabaseUrl, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

// GET /api/profile - Get current user's profile
export async function GET(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace('Bearer ', '');

    // Get user from access token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(accessToken);
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Get user profile data
    const profile = {
      id: user.id,
      username: user.user_metadata?.username || 
                user.user_metadata?.user_name || 
                user.user_metadata?.full_name || 
                user.email?.split('@')[0] || 'user',
      email: user.email || '',
      bio: user.user_metadata?.bio || 
           user.user_metadata?.description || 
           '',
      avatar: user.user_metadata?.avatar_url || 
              user.user_metadata?.picture || 
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || 'User')}&background=6366f1`,
      created_at: user.created_at,
      updated_at: user.updated_at
    };

    return NextResponse.json({
      success: true,
      user: profile
    });

  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/profile - Update current user's profile
export async function PUT(request: NextRequest) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized - No access token' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace('Bearer ', '');

    // Get user from access token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(accessToken);
    
    if (userError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid token' },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { username, bio, avatar } = body;

    // Validate required fields
    if (!username || username.trim() === '') {
      return NextResponse.json(
        { error: 'Username is required' },
        { status: 400 }
      );
    }

    // Prepare updated metadata
    const updatedMetadata = {
      ...user.user_metadata,
      username: username.trim(),
      bio: bio || '',
      avatar_url: avatar || user.user_metadata?.avatar_url || user.user_metadata?.picture
    };

    // Update user metadata in Supabase Auth
    const { data: updatedUser, error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      user.id,
      {
        user_metadata: updatedMetadata
      }
    );

    if (updateError) {
      console.error('Error updating user:', updateError);
      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }

    // Return updated profile
    const updatedProfile = {
      id: updatedUser.user.id,
      username: updatedMetadata.username,
      email: updatedUser.user.email || '',
      bio: updatedMetadata.bio,
      avatar: updatedMetadata.avatar_url,
      created_at: updatedUser.user.created_at,
      updated_at: updatedUser.user.updated_at
    };

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedProfile
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}