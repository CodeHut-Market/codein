/**
 * Tavily Search Service for Internet-Wide Code Plagiarism Detection
 * 
 * Uses Tavily API to search for similar code across:
 * - GitHub repositories
 * - Stack Overflow
 * - Code documentation sites
 * - Programming blogs and tutorials
 */

import { TavilySearchResults } from '@langchain/community/tools/tavily_search';

// Initialize Tavily search tool
const tavilySearch = new TavilySearchResults({
  apiKey: process.env.LANGSEARCH_API_KEY || process.env.TAVILY_API_KEY || '',
  maxResults: 10,
});

export interface InternetCodeMatch {
  url: string;
  title: string;
  snippet: string;
  score: number;
  source: string; // 'github', 'stackoverflow', 'documentation', etc.
}

export interface InternetSearchResult {
  found: boolean;
  matches: InternetCodeMatch[];
  totalResults: number;
  searchQuery: string;
}

/**
 * Search the internet for similar code snippets
 */
export async function searchInternetForCode(
  code: string,
  language?: string
): Promise<InternetSearchResult> {
  try {
    console.log('[Tavily] Starting internet search for code plagiarism...');
    console.log('[Tavily] Code length:', code.length);
    console.log('[Tavily] Language:', language || 'unknown');

    // Extract key code patterns for search
    const searchQuery = buildCodeSearchQuery(code, language);
    console.log('[Tavily] Search query:', searchQuery);

    // Search using Tavily LangChain tool
    const searchResults = await (tavilySearch as any)._call(searchQuery);
    
    console.log('[Tavily] Raw search results:', searchResults);

    // Parse the results (LangChain returns a string, we need to parse it)
    let parsedResults: any[] = [];
    try {
      // The tool returns JSON string, parse it
      const resultData = typeof searchResults === 'string' 
        ? JSON.parse(searchResults) 
        : searchResults;
      
      parsedResults = Array.isArray(resultData) ? resultData : [resultData];
    } catch (parseError) {
      console.log('[Tavily] Could not parse results, using raw data');
      parsedResults = [];
    }

    console.log('[Tavily] Search completed, results:', parsedResults.length);

    // Parse and filter results
    const matches: InternetCodeMatch[] = parsedResults
      .map((result: any) => {
        const url = result.url || '';
        let source = 'web';
        
        if (url.includes('github.com')) source = 'github';
        else if (url.includes('stackoverflow.com')) source = 'stackoverflow';
        else if (url.includes('gitlab.com')) source = 'gitlab';
        else if (url.includes('bitbucket.org')) source = 'bitbucket';
        
        return {
          url: result.url || '',
          title: result.title || 'Untitled',
          snippet: result.content || result.snippet || result.description || '',
          score: result.score || 0.5, // Default score if not provided
          source,
        };
      })
      .filter((match) => match.url && match.snippet); // Only keep matches with URL and content

    console.log('[Tavily] Filtered matches:', matches.length);

    return {
      found: matches.length > 0,
      matches,
      totalResults: matches.length,
      searchQuery,
    };

  } catch (error) {
    console.error('[Tavily] Search failed:', error);
    console.error('[Tavily] Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      type: error?.constructor?.name,
    });

    // Return empty result on error
    return {
      found: false,
      matches: [],
      totalResults: 0,
      searchQuery: '',
    };
  }
}

/**
 * Build an effective search query from code
 * Extracts key patterns, function names, and unique code structures
 */
function buildCodeSearchQuery(code: string, language?: string): string {
  // Remove comments and whitespace
  let cleanCode = code
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*/g, '') // Remove line comments
    .replace(/#.*/g, '') // Remove Python/Shell comments
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();

  // Extract function/class names (common patterns)
  const functionPattern = /(?:function|def|class|const|let|var)\s+([a-zA-Z_][a-zA-Z0-9_]*)/g;
  const functionNames = [];
  let match;
  
  while ((match = functionPattern.exec(cleanCode)) !== null) {
    functionNames.push(match[1]);
  }

  // Build search query
  let query = '';
  
  if (language) {
    query += `${language} code `;
  }
  
  if (functionNames.length > 0) {
    // Use function names for more specific search
    query += functionNames.slice(0, 3).join(' ');
  } else {
    // Use first 200 characters of code
    query += cleanCode.substring(0, 200);
  }

  // Add code-specific search terms
  query += ' site:github.com OR site:stackoverflow.com';

  return query;
}

/**
 * Analyze internet search results and calculate similarity
 */
export function analyzeInternetMatches(matches: InternetCodeMatch[]): {
  overallSimilarity: number;
  highestMatch?: InternetCodeMatch;
  isPlagiarized: boolean;
} {
  if (matches.length === 0) {
    return {
      overallSimilarity: 0,
      isPlagiarized: false,
    };
  }

  // Find highest scoring match
  const highestMatch = matches.reduce((max, match) => 
    match.score > max.score ? match : max
  );

  // Calculate overall similarity (weighted average)
  const totalScore = matches.reduce((sum, match) => sum + match.score, 0);
  const overallSimilarity = Math.min(totalScore / matches.length, 1.0);

  // Consider plagiarized if highest match is above threshold
  const isPlagiarized = highestMatch.score > 0.7;

  return {
    overallSimilarity,
    highestMatch,
    isPlagiarized,
  };
}
