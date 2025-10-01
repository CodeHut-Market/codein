import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseEnabled, supabase } from '../../../lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    if (!isSupabaseEnabled()) {
      return NextResponse.json({
        error: 'Supabase not enabled',
        message: 'Cannot check database - Supabase is not configured'
      }, { status: 503 });
    }

    // Get all snippets with their visibility status
    const { data: allSnippets, error } = await supabase!
      .from('snippets')
      .select('id, title, visibility, author, created_at')
      .order('created_at', { ascending: false })
      .limit(20);

    if (error) {
      console.error('Debug snippets visibility error:', error);
      return NextResponse.json({
        error: 'Database query failed',
        details: error.message
      }, { status: 500 });
    }

    // Count by visibility
    const visibilityCounts = {
      public: 0,
      private: 0,
      unlisted: 0,
      null: 0,
      undefined: 0,
      other: 0
    };

    const snippetDetails = (allSnippets || []).map(snippet => {
      const visibility = snippet.visibility;
      if (visibility === 'public') visibilityCounts.public++;
      else if (visibility === 'private') visibilityCounts.private++;
      else if (visibility === 'unlisted') visibilityCounts.unlisted++;
      else if (visibility === null) visibilityCounts.null++;
      else if (visibility === undefined) visibilityCounts.undefined++;
      else visibilityCounts.other++;

      return {
        id: snippet.id,
        title: snippet.title,
        visibility: snippet.visibility,
        visibilityType: typeof snippet.visibility,
        author: snippet.author,
        createdAt: snippet.created_at
      };
    });

    return NextResponse.json({
      success: true,
      totalSnippets: allSnippets?.length || 0,
      visibilityCounts,
      recentSnippets: snippetDetails,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Debug snippets visibility exception:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';