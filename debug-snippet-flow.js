const BASE_URL = 'http://localhost:3000';

const debugSnippetFlow = async () => {
  console.log('🔍 Debugging snippet creation and retrieval flow...\n');
  
  // Step 1: Check initial state
  console.log('📊 Step 1: Checking initial snippet count...');
  const initialResponse = await fetch(`${BASE_URL}/api/snippets`);
  const initialData = await initialResponse.json();
  console.log(`   Initial snippets: ${initialData.total}`);
  
  // Step 2: Create a snippet
  console.log('\n📝 Step 2: Creating test snippet...');
  const testSnippet = {
    title: `Debug Test Snippet ${Date.now()}`,
    code: 'console.log("Debug test snippet");',
    description: 'A debug test snippet to verify flow',
    language: 'JavaScript',
    tags: ['debug', 'test'],
    framework: 'Node.js',
    price: 0
  };

  const authHeaders = {
    'Content-Type': 'application/json',
    'x-user-data': JSON.stringify({
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef', // Use UUID format
      username: 'debugUser',
      email: 'debug@test.com'
    })
  };

  const createResponse = await fetch(`${BASE_URL}/api/snippets`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify(testSnippet)
  });

  if (createResponse.ok) {
    const createResult = await createResponse.json();
    console.log(`   ✅ Created snippet ID: ${createResult.snippet.id}`);
    const snippetId = createResult.snippet.id;
    
    // Step 3: Immediately try to retrieve the specific snippet
    console.log('\n🔍 Step 3: Retrieving specific snippet...');
    const getSpecificResponse = await fetch(`${BASE_URL}/api/snippets/${snippetId}`);
    
    if (getSpecificResponse.ok) {
      const specificSnippet = await getSpecificResponse.json();
      console.log(`   ✅ Found specific snippet: "${specificSnippet.title}"`);
    } else {
      console.log(`   ❌ Specific snippet not found: ${getSpecificResponse.status}`);
      const errorText = await getSpecificResponse.text();
      console.log(`   Error: ${errorText}`);
    }
    
    // Step 4: Check snippet list again
    console.log('\n📚 Step 4: Checking snippet list after creation...');
    const afterResponse = await fetch(`${BASE_URL}/api/snippets?debug=true`);
    const afterData = await afterResponse.json();
    console.log(`   Snippets count: ${afterData.total}`);
    if (afterData.debug) {
      console.log(`   Debug info:`, afterData.debug);
    }
    
    // Step 5: Test direct Supabase query via debug endpoint
    console.log('\n🔬 Step 5: Testing database connection...');
    const debugResponse = await fetch(`${BASE_URL}/api/debug`);
    const debugData = await debugResponse.json();
    console.log(`   Supabase enabled: ${debugData.supabaseEnabled}`);
    console.log(`   DB connection: ${debugData.dbConnectionTest?.success ? 'SUCCESS' : 'FAILED'}`);
    
  } else {
    const errorText = await createResponse.text();
    console.log(`   ❌ Failed to create snippet: ${createResponse.status}`);
    console.log(`   Error: ${errorText}`);
  }
};

// Check if native fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This test requires Node.js 18+ with native fetch support');
  console.log('   Your Node.js version:', process.version);
  process.exit(1);
}

debugSnippetFlow().catch(console.error);