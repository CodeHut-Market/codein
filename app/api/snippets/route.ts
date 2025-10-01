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
    console.log('========================================');
    console.log('POST /api/snippets - Starting snippet creation');
    console.log('POST /api/snippets - Request URL:', req.url);
    console.log('POST /api/snippets - Request headers:', Object.fromEntries(req.headers.entries()));
    
    const body: Partial<CreateCodeSnippetRequest> = await req.json();
    console.log('POST /api/snippets - Full request body:', JSON.stringify(body, null, 2));
    console.log('POST /api/snippets - Received body summary:', { 
      title: body.title, 
      language: body.language, 
      hasCode: !!body.code,
      codeLength: body.code?.length,
      visibility: body.visibility,
      allowComments: body.allowComments,
      category: body.category,
      price: body.price,
      tags: body.tags
    });
    
    // Validate required fields
    if(!body.title || !body.code || !body.language){
      const errorMsg = 'Missing required fields: title, code, and language are required';
      console.error('POST /api/snippets - VALIDATION FAILED:', { 
        hasTitle: !!body.title, 
        hasCode: !!body.code, 
        hasLanguage: !!body.language 
      });
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    // Require user authentication for upload
    const userDataHeader = req.headers.get('x-user-data');
    console.log('POST /api/snippets - User data header:', userDataHeader);
    
    if (!userDataHeader) {
      console.error('POST /api/snippets - AUTHENTICATION FAILED: No user data header found');
      return NextResponse.json({ error: 'Authentication required to upload snippets.' }, { status: 401 });
    }
    
    let userData;
    try {
      userData = JSON.parse(userDataHeader);
      console.log('POST /api/snippets - Parsed user data:', JSON.stringify(userData, null, 2));
    } catch (e) {
      console.error('POST /api/snippets - PARSE ERROR: Failed to parse user data header:', e);
      return NextResponse.json({ error: 'Invalid user data.' }, { status: 400 });
    }
    
    if (!userData.id || !userData.username) {
      console.error('POST /api/snippets - INVALID USER DATA:', { hasId: !!userData.id, hasUsername: !!userData.username });
      return NextResponse.json({ error: 'Incomplete user data.' }, { status: 400 });
    }
    
    const author = userData.username;
    const authorId = userData.id;
    console.log('POST /api/snippets - ✅ Authenticated user:', { author, authorId });
    
    // Enhanced snippet creation with new fields
    const snippetInput = {
      title: body.title.trim(),
      code: body.code,
      description: body.description?.trim() || '',
      language: body.language,
      price: typeof body.price === 'number' ? Math.max(0, body.price) : 0,
      tags: Array.isArray(body.tags) ? body.tags.filter(tag => tag.trim()) : [],
      framework: body.framework?.trim(),
      category: body.category?.trim(),
      visibility: body.visibility || 'public',
      allowComments: body.allowComments !== false, // default to true
      author: author,
      authorId: authorId
    };
    
    console.log('POST /api/snippets - Calling createSnippet with input:', JSON.stringify(snippetInput, null, 2));
    
    const snippet = await createSnippet(snippetInput);
    
    console.log('POST /api/snippets - ✅ SUCCESS! Created snippet:', {
      id: snippet.id,
      title: snippet.title,
      author: snippet.author,
      authorId: snippet.authorId
    });
    console.log('========================================');
    
    return NextResponse.json({ 
      snippet, 
      message: 'Snippet created successfully'
    }, { status: 201 });
    
  } catch(e){
    console.error('========================================');
    console.error('POST /api/snippets - ❌ CRITICAL ERROR creating snippet:', e);
    console.error('POST /api/snippets - Error stack:', e instanceof Error ? e.stack : 'No stack trace');
    console.error('POST /api/snippets - Error message:', e instanceof Error ? e.message : 'Unknown error');
    console.error('========================================');
    return NextResponse.json({ 
      error: 'Failed to create snippet', 
      details: e instanceof Error ? e.message : 'Unknown error',
      stack: process.env.NODE_ENV === 'development' && e instanceof Error ? e.stack : undefined
    }, { status: 500 });
  }
}

// Popular endpoint co-located for simplicity (could be separate file)
export const dynamic = 'force-dynamic';