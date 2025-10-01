import { NextRequest, NextResponse } from 'next/server';

// GET /api/favorites/status/[id] - Check if snippet is favorited
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const snippetId = params.id;
    
    // For now, return not favorited by default
    // This will be implemented with actual favorite storage later
    return NextResponse.json({
      isFavorited: false,
      snippetId
    });
    
  } catch (error) {
    console.error('Error checking favorite status:', error);
    return NextResponse.json(
      { error: 'Failed to check favorite status' },
      { status: 500 }
    );
  }
}
