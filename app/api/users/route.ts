import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    // Fetch users from Supabase Auth
    const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
    
    if (usersError) {
      console.error('Error fetching users:', usersError);
      return NextResponse.json(
        { error: 'Failed to fetch users' },
        { status: 500 }
      );
    }

    // Transform users data
    const transformedUsers = users.users.map(user => ({
      id: user.id,
      username: user.user_metadata?.username || 
                user.user_metadata?.user_name || 
                user.user_metadata?.full_name || 
                user.email?.split('@')[0] || 'Unknown',
      email: user.email || '',
      bio: user.user_metadata?.bio || 
           user.user_metadata?.description || 
           "",
      avatar: user.user_metadata?.avatar_url || 
              user.user_metadata?.picture || 
              `https://ui-avatars.com/api/?name=${encodeURIComponent(user.user_metadata?.full_name || 'User')}&background=6366f1`,
      totalSnippets: 0, // TODO: implement from your data structure
      totalDownloads: 0, // TODO: implement from your data structure  
      rating: 5.0, // TODO: implement from your data structure
      createdAt: user.created_at || new Date().toISOString(),
    }));

    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = transformedUsers.slice(startIndex, endIndex);

    const response = {
      users: paginatedUsers,
      total: transformedUsers.length,
      page: page,
      limit: limit,
    };

    return NextResponse.json(response);

  } catch (error) {
    console.error('Error in GET /api/users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}