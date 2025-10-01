const BASE_URL = 'http://localhost:3000';

const createTestSnippet = async () => {
  console.log('🧪 Creating test snippet with authentication...');
  
  const testSnippet = {
    title: 'Test Snippet - Supabase Integration',
    code: `import React, { useState } from 'react';

export const Counter = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div className="counter">
      <h2>Count: {count}</h2>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
      <button onClick={() => setCount(count - 1)}>
        Decrement
      </button>
      <button onClick={() => setCount(0)}>
        Reset
      </button>
    </div>
  );
};`,
    description: 'A simple React counter component to test Supabase integration',
    language: 'JavaScript',
    tags: ['react', 'component', 'counter', 'test'],
    framework: 'React',
    price: 0
  };

  const authHeaders = {
    'Content-Type': 'application/json',
    'x-user-data': JSON.stringify({
      id: 'test-user-123',
      username: 'testuser',
      email: 'test@example.com'
    })
  };

  try {
    const response = await fetch(`${BASE_URL}/api/snippets`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(testSnippet)
    });

    if (response.ok) {
      const result = await response.json();
      console.log('✅ Snippet created successfully!');
      console.log('   ID:', result.snippet.id);
      console.log('   Title:', result.snippet.title);
      
      // Now test if we can retrieve it
      console.log('\n🔍 Testing retrieval...');
      const getResponse = await fetch(`${BASE_URL}/api/snippets`);
      const getResult = await getResponse.json();
      
      console.log(`📚 Total snippets in database: ${getResult.total}`);
      
      if (getResult.snippets.length > 0) {
        const snippet = getResult.snippets[0];
        console.log('   Latest snippet:', snippet.title);
        console.log('   Author:', snippet.author);
        console.log('   Language:', snippet.language);
        console.log('   Code preview:', snippet.code.slice(0, 50) + '...');
      }
      
      // Test semantic search
      console.log('\n🔍 Testing semantic search...');
      const searchResponse = await fetch(`${BASE_URL}/api/search?query=react counter&limit=5`);
      const searchResult = await searchResponse.json();
      
      console.log(`🔍 Search results: ${searchResult.count} found`);
      if (searchResult.results.length > 0) {
        console.log('   Found:', searchResult.results[0].title);
      }
      
    } else {
      const errorText = await response.text();
      console.log('❌ Failed to create snippet');
      console.log('   Status:', response.status);
      console.log('   Error:', errorText);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
};

// Check if native fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  console.log('❌ This test requires Node.js 18+ with native fetch support');
  console.log('   Your Node.js version:', process.version);
  process.exit(1);
}

createTestSnippet().catch(console.error);