import { NextResponse } from 'next/server';
import { isSupabaseEnabled, supabase } from '../../../lib/supabaseClient';

export async function GET() {
  if (!isSupabaseEnabled() || !supabase) {
    return NextResponse.json({ error: 'Supabase not enabled' }, { status: 500 });
  }

  try {
    // Test 1: Check if snippets table exists
    console.log('Testing table existence...');
    const { data: tableData, error: tableError } = await supabase
      .from('snippets')
      .select('*')
      .limit(1);
    
    let tableExists = !tableError;
    console.log('Table exists:', tableExists);
    if (tableError) {
      console.log('Table error:', tableError);
    }

    // Test 2: Try to get table schema information
    let schemaInfo = null;
    try {
      const { data: schemaData, error: schemaError } = await supabase
        .rpc('get_table_schema', { table_name: 'snippets' });
      if (!schemaError) {
        schemaInfo = schemaData;
      }
    } catch (e) {
      console.log('Schema query not available');
    }

    // Test 3: Manual snippet insertion test
    let insertTest = null;
    if (tableExists) {
      console.log('Testing manual insert...');
      const testUserId = crypto.randomUUID();
      const testSnippet = {
        id: crypto.randomUUID(), // Use proper UUID
        title: 'Manual Test Snippet',
        code: 'console.log("manual test");',
        description: 'Manual test',
        language: 'JavaScript',
        author: 'test',
        author_id: testUserId, // Use UUID for author_id
        user_id: testUserId,   // Use UUID for user_id
        price: 0,
        rating: 0,
        downloads: 0,
        tags: ['test'],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data: insertData, error: insertError } = await supabase
        .from('snippets')
        .insert(testSnippet)
        .select();

      insertTest = {
        success: !insertError,
        error: insertError?.message,
        data: insertData
      };
      console.log('Insert test result:', insertTest);
    }

    // Test 4: Count existing snippets
    let countTest = null;
    if (tableExists) {
      const { count, error: countError } = await supabase
        .from('snippets')
        .select('*', { count: 'exact', head: true });
      
      countTest = {
        count: count,
        error: countError?.message
      };
      console.log('Count test:', countTest);
    }

    return NextResponse.json({
      tableExists,
      tableError: tableError?.message,
      schemaInfo,
      insertTest,
      countTest,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Database test error:', error);
    return NextResponse.json({
      error: 'Database test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';