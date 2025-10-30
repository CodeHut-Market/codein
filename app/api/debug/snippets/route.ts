import { NextRequest, NextResponse } from 'next/server';
import { getMemorySnippetsDebugInfo } from '../../../lib/repositories/snippetsRepo';
import { isSupabaseEnabled } from '../../../lib/supabaseClient';

export async function GET() {
  try {
    // Get memory snippets debug info
    const memoryInfo = getMemorySnippetsDebugInfo();
    
    // Get system status
    const status = {
      supabaseEnabled: isSupabaseEnabled(),
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      memorySnippetsCount: memoryInfo.count,
      memorySnippetIds: memoryInfo.ids,
      memorySnippetTitles: memoryInfo.titles
    };

    console.log('Debug endpoint - Memory snippets info:', memoryInfo);

    return NextResponse.json({
      status,
      message: `Found ${memoryInfo.count} snippets in memory storage`
    });
  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json({ 
      error: 'Debug endpoint failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}