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
  const debug = searchParams.get('debug') === 'true';
  
  const results = await listSnippets({
    query,
    language: language && language !== 'all' ? language : undefined,
    category: category && category !== 'all' ? category : undefined,
    sortBy,
    featured,
    limit
  });
  
  // Add debug information if requested
  if (debug) {
    console.log('GET /api/snippets - Debug mode');
    console.log('GET /api/snippets - Results count:', results.length);
    console.log('GET /api/snippets - Results IDs:', results.map(s => `${s.id} - ${s.title}`));
  }
  
  return NextResponse.json({ 
    snippets: results, 
    total: results.length, 
    page: 1, 
    limit: results.length,
    ...(debug && { 
      debug: {
        resultIds: results.map(s => ({ id: s.id, title: s.title })),
        timestamp: new Date().toISOString()
      }
    })
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

    // Require user authentication for upload
    const userDataHeader = req.headers.get('x-user-data');
    if (!userDataHeader) {
      console.log('POST /api/snippets - No user authentication found, rejecting upload');
      return NextResponse.json({ error: 'Authentication required to upload snippets.' }, { status: 401 });
    }
    let userData;
    try {
      userData = JSON.parse(userDataHeader);
    } catch (e) {
      console.warn('POST /api/snippets - Failed to parse user data header');
      return NextResponse.json({ error: 'Invalid user data.' }, { status: 400 });
    }
    if (!userData.id || !userData.username) {
      return NextResponse.json({ error: 'Incomplete user data.' }, { status: 400 });
    }
    const author = userData.username;
    const authorId = userData.id;
    console.log('POST /api/snippets - Authenticated user:', { author, authorId });
    const snippet = await createSnippet({
      title: body.title,
      code: body.code,
      description: body.description,
      language: body.language,
      price: typeof body.price === 'number' ? body.price : 0,
      tags: body.tags || [],
      framework: body.framework,
      author: author,
      authorId: authorId
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