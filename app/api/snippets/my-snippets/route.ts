import { NextRequest, NextResponse } from 'next/server';
import { listSnippets } from '../../../lib/repositories/snippetsRepo';

export async function GET(req: NextRequest) {
  try {
    // Get user authentication
    const userDataHeader = req.headers.get('x-user-data');
    if (!userDataHeader) {
      return NextResponse.json(
        { error: 'Authentication required to view your snippets.' },
        { status: 401 }
      );
    }

    let userData;
    try {
      userData = JSON.parse(userDataHeader);
    } catch (e) {
      return NextResponse.json(
        { error: 'Invalid user data.' },
        { status: 400 }
      );
    }

    if (!userData.id) {
      return NextResponse.json(
        { error: 'User ID is required.' },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(req.url);
    
    // Extract query parameters
    const query = searchParams.get('query') || undefined;
    const language = searchParams.get('language') || undefined;
    const category = searchParams.get('category') || undefined;
    const sortBy = searchParams.get('sortBy') || 'recent';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    
    console.log('GET /api/snippets/my-snippets - Parameters:', {
      userId: userData.id,
      query,
      language,
      category,
      sortBy,
      page,
      limit
    });
    
    // Fetch user's snippets (both public and private)
    const results = await listSnippets({
      query,
      language: language && language !== 'all' ? language : undefined,
      category: category && category !== 'all' ? category : undefined,
      sortBy,
      limit: undefined, // Don't limit here, we'll paginate manually
      userId: userData.id // Filter by user ID
    });
    
    console.log('GET /api/snippets/my-snippets - Found snippets:', results.length);
    
    // Filter and paginate results
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = results.slice(startIndex, endIndex);
    
    // Calculate stats for user's snippets
    const stats = {
      totalSnippets: results.length,
      publicSnippets: results.filter(s => (s.visibility || 'public') === 'public').length,
      privateSnippets: results.filter(s => s.visibility === 'private').length,
      totalDownloads: results.reduce((sum, s) => sum + (s.downloads || 0), 0),
      totalViews: results.reduce((sum, s) => sum + (s.views || 0), 0),
      totalLikes: results.reduce((sum, s) => sum + (s.likes || 0), 0),
      averageRating: results.length > 0
        ? results.reduce((sum, s) => sum + (s.rating || 0), 0) / results.length
        : 0
    };
    
    // Get unique languages and categories for filters
    const availableLanguages = [...new Set(results.map(s => s.language))].sort();
    const availableCategories = [...new Set(results.map(s => s.category).filter(Boolean))].sort();
    
    return NextResponse.json({
      snippets: paginatedResults,
      total: results.length,
      page,
      limit,
      totalPages: Math.ceil(results.length / limit),
      stats,
      filters: {
        languages: availableLanguages,
        categories: availableCategories
      }
    });
    
  } catch (error) {
    console.error('GET /api/snippets/my-snippets - Error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch your snippets',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';