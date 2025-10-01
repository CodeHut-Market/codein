import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    message: 'pong',
    timestamp: Date.now(),
    status: 'ok'
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    }
  });
}