import { NextRequest, NextResponse } from 'next/server';

// Very naive placeholder similarity generator
export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();
    if (typeof code !== 'string' || !code.trim()) {
      return NextResponse.json({ error: 'Code is required' }, { status: 400 });
    }
    // Fake similarity: hash length & vowel ratio for deterministic pseudo-randomness
    const lengthFactor = Math.min(code.length / 500, 1);
    const vowels = (code.match(/[aeiou]/gi) || []).length;
    const vowelRatio = vowels / Math.max(code.length, 1);
    const similarity = Math.min(0.95, parseFloat(((lengthFactor * 0.6) + (vowelRatio * 0.4)).toFixed(3)));
    return NextResponse.json({ similarity });
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }
}