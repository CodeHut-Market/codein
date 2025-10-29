import { NextRequest, NextResponse } from 'next/server';
import { deleteSnippetForUser, getSnippetById } from '../../../lib/repositories/snippetsRepo';
import { isSupabaseEnabled, supabase } from '../../../lib/supabaseClient';

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

    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const accessToken = authHeader.replace('Bearer ', '').trim();
    let userId: string | null = null;

    if (isSupabaseEnabled()) {
      try {
        const { data, error } = await supabase!.auth.getUser(accessToken);
        if (error || !data?.user) {
          return NextResponse.json(
            { error: 'Invalid or expired token' },
            { status: 401 }
          );
        }
        userId = data.user.id;
      } catch (authError) {
        console.error('DELETE /api/snippets/[id] - Auth error:', authError);
        return NextResponse.json(
          { error: 'Authentication failed' },
          { status: 401 }
        );
      }
    }

    if (!userId) {
      const userDataHeader = request.headers.get('x-user-data');
      if (userDataHeader) {
        try {
          const parsed = JSON.parse(userDataHeader);
          if (parsed?.id) {
            userId = parsed.id;
          }
        } catch (parseError) {
          console.warn('DELETE /api/snippets/[id] - Failed to parse x-user-data header:', parseError);
        }
      }
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const deleteResult = await deleteSnippetForUser(id, userId);

    if (!deleteResult.success) {
      switch (deleteResult.reason) {
        case 'not_found':
          return NextResponse.json(
            { error: deleteResult.message || 'Snippet not found' },
            { status: 404 }
          );
        case 'forbidden':
          return NextResponse.json(
            { error: deleteResult.message || 'You are not allowed to delete this snippet' },
            { status: 403 }
          );
        default:
          return NextResponse.json(
            { error: deleteResult.message || 'Failed to delete snippet' },
            { status: 500 }
          );
      }
    }

    return NextResponse.json({
      message: deleteResult.message || 'Snippet deleted successfully',
      deletedId: id
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