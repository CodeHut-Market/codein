// Load environment variables from .env.local
require('dotenv').config({ path: '.env.local' });

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Create admin client
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const createTestUser = async () => {
  try {
    const testUserId = 'a1b2c3d4-e5f6-7890-1234-567890abcdef';
    
    console.log('🔍 Creating test user for snippet testing...');
    console.log('User ID:', testUserId);
    
    const { data, error } = await supabaseAdmin
      .from('users')
      .upsert({
        id: testUserId,
        username: 'debugUser',
        email: 'debug@test.com',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();
    
    if (error) {
      console.log('❌ Failed to create test user:', error);
    } else {
      console.log('✅ Test user created/updated successfully:', data);
    }
    
  } catch (err) {
    console.error('💥 Exception:', err);
  }
};

createTestUser().catch(console.error);