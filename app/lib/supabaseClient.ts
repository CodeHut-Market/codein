import { createClient } from '@supabase/supabase-js';

// Environment variables (configure in .env.local)
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if environment variables are properly configured (not placeholder values)
const isValidSupabaseUrl = (url: string | undefined): boolean => {
  return !!(url && 
    !url.includes('your-supabase-url-here') && 
    !url.includes('placeholder') &&
    (url.startsWith('https://') || url.includes('localhost')));
};

const isValidSupabaseKey = (key: string | undefined): boolean => {
  return !!(key && 
    !key.includes('your-supabase-anon-key-here') && 
    !key.includes('placeholder') &&
    key.length > 20);
};

// Security validation for environment variables
if (typeof window !== 'undefined' && SUPABASE_URL && SUPABASE_ANON_KEY) {
  // Client-side validation
  if (isValidSupabaseUrl(SUPABASE_URL) && !SUPABASE_URL.startsWith('https://') && !SUPABASE_URL.includes('localhost')) {
    console.warn('Supabase URL should use HTTPS in production');
  }
}

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

// Enhanced Supabase client with security configurations
export const supabase = (SUPABASE_URL && SUPABASE_ANON_KEY && 
  isValidSupabaseUrl(SUPABASE_URL) && isValidSupabaseKey(SUPABASE_ANON_KEY)) ? createClient(
	SUPABASE_URL,
	SUPABASE_ANON_KEY,
	{
		auth: {
			persistSession: true,
			autoRefreshToken: true,
			detectSessionInUrl: true,
			flowType: 'implicit', // Use implicit flow for better compatibility
			storage: typeof window !== 'undefined' ? window.localStorage : undefined,
			storageKey: 'sb-auth-token', // Custom storage key
			debug: false // Disabled to prevent verbose GoTrueClient logs
		},
		db: {
			schema: 'public'
		},
		global: {
			headers: {
				'x-application-name': 'codehut',
			},
		},
		realtime: {
			params: {
				eventsPerSecond: 10 // Rate limit realtime events
			}
		}
	}
) : null;

export function isSupabaseEnabled(){
  return !!supabase;
}

// Server-side Supabase client with service role key (bypasses RLS)
export const supabaseAdmin = (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && 
  isValidSupabaseUrl(SUPABASE_URL) && isValidSupabaseKey(SUPABASE_SERVICE_ROLE_KEY)) ? createClient(
	SUPABASE_URL,
	SUPABASE_SERVICE_ROLE_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false
		},
		db: {
			schema: 'public'
		}
	}
) : null;

export function isSupabaseAdminEnabled(){
  return !!supabaseAdmin;
}

// Enhanced authentication helper functions
export const authHelpers = {
  // Check if user is authenticated
  isAuthenticated: async () => {
    if (!supabase) return false;
    const { data: { session } } = await supabase.auth.getSession();
    return !!session;
  },

  // Get current user with error handling
  getCurrentUser: async () => {
    if (!supabase) return null;
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) {
        console.error('Error getting current user:', error.message);
        return null;
      }
      return user;
    } catch (error) {
      console.error('Auth error:', error);
      return null;
    }
  },

  // Sign out with cleanup
  signOut: async () => {
    if (!supabase) return { error: { message: 'Supabase not initialized' } };
    
    try {
      const { error } = await supabase.auth.signOut();
      
      // Clear any additional client-side data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userFavorites');
        // Clear any other app-specific storage
      }
      
      return { error };
    } catch (error) {
      console.error('Sign out error:', error);
      return { error: { message: 'Failed to sign out' } };
    }
  },

  // Enhanced sign up with validation
  signUp: async (email: string, password: string, metadata?: Record<string, unknown>) => {
    if (!supabase) return { error: { message: 'Supabase not initialized' } };
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: { message: 'Invalid email format' } };
    }

    // Basic password validation (server-side validation should be primary)
    if (password.length < 8) {
      return { error: { message: 'Password must be at least 8 characters long' } };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: getRedirectURL(),
          data: metadata
        }
      });
      
      return { data, error };
    } catch (error) {
      console.error('Sign up error:', error);
      return { error: { message: 'Failed to sign up' } };
    }
  },

  // Enhanced sign in with rate limiting awareness
  signIn: async (email: string, password: string) => {
    if (!supabase) return { error: { message: 'Supabase not initialized' } };
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // Log failed attempt for security monitoring
        console.warn('Failed sign in attempt for email:', email);
      }
      
      return { data, error };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: { message: 'Failed to sign in' } };
    }
  },

  // Password reset with security
  resetPassword: async (email: string) => {
    if (!supabase) return { error: { message: 'Supabase not initialized' } };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { error: { message: 'Invalid email format' } };
    }

    try {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${getRedirectURL()}reset-password`
      });
      
      return { data, error };
    } catch (error) {
      console.error('Password reset error:', error);
      return { error: { message: 'Failed to send password reset email' } };
    }
  }
};

// Security monitoring helper
export const securityHelpers = {
  // Log security events (placeholder for production logging)
  logSecurityEvent: (eventType: string, details?: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`Security Event: ${eventType}`, details);
    }
    // In production, you would send this to your logging service
  },

  // Check for suspicious activity patterns
  detectSuspiciousActivity: () => {
    // Placeholder for suspicious activity detection
    // In production, you would implement actual detection logic
    return false;
  },

  // Validate session integrity
  validateSession: async () => {
    if (!supabase) return false;
    
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) return false;
      
      // Additional session validation could go here
      // Such as checking session age, IP consistency, etc.
      
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      return false;
    }
  }
};

// Export types for TypeScript support
export type AuthHelpers = typeof authHelpers;
export type SecurityHelpers = typeof securityHelpers;
