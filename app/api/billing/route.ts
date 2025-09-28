import { NextResponse } from 'next/server';

export async function GET() {
  const billingInfo = {
    title: 'Billing Information',
    content: 'Billing information and payment processing details will be available here.',
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json(billingInfo);
}