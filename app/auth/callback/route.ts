import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { origin, searchParams } = requestUrl;
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  console.log('=== OAuth Callback Debug Info ===');
  console.log('Full URL:', request.url);
  console.log('Error:', error);
  console.log('Error Description:', errorDescription);
  console.log('Origin:', origin);
  
  // If there's an OAuth error, redirect with error message
  if (error) {
    const errorMsg = errorDescription || error || 'OAuth authentication failed';
    console.error('OAuth error from provider:', errorMsg);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMsg)}`);
  }

  // For implicit flow, redirect to dashboard and let client-side handle session detection
  console.log('OAuth callback successful, redirecting to dashboard for session detection');
  return NextResponse.redirect(`${origin}/dashboard`);
}