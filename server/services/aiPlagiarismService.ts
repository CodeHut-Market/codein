import {
  callOpenRouter,
  createSystemMessage,
  createUserMessage,
  MODELS
} from './openRouterService';

export interface PlagiarismMatch {
  snippetId: string;
  title: string;
  author: string;
  similarity: number;
  explanation: string;
}

export interface PlagiarismResult {
  isPlagiarized: boolean;
  similarity: number;
  status: 'PASS' | 'REVIEW' | 'FAIL';
  message: string;
  matches: PlagiarismMatch[];
  analysis?: string;
}

/**
 * Analyze code for plagiarism using AI
 * Compares submitted code against a database of existing snippets
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
    // If no snippets to compare, it's original
    if (!existingSnippets || existingSnippets.length === 0) {
      return {
        isPlagiarized: false,
        similarity: 0,
        status: 'PASS',
        message: 'No existing snippets found for comparison. Code appears to be original.',
        matches: [],
      };
    }

    // Prepare the comparison data
    const snippetsForComparison = existingSnippets.slice(0, 10); // Limit to 10 for API token limits
    
    const systemPrompt = `You are an expert code plagiarism detector. Your job is to analyze code submissions and detect if they are plagiarized from existing code snippets.

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

    // Parse the JSON response
    let aiResult;
    try {
      // Try to parse the response as JSON
      aiResult = JSON.parse(response);
    } catch (parseError) {
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

    // Map AI results to our format
    const matches: PlagiarismMatch[] = (aiResult.matches || []).map((match: any) => ({
      snippetId: match.snippetId || match.id || 'unknown',
      title: match.title || 'Unknown',
      author: snippetsForComparison.find(s => s.id === match.snippetId)?.author || 'Unknown',
      similarity: Number(match.similarity) || 0,
      explanation: match.explanation || 'No explanation provided',
    }));

    const overallSimilarity = Number(aiResult.overallSimilarity) || 0;
    const status = aiResult.status || (overallSimilarity > 0.7 ? 'FAIL' : overallSimilarity > 0.5 ? 'REVIEW' : 'PASS');

    let message: string;
    if (status === 'FAIL') {
      message = 'High similarity detected. This code appears to be plagiarized.';
    } else if (status === 'REVIEW') {
      message = 'Moderate similarity detected. Manual review recommended.';
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
    };

  } catch (error: any) {
    console.error('AI Plagiarism Detection Error:', error);
    
    // Fallback to basic detection if AI fails
    console.log('Falling back to basic similarity detection');
    return detectPlagiarismBasic(submittedCode, existingSnippets);
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
