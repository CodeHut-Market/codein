import { NextRequest, NextResponse } from 'next/server';
import { listPopular } from '../../../lib/repositories/snippetsRepo';

export async function GET(req: NextRequest){
  const limitParam = new URL(req.url).searchParams.get('limit');
  const limit = limitParam ? parseInt(limitParam,10) : 6;
  const snippets = await listPopular(limit);
  return NextResponse.json({ snippets });
}