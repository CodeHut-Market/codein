import { NextResponse } from 'next/server';

export async function GET() {
  const cookiePolicy = {
    title: 'Cookie Policy',
    content: 'We use cookies to improve your experience on our website.',
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(cookiePolicy);
}