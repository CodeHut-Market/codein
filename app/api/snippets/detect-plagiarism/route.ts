import { NextRequest, NextResponse } from 'next/server';
import { detectPlagiarismWithAI } from '@/../../server/services/aiPlagiarismService';
import { supabaseClient } from '@/../../server/lib/supabaseClient';

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
    const body = await req.json();
    const { code, language, authorId } = body;
    
    if (typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }
    
    // Check if Supabase is available
    if (!supabaseClient) {
      return NextResponse.json({ 
        error: 'Database not configured',
        message: 'Supabase connection not available'
      }, { status: 500 });
    }
    
    // Fetch existing snippets from Supabase for comparison
    let query = supabaseClient
      .from('snippets')
      .select('id, title, code, user_id, profiles(username)')
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
      console.error('Database query error:', dbError);
      return NextResponse.json({ 
        error: 'Failed to fetch snippets for comparison',
        message: dbError.message 
      }, { status: 500 });
    }
    
    // Format snippets for AI analysis
    const existingSnippets = (snippets || []).map(snippet => {
      let author = 'Anonymous';
      if (snippet.profiles) {
        if (Array.isArray(snippet.profiles) && snippet.profiles.length > 0) {
          author = snippet.profiles[0]?.username || 'Anonymous';
        } else if (!Array.isArray(snippet.profiles) && (snippet.profiles as any).username) {
          author = (snippet.profiles as any).username;
        }
      }
      
      return {
        id: snippet.id,
        title: snippet.title,
        code: snippet.code,
        author,
      };
    });
    
    // Run AI-powered plagiarism detection
    const result = await detectPlagiarismWithAI(
      code,
      existingSnippets,
      language || 'unknown'
    );
    
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
    console.error('Plagiarism detection error:', error);
    return NextResponse.json({ 
      error: 'Plagiarism detection failed',
      message: error.message || 'Unknown error occurred'
    }, { status: 500 });
  }
}