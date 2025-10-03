// Quick test to verify Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://lapgjnimnkyyxeltzcxw.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcGdqbmltbmt5eXhlbHR6Y3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2OTMzOTgsImV4cCI6MjA3NDI2OTM5OH0.tcQ6s07MNwvTonr35cXdvOG4QTDuTgrDX4Xqdsp1CNA';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('Testing Supabase connection...');
  
  try {
    const { data, error, count } = await supabase
      .from('snippets')
      .select('id, title, downloads', { count: 'exact' })
      .order('downloads', { ascending: false })
      .limit(5);
    
    if (error) {
      console.error('❌ Error:', error.message);
      console.error('Error code:', error.code);
      console.error('Error details:', error.details);
      console.error('Error hint:', error.hint);
      return;
    }
    
    console.log('✅ Connection successful!');
    console.log('Total snippets:', count);
    console.log('Snippets retrieved:', data?.length || 0);
    
    if (data && data.length > 0) {
      console.log('\nTop snippets:');
      data.forEach((s, i) => {
        console.log(`  ${i + 1}. ${s.title} (downloads: ${s.downloads || 0}, id: ${s.id})`);
      });
    } else {
      console.log('\n⚠️  No snippets found in database - table might be empty');
    }
  } catch (err) {
    console.error('❌ Exception:', err.message);
  }
}

testConnection();
