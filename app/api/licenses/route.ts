import { NextResponse } from 'next/server';

export async function GET() {
  const licenses = {
    title: 'Open Source Licenses',
    content: 'Information about open source software licenses used in this project.',
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(licenses);
}