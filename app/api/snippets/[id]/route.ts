import { NextRequest, NextResponse } from 'next/server';
import { getSnippetById } from '../../../lib/repositories/snippetsRepo';

export async function GET(
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

    const snippet = await getSnippetById(id);
    
    if (!snippet) {
      return NextResponse.json(
        { error: 'Snippet not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(snippet);

  } catch (error) {
    console.error('Error in GET /api/snippets/[id]:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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