import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Demo response', time: new Date().toISOString() })
}
