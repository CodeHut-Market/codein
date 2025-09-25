import { NextResponse } from 'next/server'

// Stub for future Razorpay integration
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  return NextResponse.json({ status: 'stub', received: body })
}
