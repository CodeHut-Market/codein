import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { getSnippetById } from '../../../lib/repositories/snippetsRepo';
import { isSupabaseAdminEnabled, isSupabaseEnabled, supabase, supabaseAdmin } from '../../../lib/supabaseClient';

export const runtime = 'nodejs';

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;
const DEMO_MODE = !process.env.RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET;

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
      console.error('verify-payment: failed to resolve user from token', error);
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
        console.warn('verify-payment: unable to parse x-user-data header');
      }
    }
  }

  return userId;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      snippetId,
    } = body ?? {};

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing payment verification data.' },
        { status: 400 }
      );
    }

    const userId = await resolveUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    if (DEMO_MODE) {
      return NextResponse.json({
        success: true,
        message: 'Payment verified in demo mode.',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    }

    if (!RAZORPAY_KEY_SECRET) {
      return NextResponse.json(
        { error: 'Payment gateway is not configured correctly.' },
        { status: 500 }
      );
    }

    const hmac = crypto.createHmac('sha256', RAZORPAY_KEY_SECRET);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const expectedSignature = hmac.digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Invalid payment signature.' },
        { status: 400 }
      );
    }

    // Update snippet analytics if possible
    if (snippetId && isSupabaseAdminEnabled()) {
      try {
        const snippet = await getSnippetById(snippetId);
        if (snippet) {
          const nextDownloads = (snippet.downloads ?? 0) + 1;
          await supabaseAdmin!
            .from('snippets')
            .update({ downloads: nextDownloads })
            .eq('id', snippetId);
        }
      } catch (error) {
        console.warn('verify-payment: unable to update snippet downloads', error);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully.',
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
    });
  } catch (error) {
    console.error('verify-payment: unexpected error', error);
    return NextResponse.json(
      { error: 'Failed to verify payment. Please contact support.' },
      { status: 500 }
    );
  }
}
