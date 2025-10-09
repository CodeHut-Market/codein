import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Environment variables for server-side Supabase
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY; // For admin operations

// Validation functions
const isValidSupabaseUrl = (url: string | undefined): boolean => {
  return !!(url && 
    !url.includes('your-supabase-url-here') && 
    !url.includes('placeholder') &&
    url.startsWith('https://'));
};

const isValidSupabaseKey = (key: string | undefined): boolean => {
  return !!(key && 
    !key.includes('your-supabase-anon-key-here') && 
    !key.includes('placeholder') &&
    key.length > 20);
};

// Create Supabase client for server-side operations
export const supabaseClient: SupabaseClient | null = 
  (SUPABASE_URL && SUPABASE_ANON_KEY && 
   isValidSupabaseUrl(SUPABASE_URL) && isValidSupabaseKey(SUPABASE_ANON_KEY)) 
    ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
        db: {
          schema: 'public'
        }
      }) 
    : null;

// Create admin client with service role key (for operations that bypass RLS)
export const supabaseAdmin: SupabaseClient | null = 
  (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && 
   isValidSupabaseUrl(SUPABASE_URL) && isValidSupabaseKey(SUPABASE_SERVICE_ROLE_KEY)) 
    ? createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
          detectSessionInUrl: false,
        },
        db: {
          schema: 'public'
        }
      }) 
    : null;

// Helper function to check if Supabase is available
export const isSupabaseAvailable = (): boolean => {
  return !!supabaseClient;
};

// Database types for Supabase
export interface SupabaseSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  price: number;
  rating: number;
  author: string;
  author_id: string;
  tags: string[];
  language: string;
  framework: string | null;
  downloads: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    username: string;
  } | null;
}

export interface SupabaseUser {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  total_snippets: number;
  total_downloads: number;
  rating: number;
  role: 'user' | 'admin' | 'moderator';
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
}

// Helper functions for database operations
export const supabaseHelpers = {
  // Convert Supabase snippet to API format
  mapSupabaseSnippetToAPI: (snippet: SupabaseSnippet) => ({
    id: snippet.id,
    title: snippet.title,
    description: snippet.description,
    code: snippet.code,
    price: snippet.price,
    rating: snippet.rating,
    author: snippet.profiles?.username || snippet.author || 'Anonymous',
    authorId: snippet.author_id,
    tags: snippet.tags || [],
    language: snippet.language,
    framework: snippet.framework || '',
    downloads: snippet.downloads || 0,
    createdAt: snippet.created_at,
    updatedAt: snippet.updated_at,
  }),

  // Generate unique ID for new snippets
  generateSnippetId: (): string => {
    return `snippet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Validate snippet data
  validateSnippetData: (data: any): boolean => {
    return !!(
      data.title &&
      data.description &&
      data.code &&
      data.language &&
      typeof data.price === 'number' &&
      data.price >= 0
    );
  },

  // Search snippets with filters
  buildSearchQuery: (supabase: SupabaseClient, filters: any) => {
    let query = supabase
      .from('snippets')
      .select(`
        *,
        profiles:author_id (
          username
        )
      `);

    // Apply filters
    if (filters.language) {
      query = query.ilike('language', `%${filters.language}%`);
    }

    if (filters.framework) {
      query = query.ilike('framework', `%${filters.framework}%`);
    }

    if (filters.author) {
      query = query.ilike('author', `%${filters.author}%`);
    }

    if (filters.minPrice !== undefined) {
      query = query.gte('price', filters.minPrice);
    }

    if (filters.maxPrice !== undefined) {
      query = query.lte('price', filters.maxPrice);
    }

    if (filters.search) {
      // Use text search on title, description, and tags
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
    }

    // Apply sorting
    const sortField = filters.sortBy || 'created_at';
    const sortOrder = filters.sortOrder === 'asc' ? true : false;
    query = query.order(sortField, { ascending: sortOrder });

    // Apply pagination
    if (filters.limit && filters.offset !== undefined) {
      query = query.range(filters.offset, filters.offset + filters.limit - 1);
    }

    return query;
  }
};

// Test Supabase connection
export const testSupabaseConnection = async (): Promise<boolean> => {
  if (!supabaseClient) {
    console.warn('⚠️  Supabase client not initialized - check environment variables');
    return false;
  }

  try {
    const { data, error } = await supabaseClient
      .from('snippets')
      .select('id')
      .limit(1);

    if (error) {
      console.error('❌ Supabase connection test failed:', error.message);
      return false;
    }

    console.log('✅ Supabase connection successful');
    return true;
  } catch (error) {
    console.error('❌ Supabase connection error:', error);
    return false;
  }
};

export default supabaseClient;