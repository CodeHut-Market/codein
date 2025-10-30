import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { getSnippetById } from '../../../lib/repositories/snippetsRepo';
import { isSupabaseEnabled, supabase } from '../../../lib/supabaseClient';

export const runtime = 'nodejs';

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || RAZORPAY_KEY_ID;
const DEMO_PUBLIC_KEY = process.env.NEXT_PUBLIC_RAZORPAY_DEMO_KEY || 'rzp_test_1DP5mmOlF5G5ag';

const DEMO_MODE = !RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET;

const razorpayClient = !DEMO_MODE
  ? new Razorpay({
      key_id: RAZORPAY_KEY_ID!,
      key_secret: RAZORPAY_KEY_SECRET!,
    })
  : null;

async function resolveUserId(request: NextRequest) {
  let userId: string | null = null;

  const authHeader = request.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ') && isSupabaseEnabled()) {
    try {
      const accessToken = authHeader.replace('Bearer ', '').trim();
      const { data, error } = await supabase!.auth.getUser(accessToken);
      if (!error && data?.user) {
        userId = data.user.id;
      }
    } catch (error) {
      console.error('create-order: failed to resolve user from token', error);
    }
  }

  if (!userId) {
    const userHeader = request.headers.get('x-user-data');
    if (userHeader) {
      try {
        const parsed = JSON.parse(userHeader);
        if (parsed?.id && typeof parsed.id === 'string') {
          userId = parsed.id;
        }
      } catch (error) {
        console.warn('create-order: unable to parse x-user-data header');
      }
    }
  }

  return userId;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { snippetId } = body ?? {};

    if (!snippetId || typeof snippetId !== 'string') {
      return NextResponse.json({ error: 'Snippet ID is required' }, { status: 400 });
    }

    const userId = await resolveUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const snippet = await getSnippetById(snippetId);
    if (!snippet) {
      return NextResponse.json({ error: 'Snippet not found' }, { status: 404 });
    }

    const price = typeof snippet.price === 'number' ? snippet.price : 0;
    if (price <= 0) {
      return NextResponse.json(
        { error: 'This snippet is free and does not require payment.' },
        { status: 400 }
      );
    }

    const amount = Math.round(price * 100);
    const sanitizedSnippetId = snippetId.replace(/[^a-zA-Z0-9]/g, '').slice(0, 18);
    const receipt = `snip_${sanitizedSnippetId}_${Date.now().toString().slice(-6)}`;

    if (DEMO_MODE) {
      const mockOrderId = `order_demo_${Date.now()}`;
      return NextResponse.json({
        id: mockOrderId,
        orderId: mockOrderId,
        amount,
        currency: 'INR',
        key: PUBLIC_KEY ?? DEMO_PUBLIC_KEY,
        demo: true,
        demoInstructions: {
          card: '4111 1111 1111 1111 | 12/35 | CVV 111 | OTP 123456',
          upi: 'success@razorpay',
          note: 'Demo mode enabled. Configure RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET for live payments.',
        },
        snippet: {
          id: snippet.id,
          title: snippet.title,
          price,
        },
        buyer: { id: userId },
      });
    }

    if (!razorpayClient) {
      return NextResponse.json(
        { error: 'Payment gateway is not configured correctly.' },
        { status: 500 }
      );
    }

    const order = await razorpayClient.orders.create({
      amount,
      currency: 'INR',
      receipt,
      notes: {
        snippet_id: snippetId,
        buyer_id: userId,
      },
    });

    return NextResponse.json({
      id: order.id,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: PUBLIC_KEY,
      demo: false,
      snippet: {
        id: snippet.id,
        title: snippet.title,
        price,
      },
      buyer: { id: userId },
    });
  } catch (error) {
    console.error('create-order: unexpected error', error);
    return NextResponse.json(
      { error: 'Failed to create payment order. Please try again.' },
      { status: 500 }
    );
  }
}
