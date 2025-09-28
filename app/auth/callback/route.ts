import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabaseClient';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const { origin, searchParams } = requestUrl;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  console.log('=== OAuth Callback Debug Info ===');
  console.log('Full URL:', request.url);
  console.log('Code present:', !!code);
  console.log('Error:', error);
  console.log('Error Description:', errorDescription);
  console.log('Origin:', origin);
  
  if (!supabase) {
    console.error('Supabase not initialized');
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Authentication service unavailable')}`);
  }

  // If there's an OAuth error, redirect with error message
  if (error) {
    const errorMsg = errorDescription || error || 'OAuth authentication failed';
    console.error('OAuth error from provider:', errorMsg);
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMsg)}`);
  }

  if (code) {
    console.log('OAuth callback received with code, processing...');
    
    try {
      // Exchange the auth code for a session
      console.log('Attempting to exchange code for session...');
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      console.log('Exchange result:', {
        hasData: !!data,
        hasSession: !!data?.session,
        hasUser: !!data?.user,
        error: error
      });
      
      if (error) {
        console.error('Auth code exchange error:', error);
        const errorMsg = error.message || 'Failed to complete authentication';
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMsg)}`);
      }

      if (data?.session && data?.user) {
        console.log('Authentication successful for user:', data.user.email);
        console.log('Redirecting to dashboard...');
        return NextResponse.redirect(`${origin}/dashboard`);
      } else {
        console.error('No session or user data received');
        return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('Authentication completed but no session created')}`);
      }
    } catch (error) {
      console.error('Callback processing error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Authentication processing failed';
      return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(errorMsg)}`);
    }
  }

  // If no code, redirect to login
  console.log('No auth code found in callback, redirecting to login');
  return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent('No authorization code received')}`);
}