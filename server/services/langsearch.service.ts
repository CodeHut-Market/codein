/**
 * Langsearch.com Web Search Service
 * Handles web search API calls for plagiarism detection and content verification
 */

interface LangsearchConfig {
  apiKey: string;
  baseUrl: string;
  timeout?: number;
}

interface SearchRequest {
  query: string;
  num_results?: number;
  language?: string;
  country?: string;
  search_type?: 'web' | 'news' | 'images' | 'videos';
}

interface SearchResult {
  title: string;
  url: string;
  snippet: string;
  published_date?: string;
  domain?: string;
}

interface LangsearchResponse {
  results: SearchResult[];
  total_results: number;
  search_time: number;
  query: string;
}

interface PlagiarismCheckRequest {
  content: string;
  language?: string;
  threshold?: number;
  check_sources?: string[];
}

interface PlagiarismResult {
  is_plagiarized: boolean;
  confidence_score: number;
  matched_sources: {
    url: string;
    title: string;
    similarity_score: number;
    matched_text: string[];
  }[];
  original_score: number;
}

class LangsearchService {
  private config: LangsearchConfig;

  constructor(config: LangsearchConfig) {
    this.config = {
      timeout: 30000, // 30 seconds default
      ...config
    };
  }

  /**
   * Perform web search using Langsearch API
   */
  async search(request: SearchRequest): Promise<LangsearchResponse> {
    try {
      const response = await fetch(`${this.config.baseUrl}/search`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`,
          'Content-Type': 'application/json',
          'User-Agent': 'CodeHut/1.0'
        },
        body: JSON.stringify({
          q: request.query,
          num: request.num_results || 10,
          lang: request.language || 'en',
          country: request.country || 'US',
          search_type: request.search_type || 'web'
        }),
        signal: AbortSignal.timeout(this.config.timeout!)
      });

      if (!response.ok) {
        throw new Error(`Langsearch API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Langsearch search error:', error);
      throw new Error(`Failed to perform web search: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Check for plagiarism using web search
   */
  async checkPlagiarism(request: PlagiarismCheckRequest): Promise<PlagiarismResult> {
    try {
      // Extract key phrases from the content for searching
      const searchQueries = this.extractSearchQueries(request.content);
      
      const allMatches: PlagiarismResult['matched_sources'] = [];
      let maxSimilarity = 0;

      // Search for each key phrase
      for (const query of searchQueries) {
        const searchResult = await this.search({
          query,
          num_results: 5,
          language: request.language
        });

        // Analyze each result for similarity
        for (const result of searchResult.results) {
          const similarity = this.calculateSimilarity(request.content, result.snippet);
          
          if (similarity > (request.threshold || 0.3)) {
            maxSimilarity = Math.max(maxSimilarity, similarity);
            
            allMatches.push({
              url: result.url,
              title: result.title,
              similarity_score: similarity,
              matched_text: this.findMatchingText(request.content, result.snippet)
            });
          }
        }
      }

      // Sort matches by similarity score
      allMatches.sort((a, b) => b.similarity_score - a.similarity_score);

      const isPlagiarized = maxSimilarity > (request.threshold || 0.5);
      const originalScore = Math.max(0, 1 - maxSimilarity);

      return {
        is_plagiarized: isPlagiarized,
        confidence_score: maxSimilarity,
        matched_sources: allMatches.slice(0, 10), // Top 10 matches
        original_score: originalScore
      };
    } catch (error) {
      console.error('Plagiarism check error:', error);
      throw new Error(`Failed to check plagiarism: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract meaningful search queries from content
   */
  private extractSearchQueries(content: string): string[] {
    // Remove code syntax and comments
    const cleanContent = content
      .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
      .replace(/\/\/.*$/gm, '') // Remove line comments
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();

    // Extract sentences and meaningful phrases
    const sentences = cleanContent
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 20 && s.length < 200);

    // Return top 3-5 most meaningful sentences for search
    return sentences
      .slice(0, 5)
      .map(s => `"${s}"`) // Use exact phrase search
      .filter(s => s.length > 10);
  }

  /**
   * Calculate similarity between two text strings
   */
  private calculateSimilarity(text1: string, text2: string): number {
    const words1 = new Set(text1.toLowerCase().split(/\W+/).filter(w => w.length > 3));
    const words2 = new Set(text2.toLowerCase().split(/\W+/).filter(w => w.length > 3));
    
    const intersection = new Set([...words1].filter(w => words2.has(w)));
    const union = new Set([...words1, ...words2]);
    
    return intersection.size / union.size;
  }

  /**
   * Find specific matching text between content and source
   */
  private findMatchingText(content: string, source: string): string[] {
    const contentSentences = content.split(/[.!?]+/).map(s => s.trim());
    const sourceSentences = source.split(/[.!?]+/).map(s => s.trim());
    
    const matches: string[] = [];
    
    for (const contentSentence of contentSentences) {
      for (const sourceSentence of sourceSentences) {
        if (this.calculateSimilarity(contentSentence, sourceSentence) > 0.7) {
          matches.push(contentSentence);
          break;
        }
      }
    }
    
    return matches.slice(0, 3); // Return top 3 matches
  }

  /**
   * Get service health status
   */
  async healthCheck(): Promise<{ status: 'ok' | 'error'; response_time: number }> {
    const start = Date.now();
    
    try {
      const response = await fetch(`${this.config.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.config.apiKey}`
        },
        signal: AbortSignal.timeout(5000)
      });
      
      const responseTime = Date.now() - start;
      
      return {
        status: response.ok ? 'ok' : 'error',
        response_time: responseTime
      };
    } catch (error) {
      return {
        status: 'error',
        response_time: Date.now() - start
      };
    }
  }
}

// Factory function to create Langsearch service instance
export function createLangsearchService(): LangsearchService | null {
  const apiKey = process.env.LANGSEARCH_API_KEY || process.env.WEB_SEARCH_API_KEY;
  const baseUrl = process.env.LANGSEARCH_BASE_URL || 'https://api.langsearch.com/v1';

  if (!apiKey) {
    console.warn('⚠️ Langsearch API key not configured. Web search features will be disabled.');
    return null;
  }

  return new LangsearchService({
    apiKey,
    baseUrl
  });
}

// Export the service class and types
export { LangsearchService };
export type { LangsearchResponse, PlagiarismCheckRequest, PlagiarismResult, SearchRequest, SearchResult };
