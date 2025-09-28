import { NextResponse } from 'next/server';

export async function GET() {
  const privacyPolicy = {
    title: 'Privacy Policy',
    content: 'Your privacy is important to us. This privacy policy explains how we collect, use, and protect your information.',
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(privacyPolicy);
}