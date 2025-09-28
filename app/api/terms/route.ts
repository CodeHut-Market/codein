import { NextResponse } from 'next/server';

export async function GET() {
  const termsOfService = {
    title: 'Terms of Service',
    content: 'By using our service, you agree to these terms and conditions.',
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(termsOfService);
}