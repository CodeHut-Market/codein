import { NextRequest, NextResponse } from 'next/server';
import { getMemorySnippetsDebugInfo } from '../../../lib/repositories/snippetsRepo';
import { isSupabaseEnabled, supabase } from '../../../lib/supabaseClient';

interface RecentSnippet {
  id: string;
  title: string;
  author: string;
  authorId: string;
  createdAt: string;
}

interface VisibilityCounts {
  public: number;
  private: number;
  unlisted: number;
  null: number;
  undefined: number;
  other: number;
}

interface VisibilityDetail {
  id: string;
  title: string;
  visibility: string;
}

interface DebugResults {
  supabaseEnabled: boolean;
  timestamp: string;
  memoryInfo: {
    count: number;
    ids: string[];
    titles: string[];
  };
  connectionError?: Error;
  connectionStatus?: 'FAILED' | 'OK';
  visibilityColumnExists?: boolean;
  visibilityError?: {
    code?: string;
    message: string;
    details?: string;
  };
  visibilityException?: string;
  snippetsQueryError?: Error;
  totalSnippetsInDb?: number;
  recentSnippets?: RecentSnippet[];
  visibilityCounts?: VisibilityCounts;
  visibilityDetails?: VisibilityDetail[];
  visibilityStatsError?: string;
  databaseError?: string;
}

export async function GET() {
  try {
    const results: DebugResults = {
      supabaseEnabled: isSupabaseEnabled(),
      timestamp: new Date().toISOString(),
      memoryInfo: getMemorySnippetsDebugInfo()
    };

    if (!isSupabaseEnabled()) {
      return NextResponse.json({
        ...results,
        error: 'Supabase not enabled',
        message: 'Cannot check database - Supabase is not configured'
      }, { status: 503 });
    }

    try {
      // Test basic connection with minimal query
      const { error: connError } = await supabase!
        .from('snippets')
        .select('id')
        .limit(1);
        
      if (connError) {
        results.connectionError = connError;
        results.connectionStatus = 'FAILED';
      } else {
        results.connectionStatus = 'OK';
      }

      // Test visibility column existence
      try {
        const { error: visError } = await supabase!
          .from('snippets')
          .select('visibility')
          .limit(1);

        if (visError) {
          results.visibilityColumnExists = false;
          results.visibilityError = {
            code: visError.code || 'UNKNOWN',
            message: visError.message,
            details: visError.details
          };
        } else {
          results.visibilityColumnExists = true;
        }
      } catch (visException) {
        results.visibilityColumnExists = false;
        results.visibilityException = visException instanceof Error ? visException.message : 'Unknown error';
      }

      // Get all snippets with their details
      const { data: allSnippets, error: allError } = await supabase!
        .from('snippets')
        .select('id, title, author, author_id, created_at')
        .order('created_at', { ascending: false })
        .limit(20);

      if (allError) {
        results.snippetsQueryError = allError;
      } else {
        results.totalSnippetsInDb = allSnippets?.length || 0;
        results.recentSnippets = (allSnippets || []).map(snippet => ({
          id: snippet.id,
          title: snippet.title,
          author: snippet.author,
          authorId: snippet.author_id,
          createdAt: snippet.created_at
        }));
      }

      // If visibility column exists, get visibility stats
      if (results.visibilityColumnExists) {
        try {
          const { data: visibilityData, error: visDataError } = await supabase!
            .from('snippets')
            .select('id, title, visibility')
            .limit(20);

          if (!visDataError && visibilityData) {
            const visibilityCounts = {
              public: 0,
              private: 0,
              unlisted: 0,
              null: 0,
              undefined: 0,
              other: 0
            };

            visibilityData.forEach(snippet => {
              const visibility = snippet.visibility;
              if (visibility === 'public') visibilityCounts.public++;
              else if (visibility === 'private') visibilityCounts.private++;
              else if (visibility === 'unlisted') visibilityCounts.unlisted++;
              else if (visibility === null) visibilityCounts.null++;
              else if (visibility === undefined) visibilityCounts.undefined++;
              else visibilityCounts.other++;
            });

            results.visibilityCounts = visibilityCounts;
            results.visibilityDetails = visibilityData;
          }
        } catch (visStatsError) {
          results.visibilityStatsError = visStatsError instanceof Error ? visStatsError.message : 'Unknown error';
        }
      }

    } catch (dbError) {
      results.databaseError = dbError instanceof Error ? dbError.message : 'Unknown database error';
    }

    return NextResponse.json(results);

  } catch (error) {
    console.error('Debug snippets visibility exception:', error);
    return NextResponse.json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';