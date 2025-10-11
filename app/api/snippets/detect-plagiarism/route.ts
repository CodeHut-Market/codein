import { supabaseClient } from '@/../../server/lib/supabaseClient';
import { detectPlagiarismWithAI } from '@/../../server/services/aiPlagiarismService';
import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/snippets/detect-plagiarism
 * 
 * AI-powered plagiarism detection against existing snippets using OpenRouter API
 * 
 * Body:
 * - code: string (required) - Code to check for plagiarism
 * - language: string (optional) - Programming language
 * - authorId: string (optional) - Exclude own snippets from check
 */
export async function POST(req: NextRequest) {
  try {
    console.log('[Plagiarism] Request received');
    
    const body = await req.json();
    const { code, language, authorId } = body;
    
    console.log('[Plagiarism] Request params:', { 
      codeLength: code?.length, 
      language, 
      authorId 
    });
    
    if (typeof code !== 'string' || !code.trim()) {
      console.error('[Plagiarism] Invalid code parameter');
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }
    
    // Check if Supabase is available
    if (!supabaseClient) {
      console.error('[Plagiarism] Supabase client not initialized');
      return NextResponse.json({ 
        error: 'Database not configured',
        message: 'Supabase connection not available. Please check environment variables.'
      }, { status: 500 });
    }
    
    console.log('[Plagiarism] Fetching snippets from Supabase...');
    
    // Fetch existing snippets from Supabase for comparison
    // Note: We don't join with profiles to avoid foreign key issues
    // The author info is not critical for plagiarism detection
    let query = supabaseClient
      .from('snippets')
      .select('id, title, code, user_id')
      .order('created_at', { ascending: false })
      .limit(50); // Compare against most recent 50 snippets
    
    // Filter by language if provided
    if (language) {
      query = query.eq('language', language);
    }
    
    // Exclude author's own snippets if authorId provided
    if (authorId) {
      query = query.neq('user_id', authorId);
    }
    
    const { data: snippets, error: dbError } = await query;
    
    if (dbError) {
      console.error('[Plagiarism] Database query error:', dbError);
      return NextResponse.json({ 
        error: 'Failed to fetch snippets for comparison',
        message: dbError.message 
      }, { status: 500 });
    }
    
    console.log(`[Plagiarism] Fetched ${snippets?.length || 0} snippets for comparison`);
    
    // Format snippets for AI analysis
    // Use user_id as author since we don't have the profile join
    const existingSnippets = (snippets || []).map(snippet => ({
      id: snippet.id,
      title: snippet.title,
      code: snippet.code,
      author: snippet.user_id || 'Anonymous',
    }));
    
    console.log('[Plagiarism] Running AI-powered plagiarism detection...');
    
    // Run AI-powered plagiarism detection
    const result = await detectPlagiarismWithAI(
      code,
      existingSnippets,
      language || 'unknown'
    );
    
    console.log('[Plagiarism] Detection complete:', {
      status: result.status,
      similarity: result.similarity,
      aiPowered: result.aiPowered
    });
    
    return NextResponse.json({
      success: true,
      isPlagiarized: result.isPlagiarized,
      similarity: result.similarity,
      status: result.status,
      message: result.message,
      matchedSnippets: result.matches,
      analysis: result.analysis,
      aiPowered: result.aiPowered,
    });
    
  } catch (error: any) {
    console.error('[Plagiarism] Unexpected error:', error);
    console.error('[Plagiarism] Error stack:', error.stack);
    
    return NextResponse.json({ 
      error: 'Plagiarism detection failed',
      message: error.message || 'Unknown error occurred',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}