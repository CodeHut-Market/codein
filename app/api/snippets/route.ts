import { CreateCodeSnippetRequest } from '@shared/api';
import { NextRequest, NextResponse } from 'next/server';
import { createSnippet, listSnippets } from '../../lib/repositories/snippetsRepo';

export async function GET(req: NextRequest){
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('query') || undefined;
  const language = searchParams.get('language') || undefined;
  const category = searchParams.get('category') || undefined;
  const sortBy = searchParams.get('sortBy') || 'recent';
  const featured = searchParams.get('featured') === 'true';
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  
  const results = await listSnippets({
    query,
    language: language && language !== 'all' ? language : undefined,
    category: category && category !== 'all' ? category : undefined,
    sortBy,
    featured,
    limit
  });
  
  return NextResponse.json({ 
    snippets: results, 
    total: results.length, 
    page: 1, 
    limit: results.length 
  });
}

export async function POST(req: NextRequest){
  try {
    console.log('POST /api/snippets - Starting snippet creation');
    const body: Partial<CreateCodeSnippetRequest> = await req.json();
    console.log('POST /api/snippets - Received body:', { 
      title: body.title, 
      language: body.language, 
      hasCode: !!body.code,
      codeLength: body.code?.length 
    });
    
    if(!body.title || !body.code || !body.language){
      console.log('POST /api/snippets - Missing required fields:', { 
        hasTitle: !!body.title, 
        hasCode: !!body.code, 
        hasLanguage: !!body.language 
      });
      return NextResponse.json({ error: 'Missing required fields'}, { status: 400 });
    }
    
    console.log('POST /api/snippets - Attempting to create snippet');
    const snippet = await createSnippet({
      title: body.title,
      code: body.code,
      description: body.description,
      language: body.language,
      price: typeof body.price === 'number' ? body.price : 0,
      tags: body.tags || [],
      framework: body.framework,
      author: 'demo-user',
      authorId: 'demo-user-id'
    });
    
    console.log('POST /api/snippets - Successfully created snippet with ID:', snippet.id);
    return NextResponse.json({ snippet, message: 'Created'}, { status: 201 });
  } catch(e){
    console.error('POST /api/snippets - Error creating snippet:', e);
    return NextResponse.json({ 
      error: 'Failed to create snippet', 
      details: e instanceof Error ? e.message : 'Unknown error'
    }, { status: 500 });
  }
}

// Popular endpoint co-located for simplicity (could be separate file)
export const dynamic = 'force-dynamic';