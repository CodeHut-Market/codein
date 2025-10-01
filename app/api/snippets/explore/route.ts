import { NextRequest, NextResponse } from 'next/server';
import { listSnippets } from '../../../lib/repositories/snippetsRepo';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Extract query parameters
    const query = searchParams.get('query') || undefined;
    const language = searchParams.get('language') || undefined;
    const category = searchParams.get('category') || undefined;
    const sortBy = searchParams.get('sortBy') || 'recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const featured = searchParams.get('featured') === 'true';
    const debug = searchParams.get('debug') === 'true';
    
    console.log('GET /api/snippets/explore - Parameters:', {
      query,
      language,
      category,
      sortBy,
      page,
      limit,
      featured
    });
    
    // Fetch public snippets only for explore page
    const results = await listSnippets({
      query,
      language: language && language !== 'all' ? language : undefined,
      category: category && category !== 'all' ? category : undefined,
      sortBy,
      featured,
      limit,
      publicOnly: true // Re-enabled - now working correctly with visibility field
    });
    
    // Add debug information if requested
    if (debug) {
      console.log('GET /api/snippets/explore - Debug mode');
      console.log('GET /api/snippets/explore - Results count:', results.length);
      console.log('GET /api/snippets/explore - Results IDs:', results.map(s => `${s.id} - ${s.title} - visibility: ${s.visibility}`));
      console.log('GET /api/snippets/explore - Results details:', results.map(s => ({
        id: s.id,
        title: s.title, 
        visibility: s.visibility,
        author: s.author,
        createdAt: s.createdAt
      })));
    }
    
    // Filter and paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);
    
    // Get unique languages and categories for filters
    const availableLanguages = [...new Set(results.map(s => s.language))].sort();
    const availableCategories = [...new Set(results.map(s => s.category).filter(Boolean))].sort();
    const availableTags = [...new Set(results.flatMap(s => s.tags || []))].sort();
    
    return NextResponse.json({
      snippets: paginatedResults,
      total: results.length,
      page,
      limit,
      totalPages: Math.ceil(results.length / limit),
      filters: {
        languages: availableLanguages,
        categories: availableCategories,
        tags: availableTags
      },
      ...(debug && {
        debug: {
          resultIds: results.map(s => ({ id: s.id, title: s.title })),
          timestamp: new Date().toISOString()
        }
      })
    });
    
  } catch (error) {
    console.error('GET /api/snippets/explore - Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch snippets',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';