import { NextRequest, NextResponse } from 'next/server';
import { semanticSearchSnippets } from '../../lib/repositories/snippetsRepo';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query');
  const limit = parseInt(searchParams.get('limit') || '10');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  try {
    console.log(`Semantic search request: "${query}" with limit ${limit}`);
    const results = await semanticSearchSnippets(query, limit);
    
    return NextResponse.json({
      query,
      results,
      count: results.length,
      searchType: 'semantic'
    });
  } catch (error) {
    console.error('Semantic search error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { query, limit = 10 } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    console.log(`Semantic search POST request: "${query}" with limit ${limit}`);
    const results = await semanticSearchSnippets(query, limit);
    
    return NextResponse.json({
      query,
      results,
      count: results.length,
      searchType: 'semantic'
    });
  } catch (error) {
    console.error('Semantic search POST error:', error);
    return NextResponse.json(
      { error: 'Search failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';