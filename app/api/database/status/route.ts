import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseEnabled, supabase } from '../../../lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseEnabled()) {
      return NextResponse.json({
        status: 'disconnected',
        message: 'Supabase is not configured',
        tables: null,
        snippetCount: 0
      });
    }

    // Test basic connection
    const { data: connectionTest, error: connectionError } = await supabase!
      .from('snippets')
      .select('count', { count: 'exact', head: true });

    if (connectionError) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: connectionError.message,
        tables: null,
        snippetCount: 0
      }, { status: 500 });
    }

    // Get snippet count
    const snippetCount = connectionTest || 0;

    // Get recent snippets to verify data structure
    const { data: recentSnippets, error: snippetsError } = await supabase!
      .from('snippets')
      .select('id, title, code, language, created_at, tags')
      .order('created_at', { ascending: false })
      .limit(5);

    if (snippetsError) {
      console.error('Error fetching snippets:', snippetsError);
    }

    // Test other tables
    const { data: notificationsCount, error: notificationsError } = await supabase!
      .from('notifications')
      .select('count', { count: 'exact', head: true });

    const { data: favoritesCount, error: favoritesError } = await supabase!
      .from('favorites')
      .select('count', { count: 'exact', head: true });

    return NextResponse.json({
      status: 'connected',
      message: 'Database is connected and accessible',
      tables: {
        snippets: {
          count: snippetCount,
          accessible: !snippetsError,
          error: snippetsError?.message || null,
          recentData: recentSnippets || []
        },
        notifications: {
          count: notificationsCount || 0,
          accessible: !notificationsError,
          error: notificationsError?.message || null
        },
        favorites: {
          count: favoritesCount || 0,
          accessible: !favoritesError,
          error: favoritesError?.message || null
        }
      },
      snippetCount: snippetCount,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database status check failed:', error);
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error occurred',
      error: error instanceof Error ? error.message : 'Unknown error',
      tables: null,
      snippetCount: 0
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';