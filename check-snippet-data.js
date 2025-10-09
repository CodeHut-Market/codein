// Quick script to check what's actually in the snippets table
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSnippets() {
  console.log('\n🔍 Checking snippets data...\n');
  
  const { data: snippets, error } = await supabase
    .from('snippets')
    .select('id, title, author, author_id, created_at, visibility, price')
    .limit(5);
  
  if (error) {
    console.error('❌ Error:', error);
    return;
  }
  
  console.log(`Found ${snippets.length} snippets:\n`);
  snippets.forEach((s, i) => {
    console.log(`${i + 1}. "${s.title}"`);
    console.log(`   ID: ${s.id}`);
    console.log(`   Author field: "${s.author}"`);
    console.log(`   Author ID: "${s.author_id}"`);
    console.log(`   Created: ${s.created_at}`);
    console.log(`   Visibility: ${s.visibility || 'not set'}`);
    console.log(`   Price: ${s.price}`);
    console.log('');
  });
  
  // Check if profiles table exists
  console.log('\n🔍 Checking profiles table...\n');
  const { data: profiles, error: profError } = await supabase
    .from('profiles')
    .select('id, username')
    .limit(5);
  
  if (profError) {
    console.error('❌ Profiles error:', profError.message);
  } else {
    console.log(`Found ${profiles.length} profiles:\n`);
    profiles.forEach((p, i) => {
      console.log(`${i + 1}. ${p.username} (ID: ${p.id})`);
    });
  }
}

checkSnippets().then(() => process.exit(0));
