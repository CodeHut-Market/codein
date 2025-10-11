import axios from 'axios';

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterRequest {
  model: string;
  messages: OpenRouterMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  response_format?: { type: string };
}

export interface OpenRouterResponse {
  id: string;
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Call OpenRouter API with the specified model and messages
 */
export async function callOpenRouter(
  messages: OpenRouterMessage[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    responseFormat?: 'text' | 'json';
  } = {}
): Promise<string> {
  if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const {
    model = 'anthropic/claude-3.5-sonnet', // Default to Claude 3.5 Sonnet
    temperature = 0.7,
    maxTokens = 4000,
    responseFormat = 'text',
  } = options;

  try {
    const requestBody: OpenRouterRequest = {
      model,
      messages,
      temperature,
      max_tokens: maxTokens,
    };

    // Add JSON response format if requested
    if (responseFormat === 'json') {
      requestBody.response_format = { type: 'json_object' };
    }

    const response = await axios.post<OpenRouterResponse>(
      OPENROUTER_API_URL,
      requestBody,
      {
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.APP_URL || 'http://localhost:5000',
          'X-Title': 'CodeHut - Code Snippet Marketplace',
        },
        timeout: 60000, // 60 second timeout
      }
    );

    const content = response.data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response content from OpenRouter');
    }

    return content;
  } catch (error: any) {
    console.error('OpenRouter API Error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid OpenRouter API key');
    } else if (error.response?.status === 429) {
      throw new Error('OpenRouter API rate limit exceeded');
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('OpenRouter API request timeout');
    }
    
    throw new Error(`OpenRouter API error: ${error.message}`);
  }
}

/**
 * Available models for different use cases
 */
export const MODELS = {
  // Best for code analysis
  CLAUDE_SONNET: 'anthropic/claude-3.5-sonnet',
  CLAUDE_HAIKU: 'anthropic/claude-3-haiku',
  
  // Alternative options
  GPT4_TURBO: 'openai/gpt-4-turbo',
  GPT4O: 'openai/gpt-4o',
  GPT4O_MINI: 'openai/gpt-4o-mini',
  
  // Fast and cost-effective
  LLAMA_70B: 'meta-llama/llama-3.1-70b-instruct',
  MISTRAL_LARGE: 'mistralai/mistral-large',
} as const;

/**
 * Helper to create a system message
 */
export function createSystemMessage(content: string): OpenRouterMessage {
  return { role: 'system', content };
}

/**
 * Helper to create a user message
 */
export function createUserMessage(content: string): OpenRouterMessage {
  return { role: 'user', content };
}
