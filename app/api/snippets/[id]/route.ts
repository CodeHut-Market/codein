import { NextRequest, NextResponse } from 'next/server';
import { getSnippetById } from '../../../lib/repositories/snippetsRepo';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    console.log('GET /api/snippets/[id] - Received ID:', id);

    if (!id) {
      console.log('GET /api/snippets/[id] - No ID provided');
      return NextResponse.json(
        { error: 'Snippet ID is required' },
        { status: 400 }
      );
    }

    console.log('GET /api/snippets/[id] - Attempting to fetch snippet with ID:', id);
    const snippet = await getSnippetById(id);
    
    if (!snippet) {
      console.log('GET /api/snippets/[id] - Snippet not found for ID:', id);
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    console.log('GET /api/snippets/[id] - Successfully found snippet:', snippet.title);
    return NextResponse.json(snippet);

  } catch (error) {
    console.error('Error in GET /api/snippets/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Snippet ID is required' },
        { status: 400 }
      );
    }

    // TODO: Implement actual deletion logic
    // For now, just return success
    return NextResponse.json({ 
      success: true, 
      message: 'Snippet deleted successfully' 
    });

  } catch (error) {
    console.error('Error in DELETE /api/snippets/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: 'Snippet ID is required' },
        { status: 400 }
      );
    }

    // TODO: Implement actual update logic
    // For now, return the updated snippet with the provided data
    const updatedSnippet = {
      id: id,
      ...body,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(updatedSnippet);

  } catch (error) {
    console.error('Error in PUT /api/snippets/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}