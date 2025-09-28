import { NextResponse } from 'next/server';

export async function GET() {
  const dmcaPolicy = {
    title: 'DMCA Policy',
    content: 'Digital Millennium Copyright Act (DMCA) compliance information.',
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(dmcaPolicy);
}