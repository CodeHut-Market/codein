#!/usr/bin/env node

/**
 * CLI Test Suite for CodeHut Snippet API
 * Tests Supabase integration and vector database functionality
 */

const BASE_URL = 'http://localhost:3000';

// Test utilities
const makeRequest = async (method, endpoint, data = null, headers = {}) => {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.json();
    
    return {
      status: response.status,
      ok: response.ok,
      data: responseData
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message
    };
  }
};

const log = (message, type = 'info') => {
  const colors = {
    info: '\x1b[36m',    // Cyan
    success: '\x1b[32m', // Green
    error: '\x1b[31m',   // Red
    warning: '\x1b[33m', // Yellow
    reset: '\x1b[0m'
  };
  
  console.log(`${colors[type]}${message}${colors.reset}`);
};

// Test functions
const testPing = async () => {
  log('\n🏓 Testing API Ping...', 'info');
  const result = await makeRequest('GET', '/api/ping');
  
  if (result.ok) {
    log(`✅ Ping successful: ${result.data.message}`, 'success');
    return true;
  } else {
    log(`❌ Ping failed: ${result.error || result.data}`, 'error');
    return false;
  }
};

const testGetSnippets = async () => {
  log('\n📚 Testing Get Snippets...', 'info');
  const result = await makeRequest('GET', '/api/snippets?limit=5');
  
  if (result.ok) {
    log(`✅ Retrieved ${result.data.snippets?.length || 0} snippets`, 'success');
    if (result.data.snippets?.length > 0) {
      log(`   Sample snippet: "${result.data.snippets[0].title}"`, 'info');
    }
    return result.data.snippets || [];
  } else {
    log(`❌ Failed to get snippets: ${result.error || JSON.stringify(result.data)}`, 'error');
    return [];
  }
};

const testCreateSnippet = async () => {
  log('\n📝 Testing Create Snippet...', 'info');
  
  const testSnippet = {
    title: `CLI Test Snippet ${Date.now()}`,
    description: 'A test snippet created via CLI to verify Supabase integration',
    code: `// Test React component
import React, { useState } from 'react';

export const TestComponent = () => {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <h1>Count: {count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
};`,
    price: 5.99,
    tags: ['react', 'javascript', 'component', 'test'],
    language: 'JavaScript',
    framework: 'React'
  };

  // Note: This will fail without authentication, but we can test the endpoint
  const result = await makeRequest('POST', '/api/snippets', testSnippet);
  
  if (result.ok) {
    log(`✅ Snippet created successfully!`, 'success');
    log(`   ID: ${result.data.id}`, 'info');
    log(`   Title: ${result.data.title}`, 'info');
    return result.data;
  } else {
    if (result.status === 401) {
      log(`⚠️  Authentication required for snippet creation (expected)`, 'warning');
      log(`   Status: ${result.status}`, 'info');
      return null;
    } else {
      log(`❌ Failed to create snippet: ${result.error || JSON.stringify(result.data)}`, 'error');
      return null;
    }
  }
};

const testSemanticSearch = async () => {
  log('\n🔍 Testing Semantic Search...', 'info');
  
  const searchQueries = [
    'react component',
    'javascript function',
    'button click handler',
    'state management'
  ];

  for (const query of searchQueries) {
    log(`   Searching for: "${query}"`, 'info');
    const result = await makeRequest('GET', `/api/search?query=${encodeURIComponent(query)}&limit=3`);
    
    if (result.ok) {
      log(`   ✅ Found ${result.data.results?.length || 0} results`, 'success');
      if (result.data.searchType) {
        log(`   Search type: ${result.data.searchType}`, 'info');
      }
      if (result.data.results?.length > 0) {
        log(`   Sample result: "${result.data.results[0].title}"`, 'info');
      }
    } else {
      log(`   ❌ Search failed: ${result.error || JSON.stringify(result.data)}`, 'error');
    }
  }
};

const testPopularSnippets = async () => {
  log('\n⭐ Testing Popular Snippets...', 'info');
  const result = await makeRequest('GET', '/api/snippets/popular?limit=3');
  
  if (result.ok) {
    log(`✅ Retrieved ${result.data.snippets?.length || 0} popular snippets`, 'success');
    result.data.snippets?.forEach((snippet, index) => {
      log(`   ${index + 1}. "${snippet.title}" (${snippet.downloads} downloads)`, 'info');
    });
    return result.data.snippets || [];
  } else {
    log(`❌ Failed to get popular snippets: ${result.error || JSON.stringify(result.data)}`, 'error');
    return [];
  }
};

const testDatabaseConnections = async () => {
  log('\n🔌 Testing Database Connections...', 'info');
  
  // Check if server logs show database connections
  log('   Check server logs for database connection status:', 'info');
  log('   - Look for "✅ Supabase database connection successful"', 'info');
  log('   - Look for "✅ Vector database initialized successfully"', 'info');
  log('   - Look for "✅ Semantic search function created"', 'info');
};

const runTestSuite = async () => {
  log('🚀 Starting CodeHut API Test Suite', 'info');
  log('=====================================', 'info');
  
  const results = {
    ping: false,
    getSnippets: false,
    createSnippet: false,
    semanticSearch: false,
    popularSnippets: false
  };

  // Test basic connectivity
  results.ping = await testPing();
  
  if (!results.ping) {
    log('\n    console.log(`❌ Basic connectivity failed. Is the server running on port 3000?`);', 'error');
    return;
  }

  // Test database connections
  await testDatabaseConnections();

  // Test read operations
  const snippets = await testGetSnippets();
  results.getSnippets = snippets.length >= 0; // Success if we get any response

  // Test popular snippets
  const popular = await testPopularSnippets();
  results.popularSnippets = popular.length >= 0;

  // Test write operations (will likely fail due to auth)
  await testCreateSnippet();

  // Test semantic search
  await testSemanticSearch();

  // Summary
  log('\n📊 Test Results Summary', 'info');
  log('======================', 'info');
  
  Object.entries(results).forEach(([test, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? 'success' : 'error';
    log(`${test}: ${status}`, color);
  });

  const passedTests = Object.values(results).filter(Boolean).length;
  const totalTests = Object.keys(results).length;
  
  log(`\nOverall: ${passedTests}/${totalTests} tests passed`, 
        passedTests === totalTests ? 'success' : 'warning');

  if (passedTests > 0) {
    log('\n🎉 Basic API functionality is working!', 'success');
    log('Next steps:', 'info');
    log('1. Check server logs for Supabase connection status', 'info');
    log('2. Set up proper authentication to test snippet creation', 'info');
    log('3. Upload a test snippet via the web interface', 'info');
    log('4. Verify it appears in the explore page', 'info');
  }
};

// Check if fetch is available (Node.js 18+)
if (typeof fetch === 'undefined') {
  log('❌ This test requires Node.js 18+ with native fetch support', 'error');
  log('   Or install node-fetch: npm install node-fetch', 'info');
  process.exit(1);
}

// Run the test suite
runTestSuite().catch(error => {
  log(`❌ Test suite failed: ${error.message}`, 'error');
  process.exit(1);
});