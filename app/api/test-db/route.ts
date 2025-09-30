import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseEnabled, supabase } from '../../lib/supabaseClient';

export async function GET(req: NextRequest) {
  try {
    console.log('Database test - Starting connection test');
    
    if (!isSupabaseEnabled()) {
      return NextResponse.json({
        status: 'error',
        message: 'Supabase is not enabled',
        hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
      });
    }

    console.log('Database test - Supabase is enabled, testing connection');

    // Test if snippets table exists by trying to select from it
    const { data, error } = await supabase!
      .from('snippets')
      .select('id, title')
      .limit(1);

    if (error) {
      console.error('Database test - Error querying snippets table:', error);
      return NextResponse.json({
        status: 'error',
        message: 'Database table not found or connection failed',
        error: error.message,
        code: error.code,
        details: error.details,
        hint: 'You may need to run the database migration from supabase/migrations/001_enhanced_snippets_schema.sql'
      });
    }

    console.log('Database test - Successfully connected and queried database');
    return NextResponse.json({
      status: 'success',
      message: 'Database connection successful',
      snippetsCount: data?.length || 0,
      sampleData: data
    });

  } catch (err) {
    console.error('Database test - Exception:', err);
    return NextResponse.json({
      status: 'error',
      message: 'Database connection failed',
      error: err instanceof Error ? err.message : 'Unknown error'
    });
  }
}