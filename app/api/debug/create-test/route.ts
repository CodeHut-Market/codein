import { NextRequest, NextResponse } from 'next/server';
import { createSnippet } from '../../../lib/repositories/snippetsRepo';

export async function POST(req: NextRequest) {
  try {
    console.log('Creating test snippet...');
    
    const testSnippet = await createSnippet({
      title: 'Test Snippet from Debug',
      code: 'console.log("Hello, world!");',
      description: 'A simple test snippet',
      language: 'javascript',
      price: 0,
      tags: ['test'],
      framework: undefined,
      author: 'Test User',
      authorId: 'test-user-123'
    });
    
    console.log('Test snippet created with ID:', testSnippet.id);
    
    return NextResponse.json({
      success: true,
      snippet: testSnippet,
      message: 'Test snippet created successfully'
    });
    
  } catch (error) {
    console.error('Test snippet creation failed:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';