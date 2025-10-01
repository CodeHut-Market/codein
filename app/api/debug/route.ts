import { NextRequest, NextResponse } from 'next/server';
import { isSupabaseAdminEnabled, isSupabaseEnabled, supabase } from '../../lib/supabaseClient';

export async function GET(request: NextRequest) {
  try {
    console.log('Debug endpoint - checking environment');
    
    const debugInfo = {
      timestamp: new Date().toISOString(),
      supabaseEnabled: isSupabaseEnabled(),
      supabaseAdminEnabled: isSupabaseAdminEnabled(),
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasSupabaseKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      supabaseUrlValid: process.env.NEXT_PUBLIC_SUPABASE_URL && 
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder') &&
        !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-supabase-url-here'),
      nodeEnv: process.env.NODE_ENV,
    };

    console.log('Debug info:', debugInfo);

    // Test database connection if enabled
    let dbConnectionTest = null;
    if (isSupabaseEnabled() && supabase) {
      try {
        console.log('Testing database connection');
        const { data, error } = await supabase.from('snippets').select('count').limit(1);
        if (error) {
          console.error('Database test error:', error);
          dbConnectionTest = { success: false, error: error.message };
        } else {
          console.log('Database test successful');
          dbConnectionTest = { success: true, message: 'Connection successful' };
        }
      } catch (err) {
        console.error('Database test exception:', err);
        dbConnectionTest = { 
          success: false, 
          error: err instanceof Error ? err.message : 'Unknown error' 
        };
      }
    }

    return NextResponse.json({
      ...debugInfo,
      dbConnectionTest,
      message: 'Debug info retrieved'
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    return NextResponse.json(
      { 
        error: 'Debug endpoint failed', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}