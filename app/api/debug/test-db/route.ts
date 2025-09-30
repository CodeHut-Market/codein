import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseEnabled, supabase } from '../../../lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseEnabled()) {
      return NextResponse.json({ 
        error: 'Supabase not enabled',
        message: 'Database connection not available'
      });
    }

    // Test basic connection
    console.log('Testing Supabase connection...');
    const { data: connectionTest, error: connectionError } = await supabase!
      .from('snippets')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('Connection test failed:', connectionError);
      return NextResponse.json({ 
        error: 'Database connection failed',
        details: connectionError
      });
    }

    // Get all snippets to see what's actually in the database
    console.log('Fetching all snippets from database...');
    const { data: allSnippets, error: fetchError } = await supabase!
      .from('snippets')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    if (fetchError) {
      console.error('Fetch error:', fetchError);
      return NextResponse.json({ 
        error: 'Failed to fetch snippets',
        details: fetchError
      });
    }

    console.log('Database snippets found:', allSnippets?.length || 0);
    
    return NextResponse.json({
      status: 'success',
      connection: 'working',
      snippetsInDatabase: allSnippets?.length || 0,
      recentSnippets: allSnippets?.map(s => ({
        id: s.id,
        title: s.title,
        created_at: s.created_at,
        author: s.author
      })) || [],
      message: `Found ${allSnippets?.length || 0} snippets in database`
    });

  } catch (error) {
    console.error('Debug test error:', error);
    return NextResponse.json({ 
      error: 'Test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}