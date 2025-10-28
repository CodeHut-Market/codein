import {
  callOpenRouter,
  createSystemMessage,
  createUserMessage,
  MODELS
} from './openRouterService';
import {
  searchInternetForCode
} from './tavilySearchService';

export interface PlagiarismMatch {
  snippetId: string;
  title: string;
  author: string;
  similarity: number;
  explanation: string;
  source?: 'database' | 'internet'; // Track where the match came from
  url?: string; // For internet matches
}

export interface PlagiarismResult {
  isPlagiarized: boolean;
  similarity: number;
  status: 'PASS' | 'REVIEW' | 'FAIL';
  message: string;
  matches: PlagiarismMatch[];
  analysis?: string;
  aiPowered?: boolean; // Indicates if AI was used (true) or fallback method (false)
  internetSearched?: boolean; // Indicates if internet search was performed
}

/**
 * Analyze code for plagiarism using AI
 * Compares submitted code against:
 * 1. Database of existing snippets (local)
 * 2. Internet sources via Tavily search (GitHub, StackOverflow, etc.)
 */
export async function detectPlagiarismWithAI(
  submittedCode: string,
  existingSnippets: Array<{
    id: string;
    title: string;
    code: string;
    author: string;
  }>,
  language?: string
): Promise<PlagiarismResult> {
  try {
    console.log('[AI Plagiarism] Starting detection...');
    console.log('[AI Plagiarism] Code length:', submittedCode?.length);
    console.log('[AI Plagiarism] Local snippets count:', existingSnippets?.length);
    console.log('[AI Plagiarism] Language:', language);
    
    // STEP 1: Search the internet for similar code
    console.log('[AI Plagiarism] Step 1: Searching internet for similar code...');
    const internetResults = await searchInternetForCode(submittedCode, language);
    console.log('[AI Plagiarism] Internet search found:', internetResults.totalResults, 'matches');
    
    // STEP 2: Combine local and internet matches
    const allSnippetsForComparison = [
      ...existingSnippets,
      // Add internet matches as pseudo-snippets
      ...internetResults.matches.map((match, idx) => ({
        id: `internet-${idx}`,
        title: match.title,
        code: match.snippet,
        author: match.source,
        _url: match.url, // Store URL for reference
        _source: 'internet' as const,
      }))
    ];
    
    console.log('[AI Plagiarism] Total snippets to compare:', allSnippetsForComparison.length);
    
    // If no snippets to compare (neither local nor internet), it's original
    if (allSnippetsForComparison.length === 0) {
      console.log('[AI Plagiarism] No snippets to compare - returning PASS');
      return {
        isPlagiarized: false,
        similarity: 0,
        status: 'PASS',
        message: 'No existing snippets found for comparison. Code appears to be original.',
        matches: [],
        aiPowered: false,
        internetSearched: true,
      };
    }

    // STEP 3: Prepare the comparison data (limit to avoid token limits)
    const snippetsForComparison = allSnippetsForComparison.slice(0, 15); // Include both local and internet
    console.log('[AI Plagiarism] Comparing against', snippetsForComparison.length, 'snippets (local + internet)');
    
    const systemPrompt = `You are an expert code plagiarism detector. Your job is to analyze code submissions and detect if they are plagiarized from existing code snippets found in databases AND on the internet (GitHub, StackOverflow, etc.).

You should analyze:
1. Code structure and logic flow
2. Algorithm implementation patterns
3. Variable naming conventions and patterns
4. Function/method signatures and implementations
5. Comments and documentation style
6. Unique code patterns and idioms

Return your analysis as a JSON object with this exact structure:
{
  "overallSimilarity": <number between 0-1>,
  "isPlagiarized": <boolean>,
  "status": "<PASS|REVIEW|FAIL>",
  "analysis": "<detailed explanation>",
  "matches": [
    {
      "snippetId": "<id>",
      "title": "<title>",
      "similarity": <number between 0-1>,
      "explanation": "<why this snippet matches>"
    }
  ]
}

Similarity scoring:
- 0.0-0.3: Different implementations
- 0.3-0.5: Some similar patterns (common algorithms)
- 0.5-0.7: Moderate similarity (REVIEW needed)
- 0.7-0.9: High similarity (likely plagiarized)
- 0.9-1.0: Identical or nearly identical (FAIL)

Status guidelines:
- PASS: similarity < 0.5 (original or common patterns)
- REVIEW: similarity 0.5-0.7 (manual review recommended)
- FAIL: similarity > 0.7 (likely plagiarized)

Consider that:
- Common algorithm implementations (sorting, searching) may have natural similarities
- Boilerplate code should not count heavily
- Variable renaming alone is not enough to avoid plagiarism
- Logic flow and structure are more important than syntax`;

    const userPrompt = `Analyze this ${language || 'code'} submission for plagiarism:

SUBMITTED CODE:
\`\`\`${language || ''}
${submittedCode}
\`\`\`

EXISTING SNIPPETS TO COMPARE AGAINST:
${snippetsForComparison.map((snippet, idx) => `
[Snippet ${idx + 1}]
ID: ${snippet.id}
Title: ${snippet.title}
Author: ${snippet.author}
Code:
\`\`\`${language || ''}
${snippet.code}
\`\`\`
`).join('\n---\n')}

