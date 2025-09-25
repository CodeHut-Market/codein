import { RequestHandler } from "express";
import { ErrorResponse } from "@shared/api";
import { codeSnippets, users } from "../database";

/**
 * GET /api/search
 * Global search across snippets and users
 */
export const globalSearch: RequestHandler = (req, res) => {
  try {
    const { q, type = "all", limit = 20 } = req.query;

    if (!q || typeof q !== "string") {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Search query is required",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    const searchTerm = q.toLowerCase();
    const searchLimit = Number(limit);

    let snippetResults: typeof codeSnippets = [];
    let userResults: typeof users = [];

    // Search snippets
    if (type === "all" || type === "snippets") {
      snippetResults = codeSnippets
        .filter((snippet) => {
          return (
            snippet.title.toLowerCase().includes(searchTerm) ||
            snippet.description.toLowerCase().includes(searchTerm) ||
            snippet.author.toLowerCase().includes(searchTerm) ||
            snippet.language.toLowerCase().includes(searchTerm) ||
            snippet.framework?.toLowerCase().includes(searchTerm) ||
            snippet.tags.some((tag) => tag.toLowerCase().includes(searchTerm))
          );
        })
        .sort((a, b) => {
          // Prioritize title matches
          const aTitle = a.title.toLowerCase().includes(searchTerm);
          const bTitle = b.title.toLowerCase().includes(searchTerm);

          if (aTitle && !bTitle) return -1;
          if (!aTitle && bTitle) return 1;

          // Then by rating
          return b.rating - a.rating;
        })
        .slice(
          0,
          type === "snippets" ? searchLimit : Math.floor(searchLimit * 0.7),
        );
    }

    // Search users
    if (type === "all" || type === "users") {
      userResults = users
        .filter((user) => {
          return (
            user.username.toLowerCase().includes(searchTerm) ||
            user.email.toLowerCase().includes(searchTerm) ||
            user.bio?.toLowerCase().includes(searchTerm)
          );
        })
        .sort((a, b) => {
          // Prioritize username matches
          const aUsername = a.username.toLowerCase().includes(searchTerm);
          const bUsername = b.username.toLowerCase().includes(searchTerm);

          if (aUsername && !bUsername) return -1;
          if (!aUsername && bUsername) return 1;

          // Then by rating
          return b.rating - a.rating;
        })
        .slice(
          0,
          type === "users" ? searchLimit : Math.floor(searchLimit * 0.3),
        );
    }

    const response = {
      query: q,
      type,
      results: {
        snippets: snippetResults,
        users: userResults,
      },
      total: {
        snippets: snippetResults.length,
        users: userResults.length,
        all: snippetResults.length + userResults.length,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error performing global search:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to perform search",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/search/suggestions
 * Get search suggestions based on popular tags and titles
 */
export const getSearchSuggestions: RequestHandler = (req, res) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q || typeof q !== "string") {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Search query is required",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    const searchTerm = q.toLowerCase();
    const searchLimit = Number(limit);

    // Get all unique tags and count their frequency
    const tagFrequency: Record<string, number> = {};
    const titleWords: Record<string, number> = {};

    codeSnippets.forEach((snippet) => {
      // Count tags
      snippet.tags.forEach((tag) => {
        const lowerTag = tag.toLowerCase();
        if (lowerTag.includes(searchTerm)) {
          tagFrequency[tag] = (tagFrequency[tag] || 0) + 1;
        }
      });

      // Count title words
      const words = snippet.title.toLowerCase().split(" ");
      words.forEach((word) => {
        if (word.includes(searchTerm) && word.length > 2) {
          titleWords[snippet.title] = (titleWords[snippet.title] || 0) + 1;
        }
      });
    });

    // Create suggestions from tags
    const tagSuggestions = Object.entries(tagFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, Math.floor(searchLimit * 0.6))
      .map(([tag]) => ({
        text: tag,
        type: "tag",
        category: "Tags",
      }));

    // Create suggestions from titles
    const titleSuggestions = Object.entries(titleWords)
      .sort(([, a], [, b]) => b - a)
      .slice(0, Math.floor(searchLimit * 0.4))
      .map(([title]) => ({
        text: title,
        type: "title",
        category: "Snippets",
      }));

    // Combine and limit results
    const allSuggestions = [...tagSuggestions, ...titleSuggestions].slice(
      0,
      searchLimit,
    );

    const response = {
      query: q,
      suggestions: allSuggestions,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting search suggestions:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to get search suggestions",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/search/filters
 * Get available filter options for search
 */
export const getSearchFilters: RequestHandler = (req, res) => {
  try {
    // Extract unique values from snippets
    const languages = [...new Set(codeSnippets.map((s) => s.language))].sort();
    const frameworks = [
      ...new Set(codeSnippets.map((s) => s.framework).filter(Boolean)),
    ].sort();
    const tags = [...new Set(codeSnippets.flatMap((s) => s.tags))].sort();

    // Price range
    const prices = codeSnippets.map((s) => s.price);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices),
    };

    // Rating range
    const ratings = codeSnippets.map((s) => s.rating);
    const ratingRange = {
      min: Math.min(...ratings),
      max: Math.max(...ratings),
    };

    const response = {
      languages,
      frameworks,
      tags,
      priceRange,
      ratingRange,
      sortOptions: [
        { value: "createdAt", label: "Newest" },
        { value: "rating", label: "Highest Rated" },
        { value: "downloads", label: "Most Downloaded" },
        { value: "price", label: "Price" },
      ],
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting search filters:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to get search filters",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};
