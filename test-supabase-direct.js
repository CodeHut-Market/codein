// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');
const { randomUUID } = require('crypto');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Testing direct Supabase connection...\n');

console.log('Environment check:');
console.log('- SUPABASE_URL:', supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'NOT FOUND');
console.log('- SERVICE_KEY:', supabaseServiceKey ? `${supabaseServiceKey.substring(0, 10)}...` : 'NOT FOUND');

if (!supabaseUrl || !supabaseServiceKey) {
  console.log('❌ Missing environment variables');
  console.log('Make sure .env.local has:');
  console.log('- NEXT_PUBLIC_SUPABASE_URL');
  console.log('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testDirectInsertion = async () => {
  try {
    console.log('\n� First, let\'s check existing users...');
    
    const { data: users, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id, username, email')
      .limit(5);
    
    if (usersError) {
      console.log('❌ Failed to query users:', usersError);
    } else {
      console.log(`Found ${users.length} existing users:`, users);
    }
    
    // Use existing user if available, otherwise create a test user
    let testUserId;
    if (users && users.length > 0) {
      testUserId = users[0].id;
      console.log(`\n✅ Using existing user: ${testUserId}`);
    } else {
      console.log('\n📝 Creating a test user first...');
      testUserId = randomUUID();
      const { data: newUser, error: userError } = await supabaseAdmin
        .from('users')
        .insert({
          id: testUserId,
          username: 'test-user',
          email: 'test@example.com',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select();
      
      if (userError) {
        console.log('❌ Failed to create test user:', userError);
        return;
      } else {
        console.log('✅ Created test user:', newUser);
      }
    }
    
    console.log('\n📝 Testing snippet insertion...');
    
    const testSnippet = {
      id: randomUUID(),
      title: 'Direct Supabase Test',
      code: 'console.log("Direct test");',
      description: 'Testing direct Supabase insertion',
      price: 0,
      rating: 0,
      author: 'Test User',
      author_id: testUserId,  // Use existing user ID
      user_id: testUserId,    // Use existing user ID
      tags: ['test'],
      language: 'javascript',
      framework: 'node',
      downloads: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    console.log('Snippet to insert:', JSON.stringify(testSnippet, null, 2));
    
    const { data, error } = await supabaseAdmin
      .from('snippets')
      .insert(testSnippet)
      .select();
    
    if (error) {
      console.log('❌ Supabase insertion failed:');
      console.log('Error code:', error.code);
      console.log('Error message:', error.message);
      console.log('Error details:', error.details);
      console.log('Full error:', JSON.stringify(error, null, 2));
    } else {
      console.log('✅ Supabase insertion successful!');
      console.log('Inserted data:', data);
    }
    
    // Test retrieval
    console.log('\n🔍 Testing snippet retrieval...');
    const { data: retrieveData, error: retrieveError } = await supabaseAdmin
      .from('snippets')
      .select('*')
      .eq('id', testSnippet.id);
    
    if (retrieveError) {
      console.log('❌ Supabase retrieval failed:', retrieveError);
    } else {
      console.log('✅ Supabase retrieval successful!');
      console.log('Retrieved data:', retrieveData);
    }
    
  } catch (err) {
    console.error('💥 Exception during direct test:', err);
  }
};

testDirectInsertion().catch(console.error);