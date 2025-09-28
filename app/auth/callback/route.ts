import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get('next') ?? '/dashboard';

  console.log('Callback received:', { code: !!code, error, searchParams: Array.from(searchParams.entries()) });

  // If there's an OAuth error, redirect to login with error message
  if (error) {
    console.error('OAuth error:', error, errorDescription);
    const errorMsg = errorDescription || error || 'Authentication failed';
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMsg)}`);
  }

  if (code) {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        auth: {
          flowType: 'pkce',
        },
      }
    );

    try {
      console.log('Attempting code exchange for session...');
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
      
      if (exchangeError) {
        console.error('Code exchange error:', exchangeError);
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Failed to complete authentication')}`);
      }

      if (data.session && data.user) {
        console.log('Authentication successful for user:', data.user.email);
        const forwardedHost = request.headers.get('x-forwarded-host');
        const isLocalEnv = process.env.NODE_ENV === 'development';
        
        if (isLocalEnv) {
          return NextResponse.redirect(`${origin}${next}`);
        } else if (forwardedHost) {
          return NextResponse.redirect(`https://${forwardedHost}${next}`);
        } else {
          return NextResponse.redirect(`${origin}${next}`);
        }
      }
    } catch (err) {
      console.error('Callback handler error:', err);
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Authentication failed')}`);
    }
  }

  // If no code parameter, this might be a direct token callback (implicit flow)
  // In this case, let the client-side handle the tokens from the URL hash
  console.log('No code parameter found - redirecting to login for client-side token handling');
  return NextResponse.redirect(`${origin}/login`);
}