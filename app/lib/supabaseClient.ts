import { createClient } from '@supabase/supabase-js';

// Environment variables (configure in .env.local)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Get the current origin for redirect URL
export const getRedirectURL = () => {
	let url =
		process.env.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env
		process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel
		'http://localhost:3000';
	// Make sure to include `https://` when not localhost.
	url = url.includes('http') ? url : `https://${url}`;
	// Make sure to include a trailing `/`.
	url = url.charAt(url.length - 1) === '/' ? url : `${url}/`;
	return url;
};

// Create Supabase client with proper authentication options
export const supabase = SUPABASE_URL && SUPABASE_ANON_KEY ? createClient(
	SUPABASE_URL,
	SUPABASE_ANON_KEY,
	{
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: true,
			flowType: 'pkce'
		}
	}
) : null;

export function isSupabaseEnabled(){
  return !!supabase;
}
