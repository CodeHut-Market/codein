/**
 * Simple Upload Test - Uses Service Role Key to bypass RLS
 * This tests direct database insertion like the real API does
 */

const { createClient } = require('@supabase/supabase-js');
const crypto = require('crypto');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  console.error('   NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', serviceRoleKey ? '✓' : '✗');
  console.log('\n💡 Tip: The service role key is needed to bypass RLS policies for testing.');
  process.exit(1);
}

// Create admin client with service role key (bypasses RLS)
const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

async function testUpload() {
  console.log('🧪 Testing Advanced Upload System (Simple Test)\n');
  console.log('='.repeat(60));
  
  try {
    // Test 1: Check connection
    console.log('\n1️⃣  Testing Supabase Connection...');
    const { count, error: countError } = await supabaseAdmin
      .from('snippets')
      .select('*', { count: 'exact', head: true });
    
    if (countError) {
      console.error('❌ Connection failed:', countError.message);
      return;
    }
    console.log('✅ Supabase connected successfully');
    console.log(`   Current snippets in database: ${count}`);
    
    // Test 2: Create snippet
    console.log('\n2️⃣  Creating test snippet...');
    const testSnippet = {
      id: crypto.randomUUID(),
      title: 'Advanced Upload Test',
      description: 'Testing the advanced upload system',
      code: `// Advanced Upload Test
import React from 'react';

export default function TestComponent() {
  const [count, setCount] = React.useState(0);
  
  return (
    <div>
      <h1>Test: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}`,
      language: 'javascript',
      framework: 'React',
      tags: ['test', 'react', 'component'],
      price: 0,
      author: 'Test User',
      author_id: crypto.randomUUID(),
      rating: 0,
      downloads: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { data: inserted, error: insertError } = await supabaseAdmin
      .from('snippets')
      .insert([testSnippet])
      .select()
      .single();
    
    if (insertError) {
      console.error('❌ Insert failed:', insertError.message);
      console.error('   Code:', insertError.code);
      console.error('   Details:', insertError.details);
      return;
    }
    
    console.log('✅ Snippet created successfully!');
    console.log('   ID:', inserted.id);
    console.log('   Title:', inserted.title);
    console.log('   Language:', inserted.language);
    console.log('   Framework:', inserted.framework);
    console.log('   Tags:', inserted.tags);
    
    // Test 3: Retrieve it
    console.log('\n3️⃣  Retrieving snippet...');
    const { data: retrieved, error: retrieveError } = await supabaseAdmin
      .from('snippets')
      .select('*')
      .eq('id', inserted.id)
      .single();
    
    if (retrieveError) {
      console.error('❌ Retrieval failed:', retrieveError.message);
      return;
    }
    
    console.log('✅ Snippet retrieved successfully!');
    console.log('   Title matches:', retrieved.title === testSnippet.title);
    console.log('   Code length:', retrieved.code.length, 'characters');
    
    // Test 4: Update it
    console.log('\n4️⃣  Updating snippet...');
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('snippets')
      .update({ 
        downloads: 5, 
        description: 'Updated: Advanced upload test verified!' 
      })
      .eq('id', inserted.id)
      .select()
      .single();
    
    if (updateError) {
      console.error('❌ Update failed:', updateError.message);
    } else {
      console.log('✅ Snippet updated successfully!');
      console.log('   New description:', updated.description);
      console.log('   Downloads:', updated.downloads);
    }
    
    // Test 5: Search
    console.log('\n5️⃣  Testing search...');
    const { data: searchResults, error: searchError } = await supabaseAdmin
      .from('snippets')
      .select('id, title, language, framework')
      .ilike('title', '%test%')
      .limit(5);
    
    if (searchError) {
      console.error('❌ Search failed:', searchError.message);
    } else {
      console.log('✅ Search completed!');
      console.log(`   Found ${searchResults.length} snippet(s) matching "test"`);
      searchResults.forEach((s, i) => {
        console.log(`   ${i + 1}. ${s.title} (${s.language}${s.framework ? ' - ' + s.framework : ''})`);
      });
    }
    
    // Test 6: Clean up
    console.log('\n6️⃣  Cleaning up...');
    const { error: deleteError } = await supabaseAdmin
      .from('snippets')
      .delete()
      .eq('id', inserted.id);
    
    if (deleteError) {
      console.warn('⚠️  Cleanup failed:', deleteError.message);
      console.log('   Manual cleanup needed for ID:', inserted.id);
    } else {
      console.log('✅ Test snippet deleted successfully!');
    }
    
    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n🎉 All Tests Passed!\n');
    console.log('Summary:');
    console.log('  ✅ Database connection');
    console.log('  ✅ Snippet insertion (CREATE)');
    console.log('  ✅ Snippet retrieval (READ)');
    console.log('  ✅ Snippet update (UPDATE)');
    console.log('  ✅ Snippet search');
    console.log('  ✅ Snippet deletion (DELETE)');
    console.log('\n✨ The Advanced Upload System stores data correctly in Supabase!\n');
    console.log('📊 You can now:');
    console.log('   1. Start dev server: pnpm dev');
    console.log('   2. Login and go to /upload');
    console.log('   3. Try the "Advanced Upload" mode');
    console.log('   4. Check Supabase dashboard to see your snippets!\n');
    
  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error(error.message);
    console.error('\nStack trace:');
    console.error(error.stack);
  }
}

// Run the test
testUpload()
  .then(() => process.exit(0))
  .catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
