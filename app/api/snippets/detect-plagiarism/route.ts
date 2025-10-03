import { NextRequest, NextResponse } from 'next/server';
import { detectPlagiarism } from '../../../lib/plagiarismService';

/**
 * POST /api/snippets/detect-plagiarism
 * 
 * Check code for plagiarism against existing snippets
 * 
 * Body:
 * - code: string (required)
 * - language: string (optional)
 * - authorId: string (optional) - exclude own snippets from check
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, language, authorId } = body;
    
    if (typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }
    
    // Run plagiarism detection
    const result = await detectPlagiarism(code, language, authorId);
    
    return NextResponse.json({
      success: true,
      ...result,
    });
    
  } catch (error: any) {
    console.error('Plagiarism detection error:', error);
    return NextResponse.json({ 
      error: 'Plagiarism detection failed',
      message: error.message 
    }, { status: 500 });
  }
}