Analyze and return JSON with your plagiarism detection results.`;

    // Call OpenRouter API
    console.log('[AI Plagiarism] Calling callOpenRouter...');
    const response = await callOpenRouter(
      [
        createSystemMessage(systemPrompt),
        createUserMessage(userPrompt),
      ],
      {
        model: MODELS.CLAUDE_SONNET, // Claude is excellent at code analysis
        temperature: 0.3, // Lower temperature for more consistent analysis
        maxTokens: 4000,
        responseFormat: 'json',
      }
    );
    console.log('[AI Plagiarism] OpenRouter response received, length:', response?.length);

    // Parse the JSON response
    let aiResult;
    try {
      console.log('[AI Plagiarism] Parsing JSON response...');
      // Try to parse the response as JSON
      aiResult = JSON.parse(response);
      console.log('[AI Plagiarism] JSON parsed successfully');
    } catch (parseError) {
      console.log('[AI Plagiarism] JSON parse failed, trying markdown extraction...');
      // If parsing fails, try to extract JSON from markdown code block
      const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch) {
        aiResult = JSON.parse(jsonMatch[1]);
      } else {
        // Fallback: try to find JSON object in the response
        const objectMatch = response.match(/\{[\s\S]*\}/);
        if (objectMatch) {
          aiResult = JSON.parse(objectMatch[0]);
        } else {
          throw new Error('Could not parse AI response as JSON');
        }
      }
    }

    // Map AI results to our format, including source information
    const matches: PlagiarismMatch[] = (aiResult.matches || []).map((match: any) => {
      const snippetId = match.snippetId || match.id || 'unknown';
      const foundSnippet = snippetsForComparison.find(s => s.id === snippetId);
      
      // Determine if this is an internet match
      const isInternetMatch = snippetId.startsWith('internet-');
      
      return {
        snippetId,
        title: match.title || foundSnippet?.title || 'Unknown',
        author: foundSnippet?.author || 'Unknown',
        similarity: Number(match.similarity) || 0,
        explanation: match.explanation || 'No explanation provided',
        source: isInternetMatch ? 'internet' as const : 'database' as const,
        url: isInternetMatch ? (foundSnippet as any)?._url : undefined,
      };
    });

    const overallSimilarity = Number(aiResult.overallSimilarity) || 0;
    const status = aiResult.status || (overallSimilarity > 0.7 ? 'FAIL' : overallSimilarity > 0.5 ? 'REVIEW' : 'PASS');

    let message: string;
    const internetMatchCount = matches.filter(m => m.source === 'internet').length;
    
    if (status === 'FAIL') {
      message = internetMatchCount > 0 
        ? `High similarity detected. Code appears to be plagiarized (found ${internetMatchCount} matches on the internet).`
        : 'High similarity detected. This code appears to be plagiarized.';
    } else if (status === 'REVIEW') {
      message = internetMatchCount > 0
        ? `Moderate similarity detected (${internetMatchCount} internet matches). Manual review recommended.`
        : 'Moderate similarity detected. Manual review recommended.';
    } else {
      message = 'No significant plagiarism detected. Code appears to be original.';
    }

    return {
      isPlagiarized: status !== 'PASS',
      similarity: overallSimilarity,
      status: status as 'PASS' | 'REVIEW' | 'FAIL',
      message,
      matches: matches.slice(0, 5), // Return top 5 matches
      analysis: aiResult.analysis,
      aiPowered: true, // AI was successfully used
      internetSearched: true, // Internet search was performed
    };

  } catch (error: any) {
    console.error('[AI Plagiarism] ERROR occurred:', error);
    console.error('[AI Plagiarism] Error message:', error?.message);
    console.error('[AI Plagiarism] Error stack:', error?.stack);
    console.error('[AI Plagiarism] Error type:', error?.constructor?.name);
    
    // Fallback to basic detection if AI fails
    console.log('[AI Plagiarism] Falling back to basic similarity detection');
    const fallbackResult = detectPlagiarismBasic(submittedCode, existingSnippets);
    console.log('[AI Plagiarism] Fallback result:', {
      status: fallbackResult.status,
      similarity: fallbackResult.similarity
    });
    
    return {
      ...fallbackResult,
      aiPowered: false,
      internetSearched: false, // Fallback doesn't search internet
    };
  }
}

/**
 * Fallback: Basic plagiarism detection using Jaccard similarity
 * Used when AI detection fails
 */
function detectPlagiarismBasic(
  submittedCode: string,
  existingSnippets: Array<{
    id: string;
    title: string;
    code: string;
    author: string;
  }>
): PlagiarismResult {
  const codeNormalized = submittedCode.trim().toLowerCase().replace(/\s+/g, ' ');
  let maxSimilarity = 0;
  const matches: PlagiarismMatch[] = [];

  for (const snippet of existingSnippets) {
    const snippetCodeNormalized = snippet.code.trim().toLowerCase().replace(/\s+/g, ' ');
    const similarity = calculateJaccardSimilarity(codeNormalized, snippetCodeNormalized);

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
    }

    if (similarity >= 0.5) {
      matches.push({
        snippetId: snippet.id,
        title: snippet.title,
        author: snippet.author,
        similarity,
        explanation: `Basic text similarity: ${(similarity * 100).toFixed(1)}%`,
      });
    }
  }

  let status: 'PASS' | 'REVIEW' | 'FAIL';
  let message: string;

  if (maxSimilarity >= 0.7) {
    status = 'FAIL';
    message = 'High similarity detected (basic analysis). This code may be plagiarized.';
  } else if (maxSimilarity >= 0.5) {
    status = 'REVIEW';
    message = 'Moderate similarity detected (basic analysis). Manual review recommended.';
  } else {
    status = 'PASS';
    message = 'No significant plagiarism detected (basic analysis).';
  }

  return {
    isPlagiarized: status !== 'PASS',
    similarity: maxSimilarity,
    status,
    message: message + ' (Note: AI analysis unavailable, using basic detection)',
    matches: matches.slice(0, 5).sort((a, b) => b.similarity - a.similarity),
    aiPowered: false, // Fallback method was used
  };
}

/**
 * Calculate Jaccard similarity between two strings
 */
function calculateJaccardSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(' '));
  const words2 = new Set(str2.split(' '));

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}
