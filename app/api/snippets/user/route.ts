import { NextRequest, NextResponse } from 'next/server';
import { listSnippets } from '../../../lib/repositories/snippetsRepo';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId') || searchParams.get('authorId');
  const query = searchParams.get('query');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : 0;

  try {
    // Use the updated listSnippets function with options
    const snippets = await listSnippets({
      userId: userId || undefined,
      query: query || undefined,
      limit: limit ? limit + offset : undefined, // Adjust for offset
      sortBy: 'recent'
    });

    // Apply pagination after filtering
    const paginatedSnippets = snippets.slice(offset, limit ? offset + limit : undefined);

    return NextResponse.json({
      snippets: paginatedSnippets,
      total: snippets.length,
      page: Math.floor(offset / (limit || 10)) + 1,
      limit: limit || snippets.length,
      hasMore: limit ? (offset + limit) < snippets.length : false
    });

  } catch (error) {
    console.error('Error fetching user snippets:', error);
    return NextResponse.json({
      error: 'Failed to fetch snippets',
      snippets: [],
      total: 0,
      page: 1,
      limit: 0,
      hasMore: false
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';