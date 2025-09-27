import { ErrorResponse } from "@shared/api";
import { RequestHandler } from "express";
import { createLangsearchService, PlagiarismCheckRequest, SearchRequest } from "../services/langsearch.service";

// Initialize the Langsearch service
const langsearchService = createLangsearchService();

/**
 * POST /api/websearch
 * Perform web search using Langsearch API
 */
export const performWebSearch: RequestHandler = async (req, res) => {
  try {
    if (!langsearchService) {
      const errorResponse: ErrorResponse = {
        error: "Service Unavailable",
        message: "Web search service is not configured",
        statusCode: 503,
      };
      return res.status(503).json(errorResponse);
    }

    const { query, num_results = 10, language = 'en', search_type = 'web' } = req.body as SearchRequest & { search_type?: string };

    if (!query || typeof query !== "string" || query.trim().length === 0) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Search query is required and must be a non-empty string",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Validate search parameters
    if (num_results && (num_results < 1 || num_results > 50)) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Number of results must be between 1 and 50",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    const searchRequest: SearchRequest = {
      query: query.trim(),
      num_results,
      language,
      search_type: search_type as 'web' | 'news' | 'images' | 'videos'
    };

    console.log(`🔍 Performing web search: "${query}" (${num_results} results)`);
    
    const searchResult = await langsearchService.search(searchRequest);
    
    // Log successful search
    console.log(`✅ Web search completed: ${searchResult.results.length} results in ${searchResult.search_time}ms`);

    const response = {
      success: true,
      data: searchResult,
      meta: {
        timestamp: new Date().toISOString(),
        service: 'langsearch.com'
      }
    };

    res.json(response);
  } catch (error) {
    console.error("Error performing web search:", error);
    
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Failed to perform web search",
      statusCode: 500,
    };
    
    res.status(500).json(errorResponse);
  }
};

/**
 * POST /api/plagiarism/check
 * Check content for plagiarism using web search
 */
export const checkPlagiarism: RequestHandler = async (req, res) => {
  try {
    if (!langsearchService) {
      const errorResponse: ErrorResponse = {
        error: "Service Unavailable",
        message: "Plagiarism detection service is not configured",
        statusCode: 503,
      };
      return res.status(503).json(errorResponse);
    }

    const { content, language = 'en', threshold = 0.5 } = req.body as PlagiarismCheckRequest & { threshold?: number };

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Content is required and must be a non-empty string",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    if (content.length < 50) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request", 
        message: "Content must be at least 50 characters long for meaningful plagiarism detection",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    if (content.length > 10000) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Content must be less than 10,000 characters",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    const plagiarismRequest: PlagiarismCheckRequest = {
      content: content.trim(),
      language,
      threshold
    };

    console.log(`🕵️ Checking plagiarism for content (${content.length} characters)`);
    
    const result = await langsearchService.checkPlagiarism(plagiarismRequest);
    
    // Log plagiarism check result
    if (result.is_plagiarized) {
      console.log(`⚠️ Plagiarism detected! Confidence: ${(result.confidence_score * 100).toFixed(1)}%, Original: ${(result.original_score * 100).toFixed(1)}%`);
    } else {
      console.log(`✅ Content appears original. Confidence: ${(result.original_score * 100).toFixed(1)}%`);
    }

    const response = {
      success: true,
      data: result,
      meta: {
        timestamp: new Date().toISOString(),
        service: 'langsearch.com',
        content_length: content.length,
        threshold_used: threshold
      }
    };

    res.json(response);
  } catch (error) {
    console.error("Error checking plagiarism:", error);
    
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: error instanceof Error ? error.message : "Failed to check plagiarism",
      statusCode: 500,
    };
    
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/websearch/health
 * Check Langsearch service health
 */
export const checkWebSearchHealth: RequestHandler = async (req, res) => {
  try {
    if (!langsearchService) {
      const response = {
        status: 'disabled',
        message: 'Web search service is not configured',
        configured: false
      };
      return res.json(response);
    }

    console.log('🏥 Checking Langsearch service health...');
    
    const healthResult = await langsearchService.healthCheck();
    
    const response = {
      status: healthResult.status,
      response_time: healthResult.response_time,
      service: 'langsearch.com',
      configured: true,
      timestamp: new Date().toISOString()
    };

    if (healthResult.status === 'ok') {
      console.log(`✅ Langsearch service is healthy (${healthResult.response_time}ms)`);
    } else {
      console.log(`❌ Langsearch service is unhealthy (${healthResult.response_time}ms)`);
    }

    res.json(response);
  } catch (error) {
    console.error("Error checking web search health:", error);
    
    const response = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Health check failed',
      configured: true,
      timestamp: new Date().toISOString()
    };
    
    res.status(500).json(response);
  }
};