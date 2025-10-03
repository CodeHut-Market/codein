import { NextRequest, NextResponse } from 'next/server';
import { createSnippet } from '../../../lib/repositories/snippetsRepo';

/**
 * POST /api/snippets/upload-curl
 * 
 * Curl-friendly endpoint for uploading code snippets to Supabase
 * 
 * Usage:
 * curl -X POST http://localhost:3000/api/snippets/upload-curl \
 *   -H "Content-Type: application/json" \
 *   -d '{
 *     "title": "My Snippet",
 *     "code": "console.log(\"Hello World\");",
 *     "description": "A simple snippet",
 *     "language": "JavaScript",
 *     "author": "YourName",
 *     "authorId": "your-id",
 *     "price": 0,
 *     "tags": ["javascript", "example"],
 *     "framework": "Node.js",
 *     "category": "utilities"
 *   }'
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validate required fields
    const { title, code, language, author, authorId } = body;
    
    if (!title || typeof title !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "title" field' },
        { status: 400 }
      );
    }
    
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "code" field' },
        { status: 400 }
      );
    }
    
    if (!language || typeof language !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "language" field' },
        { status: 400 }
      );
    }
    
    if (!author || typeof author !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "author" field' },
        { status: 400 }
      );
    }
    
    if (!authorId || typeof authorId !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "authorId" field' },
        { status: 400 }
      );
    }
    
    // Prepare snippet data with defaults
    const snippetData = {
      title: title.trim(),
      code: code.trim(),
      description: body.description?.trim() || '',
      language: language.trim(),
      author: author.trim(),
      authorId: authorId.trim(),
      price: typeof body.price === 'number' ? body.price : 0,
      tags: Array.isArray(body.tags) ? body.tags : [],
      framework: body.framework || undefined,
      category: body.category || undefined,
      visibility: body.visibility === 'private' || body.visibility === 'unlisted' 
        ? body.visibility 
        : 'public',
      allowComments: body.allowComments !== false,
    };
    
    // Create snippet in Supabase
    const snippet = await createSnippet(snippetData);
    
    return NextResponse.json({
      success: true,
      message: 'Snippet uploaded successfully',
      snippet: {
        id: snippet.id,
        title: snippet.title,
        language: snippet.language,
        createdAt: snippet.createdAt,
      },
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Error uploading snippet via curl:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload snippet',
        message: error.message || 'Internal server error'
      },
      { status: 500 }
    );
  }
}

// OPTIONS for CORS
export async function OPTIONS(req: NextRequest) {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
