const BASE_URL = 'http://localhost:3000';

const testSpecificSnippet = async () => {
  console.log('🔍 Testing specific snippet that we know exists...');
  
  // We know this ID exists from our debug test
  const knownId = 'cd506d90-c001-4cc8-b733-9a93aa474bb4';
  
  try {
    console.log(`\n🎯 Testing specific snippet ID: ${knownId}`);
    const response = await fetch(`${BASE_URL}/api/snippets/${knownId}`);
    
    if (response.ok) {
      const snippet = await response.json();
      console.log('✅ Found specific snippet!');
      console.log(`   Title: ${snippet.title}`);
      console.log(`   Language: ${snippet.language}`);
      console.log(`   Author: ${snippet.author}`);
      console.log(`   Code preview: ${snippet.code.slice(0, 50)}...`);
      
      // Now test if this shows up in the general list
      console.log('\n📚 Testing if this snippet appears in general list...');
      const listResponse = await fetch(`${BASE_URL}/api/snippets?limit=10`);
      const listData = await listResponse.json();
      
      console.log(`📊 General list shows ${listData.total} snippets`);
      const foundInList = listData.snippets?.find(s => s.id === knownId);
      
      if (foundInList) {
        console.log('✅ Snippet found in general list!');
      } else {
        console.log('❌ Snippet NOT found in general list');
        console.log('   This suggests a difference between individual vs list retrieval');
      }
      
      // Test search for this specific snippet
      console.log('\n🔍 Testing search for this snippet...');
      const searchResponse = await fetch(`${BASE_URL}/api/search?query=${encodeURIComponent(snippet.title.split(' ')[0])}&limit=5`);
      const searchData = await searchResponse.json();
      
      console.log(`🔍 Search results: ${searchData.count} found`);
      const foundInSearch = searchData.results?.find(s => s.id === knownId);
      
      if (foundInSearch) {
        console.log('✅ Snippet found in search results!');
      } else {
        console.log('❌ Snippet NOT found in search results');
      }
      
    } else {
      console.log(`❌ Specific snippet not found: ${response.status}`);
      const errorText = await response.text();
      console.log(`   Error: ${errorText}`);
    }
    
  } catch (error) {
    console.log(`❌ Error testing specific snippet: ${error.message}`);
  }
};

// Check if native fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This test requires Node.js 18+ with native fetch support');
  console.log('   Your Node.js version:', process.version);
  process.exit(1);
}

testSpecificSnippet().catch(console.error);