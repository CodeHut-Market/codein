import { supabase } from './supabaseClient';

/**
 * Plagiarism Detection Service
 * 
 * Detects code similarity against existing snippets in the database
 */

interface PlagiarismResult {
  isPlagiarized: boolean;
  similarity: number;
  threshold: number;
  status: 'PASS' | 'REVIEW' | 'BLOCK';
  matchedSnippets?: Array<{
    id: string;
    title: string;
    author: string;
    similarity: number;
  }>;
  message: string;
}

// Similarity thresholds
const THRESHOLDS = {
  BLOCK: 0.85,    // ≥85% similarity = plagiarism, block upload
  REVIEW: 0.65,   // 65-85% = suspicious, require review
  PASS: 0.65,     // <65% = clean, allow upload
};

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      if (str1.charAt(i - 1) === str2.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[len1][len2];
}

/**
 * Normalize code by removing comments, whitespace, and formatting
 */
function normalizeCode(code: string): string {
  return code
    // Remove single-line comments
    .replace(/\/\/.*/g, '')
    // Remove multi-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '')
    // Remove all whitespace and newlines
    .replace(/\s+/g, '')
    // Convert to lowercase
    .toLowerCase()
    // Remove common variable name patterns (var1, var2, etc.)
    .replace(/[a-z]\d+/g, 'VAR');
}

/**
 * Calculate similarity between two code snippets (0-1)
 */
function calculateCodeSimilarity(code1: string, code2: string): number {
  // Normalize both code snippets
  const normalized1 = normalizeCode(code1);
  const normalized2 = normalizeCode(code2);
  
  // If one is empty, return 0 similarity
  if (!normalized1 || !normalized2) {
    return 0;
  }
  
  // Calculate Levenshtein distance
  const distance = levenshteinDistance(normalized1, normalized2);
  const maxLength = Math.max(normalized1.length, normalized2.length);
  
  // Convert distance to similarity (0-1)
  const similarity = 1 - (distance / maxLength);
  
  return Math.max(0, Math.min(1, similarity));
}

/**
 * Generate n-grams (shingles) from normalized code
 */
function generateNGrams(code: string, n: number = 5): Set<string> {
  const normalized = normalizeCode(code);
  const ngrams = new Set<string>();
  
  for (let i = 0; i <= normalized.length - n; i++) {
    ngrams.add(normalized.substring(i, i + n));
  }
  
  return ngrams;
}

/**
 * Calculate Jaccard similarity using n-grams
 */
function calculateJaccardSimilarity(code1: string, code2: string): number {
  const ngrams1 = generateNGrams(code1);
  const ngrams2 = generateNGrams(code2);
  
  if (ngrams1.size === 0 && ngrams2.size === 0) return 0;
  
  const intersection = new Set([...ngrams1].filter(x => ngrams2.has(x)));
  const union = new Set([...ngrams1, ...ngrams2]);
  
  return intersection.size / union.size;
}

/**
 * Main plagiarism detection function
 */
export async function detectPlagiarism(
  code: string,
  language?: string,
  excludeAuthorId?: string
): Promise<PlagiarismResult> {
  try {
    // Validate input
    if (!code || code.trim().length < 10) {
      return {
        isPlagiarized: false,
        similarity: 0,
        threshold: THRESHOLDS.PASS,
        status: 'PASS',
        message: 'Code too short for plagiarism check',
      };
    }

    // Fetch all snippets from Supabase for comparison
    let query = supabase!.from('snippets').select('id, title, code, author, author_id');
    
    // Filter by language if provided
    if (language) {
      query = query.eq('language', language);
    }
    
    // Exclude snippets by the same author
    if (excludeAuthorId) {
      query = query.neq('author_id', excludeAuthorId);
    }
    
    const { data: existingSnippets, error } = await query;
    
    if (error) {
      console.error('Error fetching snippets for plagiarism check:', error);
      throw new Error('Failed to fetch snippets for comparison');
    }
    
    // If no existing snippets, code is clean
    if (!existingSnippets || existingSnippets.length === 0) {
      return {
        isPlagiarized: false,
        similarity: 0,
        threshold: THRESHOLDS.PASS,
        status: 'PASS',
        message: 'No existing snippets to compare against',
      };
    }
    
    // Check similarity against all existing snippets
    const matches: Array<{
      id: string;
      title: string;
      author: string;
      similarity: number;
    }> = [];
    
    let maxSimilarity = 0;
    
    for (const snippet of existingSnippets) {
      // Calculate similarity using both methods and take the max
      const levenshteinSim = calculateCodeSimilarity(code, snippet.code);
      const jaccardSim = calculateJaccardSimilarity(code, snippet.code);
      const combinedSimilarity = Math.max(levenshteinSim, jaccardSim);
      
      if (combinedSimilarity > 0.4) { // Only track significant similarities
        matches.push({
          id: snippet.id,
          title: snippet.title,
          author: snippet.author,
          similarity: parseFloat(combinedSimilarity.toFixed(3)),
        });
      }
      
      maxSimilarity = Math.max(maxSimilarity, combinedSimilarity);
    }
    
    // Sort matches by similarity (highest first)
    matches.sort((a, b) => b.similarity - a.similarity);
    
    // Determine status based on max similarity
    let status: 'PASS' | 'REVIEW' | 'BLOCK';
    let message: string;
    let isPlagiarized: boolean;
    
    if (maxSimilarity >= THRESHOLDS.BLOCK) {
      status = 'BLOCK';
      isPlagiarized = true;
      message = `High similarity (${(maxSimilarity * 100).toFixed(1)}%) detected with existing code. Upload blocked.`;
    } else if (maxSimilarity >= THRESHOLDS.REVIEW) {
      status = 'REVIEW';
      isPlagiarized = true;
      message = `Moderate similarity (${(maxSimilarity * 100).toFixed(1)}%) detected. Please review your code for originality.`;
    } else {
      status = 'PASS';
      isPlagiarized = false;
      message = `Code appears original (${(maxSimilarity * 100).toFixed(1)}% max similarity).`;
    }
    
    return {
      isPlagiarized,
      similarity: parseFloat(maxSimilarity.toFixed(3)),
      threshold: THRESHOLDS.BLOCK,
      status,
      matchedSnippets: matches.slice(0, 5), // Top 5 matches
      message,
    };
    
  } catch (error: any) {
    console.error('Plagiarism detection error:', error);
    // On error, default to PASS but log the issue
    return {
      isPlagiarized: false,
      similarity: 0,
      threshold: THRESHOLDS.PASS,
      status: 'PASS',
      message: 'Plagiarism check temporarily unavailable. Upload allowed.',
    };
  }
}

/**
 * Quick plagiarism check for API endpoint
 */
export async function quickPlagiarismCheck(code: string): Promise<{ similarity: number }> {
  const result = await detectPlagiarism(code);
  return { similarity: result.similarity };
}
