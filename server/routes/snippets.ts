import {
    CodeSnippet,
    DeleteCodeSnippetResponse,
    ErrorResponse,
    UpdateCodeSnippetRequest,
    UpdateCodeSnippetResponse
} from "@shared/api";
import { RequestHandler } from "express";
import { codeSnippets } from "../database";
import {
    createSnippet as dbCreateSnippet,
    pool
} from "../db/database";
import {
    isSupabaseAvailable,
    supabaseClient,
    supabaseHelpers,
    SupabaseSnippet
} from "../lib/supabaseClient";
import {
    hybridCodeSearch,
    semanticCodeSearch,
    storeCodeEmbedding
} from "../lib/vectorDatabase";

/**
 * GET /api/snippets
 * Get all code snippets with optional filtering - prioritizes Supabase
 */
export const getSnippets: RequestHandler = async (req, res) => {
  try {
    const {
      page = "1",
      limit = "10",
      language,
      framework,
      author,
      minPrice,
      maxPrice,
      search,
      sortBy = "created_at",
      sortOrder = "desc",
    } = req.query;

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const offset = (pageNum - 1) * limitNum;

    // Try Supabase first if available
    if (isSupabaseAvailable() && supabaseClient) {
      try {
        // Build filters object
        const filters = {
          language,
          framework,
          author,
          minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
          maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
          search,
          sortBy,
          sortOrder,
          limit: limitNum,
          offset,
        };

        // Build and execute query
        const query = supabaseHelpers.buildSearchQuery(supabaseClient, filters);
        const { data: snippets, error } = await query;

        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        // Get total count for pagination
        let countQuery = supabaseClient
          .from('snippets')
          .select('*', { count: 'exact', head: true });

        // Apply same filters for count
        if (language) {
          countQuery = countQuery.ilike('language', `%${language}%`);
        }
        if (framework) {
          countQuery = countQuery.ilike('framework', `%${framework}%`);
        }
        if (author) {
          countQuery = countQuery.ilike('author', `%${author}%`);
        }
        if (minPrice !== undefined) {
          countQuery = countQuery.gte('price', parseFloat(minPrice as string));
        }
        if (maxPrice !== undefined) {
          countQuery = countQuery.lte('price', parseFloat(maxPrice as string));
        }
        if (search) {
          countQuery = countQuery.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        const { count, error: countError } = await countQuery;

        if (countError) {
          console.error('Supabase count error:', countError);
          throw countError;
        }

        const total = count || 0;

        const response = {
          snippets: (snippets || []).map((snippet: SupabaseSnippet) => 
            supabaseHelpers.mapSupabaseSnippetToAPI(snippet)
          ),
          pagination: {
            page: pageNum,
            limit: limitNum,
            total,
            totalPages: Math.ceil(total / limitNum),
          },
        };

        return res.json(response);
      } catch (supabaseError) {
        console.error('Supabase error, falling back to PostgreSQL:', supabaseError);
        // Fall through to PostgreSQL fallback
      }
    }

    // Fallback to PostgreSQL implementation
    try {
      // Try PostgreSQL database first
      let query = `
        SELECT s.*, u.username as author_username
        FROM snippets s
        LEFT JOIN users u ON s.author_id = u.id
        WHERE 1=1
      `;
      const queryParams: any[] = [];
      let paramIndex = 1;

      // Add filters
      if (language) {
        query += ` AND s.language ILIKE $${paramIndex}`;
        queryParams.push(`%${language}%`);
        paramIndex++;
      }

      if (framework) {
        query += ` AND s.framework ILIKE $${paramIndex}`;
        queryParams.push(`%${framework}%`);
        paramIndex++;
      }

      if (author) {
        query += ` AND (s.author_username ILIKE $${paramIndex} OR u.username ILIKE $${paramIndex})`;
        queryParams.push(`%${author}%`);
        paramIndex++;
      }

      if (minPrice) {
        query += ` AND s.price >= $${paramIndex}`;
        queryParams.push(parseFloat(minPrice as string));
        paramIndex++;
      }

      if (maxPrice) {
        query += ` AND s.price <= $${paramIndex}`;
        queryParams.push(parseFloat(maxPrice as string));
        paramIndex++;
      }

      if (search) {
        query += ` AND (s.title ILIKE $${paramIndex} OR s.description ILIKE $${paramIndex} OR s.tags::text ILIKE $${paramIndex})`;
        queryParams.push(`%${search}%`);
        paramIndex++;
      }

      // Add sorting
      const validSortFields = [
        "created_at",
        "rating",
        "downloads",
        "price",
        "title",
      ];
      const sortField = validSortFields.includes(sortBy as string)
        ? sortBy
        : "created_at";
      const order = sortOrder === "asc" ? "ASC" : "DESC";
      query += ` ORDER BY s.${sortField} ${order}`;

      // Add pagination
      query += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      queryParams.push(limitNum, offset);

      const result = await pool.query(query, queryParams);

      // Get total count
      let countQuery = `
        SELECT COUNT(*) as total
        FROM snippets s
        LEFT JOIN users u ON s.author_id = u.id
        WHERE 1=1
      `;
      const countParams = queryParams.slice(0, -2); // Remove limit and offset
      let countParamIndex = 1;

      // Add same filters to count query
      if (language) {
        countQuery += ` AND s.language ILIKE $${countParamIndex}`;
        countParamIndex++;
      }
      if (framework) {
        countQuery += ` AND s.framework ILIKE $${countParamIndex}`;
        countParamIndex++;
      }
      if (author) {
        countQuery += ` AND (s.author_username ILIKE $${countParamIndex} OR u.username ILIKE $${countParamIndex})`;
        countParamIndex++;
      }
      if (minPrice) {
        countQuery += ` AND s.price >= $${countParamIndex}`;
        countParamIndex++;
      }
      if (maxPrice) {
        countQuery += ` AND s.price <= $${countParamIndex}`;
        countParamIndex++;
      }
      if (search) {
        countQuery += ` AND (s.title ILIKE $${countParamIndex} OR s.description ILIKE $${countParamIndex} OR s.tags::text ILIKE $${countParamIndex})`;
        countParamIndex++;
      }

      const countResult = await pool.query(countQuery, countParams);
      const total = parseInt(countResult.rows[0].total);

      res.json({
        snippets: result.rows.map(mapDbRowToSnippet),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (dbError) {
      console.log("PostgreSQL unavailable, falling back to in-memory data");

      // Fallback to in-memory data
      const { codeSnippets } = await import("../database");
      let filteredSnippets = [...codeSnippets];

      // Apply filters
      if (language) {
        filteredSnippets = filteredSnippets.filter((s) =>
          s.language.toLowerCase().includes((language as string).toLowerCase()),
        );
      }
      if (framework) {
        filteredSnippets = filteredSnippets.filter((s) =>
          s.framework
            ?.toLowerCase()
            .includes((framework as string).toLowerCase()),
        );
      }
      if (author) {
        filteredSnippets = filteredSnippets.filter((s) =>
          s.author.toLowerCase().includes((author as string).toLowerCase()),
        );
      }
      if (minPrice) {
        filteredSnippets = filteredSnippets.filter(
          (s) => s.price >= parseFloat(minPrice as string),
        );
      }
      if (maxPrice) {
        filteredSnippets = filteredSnippets.filter(
          (s) => s.price <= parseFloat(maxPrice as string),
        );
      }
      if (search) {
        const searchTerm = (search as string).toLowerCase();
        filteredSnippets = filteredSnippets.filter(
          (s) =>
            s.title.toLowerCase().includes(searchTerm) ||
            s.description.toLowerCase().includes(searchTerm) ||
            s.tags.some((tag) => tag.toLowerCase().includes(searchTerm)),
        );
      }

      // Apply sorting
      const sortField =
        sortBy === "created_at" ? "createdAt" : (sortBy as string);
      filteredSnippets.sort((a, b) => {
        let aVal = (a as any)[sortField];
        let bVal = (b as any)[sortField];

        if (sortField === "createdAt") {
          aVal = new Date(aVal).getTime();
          bVal = new Date(bVal).getTime();
        }

        if (sortOrder === "asc") {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      // Apply pagination
      const total = filteredSnippets.length;
      const paginatedSnippets = filteredSnippets.slice(
        offset,
        offset + limitNum,
      );

      res.json({
        snippets: paginatedSnippets,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }
  } catch (error) {
    console.error("Get snippets error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to get snippets",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/snippets/popular
 * Get popular snippets based on downloads and rating
 */
export const getPopularSnippets: RequestHandler = async (req, res) => {
  try {
    const { limit = "10" } = req.query;
    const limitNum = parseInt(limit as string);

    try {
      // Try PostgreSQL database first
      const result = await pool.query(
        `SELECT s.*, u.username as author_username
         FROM snippets s
         LEFT JOIN users u ON s.author_id = u.id
         ORDER BY (s.downloads * 0.7 + s.rating * 30) DESC
         LIMIT $1`,
        [limitNum],
      );

      res.json({
        snippets: result.rows.map(mapDbRowToSnippet),
      });
    } catch (dbError) {
      console.log("PostgreSQL unavailable, falling back to in-memory data");

      // Fallback to in-memory data
      const { codeSnippets } = await import("../database");

      // Sort by popularity (downloads * 0.7 + rating * 30) and limit
      const popularSnippets = codeSnippets
        .sort(
          (a, b) =>
            b.downloads * 0.7 +
            b.rating * 30 -
            (a.downloads * 0.7 + a.rating * 30),
        )
        .slice(0, limitNum);

      res.json({
        snippets: popularSnippets,
      });
    }
  } catch (error) {
    console.error("Get popular snippets error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to get popular snippets",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/snippets/:id
 * Get a specific snippet by ID
 */
export const getSnippetById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    try {
      // Try PostgreSQL database first
      const result = await pool.query(
        `SELECT s.*, u.username as author_username
         FROM snippets s
         LEFT JOIN users u ON s.author_id = u.id
         WHERE s.id = $1`,
        [id],
      );

      if (result.rows.length === 0) {
        const errorResponse: ErrorResponse = {
          error: "Not Found",
          message: "Snippet not found",
          statusCode: 404,
        };
        return res.status(404).json(errorResponse);
      }

      res.json(mapDbRowToSnippet(result.rows[0]));
    } catch (dbError) {
      console.log("PostgreSQL unavailable, falling back to in-memory data");

      // Fallback to in-memory data
      const { findSnippetById } = await import("../database");
      const snippet = findSnippetById(id);

      if (!snippet) {
        const errorResponse: ErrorResponse = {
          error: "Not Found",
          message: "Snippet not found",
          statusCode: 404,
        };
        return res.status(404).json(errorResponse);
      }

      res.json(snippet);
    }
  } catch (error) {
    console.error("Get snippet by ID error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to get snippet",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/snippets/author/:authorId
 * Get snippets by a specific author
 */
export const getSnippetsByAuthor: RequestHandler = async (req, res) => {
  try {
    const { authorId } = req.params;
    const { limit = "10", page = "1" } = req.query;

    const limitNum = parseInt(limit as string);
    const pageNum = parseInt(page as string);
    const offset = (pageNum - 1) * limitNum;

    try {
      // Try PostgreSQL database first
      const result = await pool.query(
        `SELECT s.*, u.username as author_username
         FROM snippets s
         LEFT JOIN users u ON s.author_id = u.id
         WHERE s.author_id = $1
         ORDER BY s.created_at DESC
         LIMIT $2 OFFSET $3`,
        [authorId, limitNum, offset],
      );

      const countResult = await pool.query(
        "SELECT COUNT(*) as total FROM snippets WHERE author_id = $1",
        [authorId],
      );

      const total = parseInt(countResult.rows[0].total);

      res.json({
        snippets: result.rows.map(mapDbRowToSnippet),
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    } catch (dbError) {
      console.log("PostgreSQL unavailable, falling back to in-memory data");

      // Fallback to in-memory data
      const { codeSnippets } = await import("../database");

      // Filter by author ID
      const authorSnippets = codeSnippets.filter(
        (s) => s.authorId === authorId,
      );

      // Sort by creation date (newest first)
      authorSnippets.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );

      // Apply pagination
      const total = authorSnippets.length;
      const paginatedSnippets = authorSnippets.slice(offset, offset + limitNum);

      res.json({
        snippets: paginatedSnippets,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          totalPages: Math.ceil(total / limitNum),
        },
      });
    }
  } catch (error) {
    console.error("Get snippets by author error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to get snippets by author",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * POST /api/snippets
 * Create a new code snippet with Supabase storage
 */
export const createCodeSnippet: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;

    if (!user) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Authentication required",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    const {
      title,
      description,
      code,
      price,
      tags = [],
      language,
      framework,
    } = req.body;

    // Validate required fields
    if (!title || !description || !code || price === undefined || !language) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message:
          "Missing required fields: title, description, code, price, language",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Validate price
    if (typeof price !== "number" || price < 0) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Price must be a non-negative number",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Try Supabase first if available
    if (isSupabaseAvailable() && supabaseClient) {
      try {
        const snippetId = supabaseHelpers.generateSnippetId();
        
        const snippetData = {
          id: snippetId,
          title,
          description,
          code,
          price,
          author: user.username,
          author_id: user.id,
          tags: Array.isArray(tags) ? tags : [],
          language,
          framework: framework || null,
          rating: 0,
          downloads: 0,
        };

        const { data, error } = await supabaseClient
          .from('snippets')
          .insert([snippetData])
          .select()
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }

        // Convert to API format
        const snippet = supabaseHelpers.mapSupabaseSnippetToAPI(data as SupabaseSnippet);

        // Store vector embedding for semantic search (async, don't wait)
        storeCodeEmbedding(snippetId, code, title, description)
          .then(success => {
            if (success) {
              console.log('✅ Vector embedding stored for snippet:', snippetId);
            } else {
              console.warn('⚠️  Failed to store vector embedding for snippet:', snippetId);
            }
          })
          .catch(error => {
            console.error('❌ Error storing vector embedding:', error);
          });

        const response = {
          ...snippet,
          status: "approved",
          message: "Code snippet uploaded successfully to Supabase.",
        };

        return res.status(201).json(response);
      } catch (supabaseError) {
        console.error('Supabase error, falling back to PostgreSQL:', supabaseError);
        // Fall through to PostgreSQL fallback
      }
    }

    // Fallback to PostgreSQL pool if Supabase unavailable
    if (pool) {
      try {
        // Simplified flow: approve snippet without plagiarism checks
        let snippetStatus = "approved";

        // Create snippet with appropriate status
        const snippet = await dbCreateSnippet({
          title,
          description,
          code,
          price,
          author: user.username,
          authorId: user.id,
          tags: Array.isArray(tags) ? tags : [],
          language: language,
          framework: framework || "",
        });

        // Update snippet status in database (add status column if needed)
        try {
          await pool.query("UPDATE snippets SET status = $1 WHERE id = $2", [
            snippetStatus,
            snippet.id,
          ]);
        } catch (statusError) {
          // Status column might not exist in fallback mode - that's okay
          console.log(
            "Status update skipped (column may not exist in fallback mode)",
          );
        }

        // Update user's snippet count
        try {
          await pool.query(
            "UPDATE users SET total_snippets = total_snippets + 1 WHERE id = $1",
            [user.id],
          );
        } catch (updateError) {
          console.warn("Failed to update user snippet count:", updateError);
        }

        // Prepare response
        const response: any = {
          ...snippet,
          status: snippetStatus,
          message: "Code snippet uploaded successfully to PostgreSQL.",
        };

        return res.status(201).json(response);
      } catch (dbError) {
        console.error('PostgreSQL error, falling back to in-memory:', dbError);
        // Fall through to in-memory fallback
      }
    }

    // Final fallback to in-memory storage
    const snippetId = `snippet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newSnippet: CodeSnippet = {
      id: snippetId,
      title,
      description,
      code,
      price,
      author: user.username,
      authorId: user.id,
      tags: Array.isArray(tags) ? tags : [],
      language,
      framework: framework || "",
      rating: 0,
      downloads: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    codeSnippets.push(newSnippet);

    const response = {
      ...newSnippet,
      status: "approved",
      message: "Code snippet uploaded successfully to in-memory storage.",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Create snippet error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to create snippet",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/snippets/search/semantic
 * Perform semantic search on code snippets using vector embeddings
 */
export const semanticSearchSnippets: RequestHandler = async (req, res) => {
  try {
    const {
      query,
      limit = "10",
      threshold = "0.7",
      hybrid = "true" // Enable hybrid search by default
    } = req.query;

    if (!query || typeof query !== 'string') {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Search query is required",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    const limitNum = parseInt(limit as string);
    const thresholdNum = parseFloat(threshold as string);
    const useHybrid = hybrid === "true";

    // If hybrid search is enabled, first get traditional text search results
    if (useHybrid && isSupabaseAvailable() && supabaseClient) {
      try {
        // Get text search results
        const { data: textResults, error: textError } = await supabaseClient
          .from('snippets')
          .select('*')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,language.ilike.%${query}%`)
          .limit(limitNum);

        if (textError) {
          console.error('Text search error:', textError);
        }

        // Perform hybrid search combining text and semantic results
        const hybridResults = await hybridCodeSearch(
          query as string,
          textResults || [],
          limitNum
        );

        // Get full snippet data for the results
        const snippetIds = hybridResults.map(result => result.id);
        const { data: snippets, error: snippetError } = await supabaseClient
          .from('snippets')
          .select('*')
          .in('id', snippetIds);

        if (snippetError) {
          console.error('Snippet fetch error:', snippetError);
          throw snippetError;
        }

        // Map and sort results by relevance
        const resultMap = new Map(hybridResults.map(r => [r.id, r]));
        const sortedSnippets = (snippets || [])
          .map((snippet: SupabaseSnippet) => ({
            ...supabaseHelpers.mapSupabaseSnippetToAPI(snippet),
            relevanceScore: resultMap.get(snippet.id)?.relevanceScore || 0,
            searchType: resultMap.get(snippet.id)?.searchType || 'unknown'
          }))
          .sort((a, b) => b.relevanceScore - a.relevanceScore);

        return res.json({
          snippets: sortedSnippets,
          searchType: 'hybrid',
          query: query,
          total: sortedSnippets.length
        });
      } catch (hybridError) {
        console.error('Hybrid search failed, falling back to semantic only:', hybridError);
        // Fall through to semantic-only search
      }
    }

    // Semantic search only
    try {
      const semanticResults = await semanticCodeSearch(
        query as string,
        limitNum,
        thresholdNum
      );

      // Get full snippet data for semantic results
      if (semanticResults.length > 0 && isSupabaseAvailable() && supabaseClient) {
        const snippetIds = semanticResults.map(result => result.snippet_id);
        const { data: snippets, error } = await supabaseClient
          .from('snippets')
          .select('*')
          .in('id', snippetIds);

        if (error) {
          console.error('Snippet fetch error:', error);
          throw error;
        }

        // Map results with similarity scores
        const resultMap = new Map(semanticResults.map(r => [r.snippet_id, r]));
        const sortedSnippets = (snippets || [])
          .map((snippet: SupabaseSnippet) => ({
            ...supabaseHelpers.mapSupabaseSnippetToAPI(snippet),
            similarity: resultMap.get(snippet.id)?.similarity || 0
          }))
          .sort((a, b) => b.similarity - a.similarity);

        return res.json({
          snippets: sortedSnippets,
          searchType: 'semantic',
          query: query,
          total: sortedSnippets.length
        });
      }

      // Return semantic results without full snippet data
      return res.json({
        snippets: semanticResults,
        searchType: 'semantic',
        query: query,
        total: semanticResults.length
      });
    } catch (semanticError) {
      console.error('Semantic search error:', semanticError);
      
      // Final fallback to traditional search
      return res.json({
        snippets: [],
        searchType: 'fallback',
        query: query,
        total: 0,
        message: 'Vector search unavailable, please use traditional search'
      });
    }
  } catch (error) {
    console.error("Semantic search error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to perform semantic search",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

// Helper function to get file extension based on language
function getFileExtension(language: string): string {
  const extensions: { [key: string]: string } = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    cpp: "cpp",
    c: "c",
    csharp: "cs",
    php: "php",
    ruby: "rb",
    go: "go",
    rust: "rs",
    html: "html",
    css: "css",
    sql: "sql",
    shell: "sh",
    jsx: "jsx",
    tsx: "tsx",
  };
  return extensions[language.toLowerCase()] || "txt";
}

/**
 * PUT /api/snippets/:id
 * Update an existing code snippet (only by author)
 */
export const updateCodeSnippet: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData: UpdateCodeSnippetRequest = req.body;
    
    // TODO: Get current user from auth context
    // For now, we'll skip auth check and allow anyone to update
    // const currentUser = req.user;

    if (!id) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Snippet ID is required",
        statusCode: 400,
      } as ErrorResponse);
    }

    // Try to update in database first
    if (pool) {
      try {
        // First, get the existing snippet to check ownership
        const existingResult = await pool.query(
          'SELECT * FROM snippets WHERE id = $1',
          [id]
        );

        if (existingResult.rows.length === 0) {
          return res.status(404).json({
            error: "Not Found",
            message: "Snippet not found",
            statusCode: 404,
          } as ErrorResponse);
        }

        const existingSnippet = existingResult.rows[0];
        
        // TODO: Check if current user is the author
        // if (existingSnippet.author !== currentUser.username) {
        //   return res.status(403).json({
        //     error: "Forbidden",
        //     message: "You can only update your own snippets",
        //     statusCode: 403,
        //   } as ErrorResponse);
        // }

        // Build update query dynamically
        const updateFields = [];
        const updateValues = [];
        let paramCount = 1;

        if (updateData.title !== undefined) {
          updateFields.push(`title = $${paramCount}`);
          updateValues.push(updateData.title);
          paramCount++;
        }
        if (updateData.description !== undefined) {
          updateFields.push(`description = $${paramCount}`);
          updateValues.push(updateData.description);
          paramCount++;
        }
        if (updateData.code !== undefined) {
          updateFields.push(`code = $${paramCount}`);
          updateValues.push(updateData.code);
          paramCount++;
        }
        if (updateData.price !== undefined) {
          updateFields.push(`price = $${paramCount}`);
          updateValues.push(updateData.price);
          paramCount++;
        }
        if (updateData.tags !== undefined) {
          updateFields.push(`tags = $${paramCount}`);
          updateValues.push(JSON.stringify(updateData.tags));
          paramCount++;
        }
        if (updateData.language !== undefined) {
          updateFields.push(`language = $${paramCount}`);
          updateValues.push(updateData.language);
          paramCount++;
        }
        if (updateData.framework !== undefined) {
          updateFields.push(`framework = $${paramCount}`);
          updateValues.push(updateData.framework);
          paramCount++;
        }

        // Always update the updatedAt field
        updateFields.push(`"updatedAt" = NOW()`);

        if (updateFields.length === 1) { // Only updatedAt was added
          return res.status(400).json({
            error: "Bad Request",
            message: "No valid update fields provided",
            statusCode: 400,
          } as ErrorResponse);
        }

        updateValues.push(id);
        const updateQuery = `
          UPDATE snippets 
          SET ${updateFields.join(', ')} 
          WHERE id = $${paramCount}
          RETURNING *
        `;

        const result = await pool.query(updateQuery, updateValues);
        const updatedSnippet = result.rows[0];

        const mappedSnippet: CodeSnippet = {
          id: updatedSnippet.id,
          title: updatedSnippet.title,
          description: updatedSnippet.description,
          code: updatedSnippet.code,
          price: parseFloat(updatedSnippet.price),
          rating: parseFloat(updatedSnippet.rating) || 0,
          author: updatedSnippet.author,
          authorId: existingSnippet.author, // Use the original author
          tags: Array.isArray(updatedSnippet.tags) ? updatedSnippet.tags : JSON.parse(updatedSnippet.tags || '[]'),
          language: updatedSnippet.language,
          framework: updatedSnippet.framework,
          downloads: parseInt(updatedSnippet.downloads) || 0,
          createdAt: updatedSnippet.createdAt,
          updatedAt: updatedSnippet.updatedAt,
        };

        const response: UpdateCodeSnippetResponse = {
          snippet: mappedSnippet,
          message: "Snippet updated successfully",
        };

        return res.json(response);
      } catch (dbError) {
        console.error("Database update error:", dbError);
        // Fall through to in-memory fallback
      }
    }

    // Fallback to in-memory update
    const snippetIndex = codeSnippets.findIndex(s => s.id === id);
    if (snippetIndex === -1) {
      return res.status(404).json({
        error: "Not Found",
        message: "Snippet not found",
        statusCode: 404,
      } as ErrorResponse);
    }

    const existingSnippet = codeSnippets[snippetIndex];
    const updatedSnippet = {
      ...existingSnippet,
      ...updateData,
      updatedAt: new Date().toISOString(),
    };

    codeSnippets[snippetIndex] = updatedSnippet;

    const response: UpdateCodeSnippetResponse = {
      snippet: updatedSnippet,
      message: "Snippet updated successfully",
    };

    return res.json(response);
  } catch (error) {
    console.error("Error updating snippet:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to update snippet",
      statusCode: 500,
    } as ErrorResponse);
  }
};

/**
 * DELETE /api/snippets/:id
 * Delete a code snippet (only by author)
 */
export const deleteCodeSnippet: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    
    // TODO: Get current user from auth context
    // For now, we'll skip auth check and allow anyone to delete
    // const currentUser = req.user;

    if (!id) {
      return res.status(400).json({
        error: "Bad Request",
        message: "Snippet ID is required",
        statusCode: 400,
      } as ErrorResponse);
    }

    // Try to delete from database first
    if (pool) {
      try {
        // First, get the existing snippet to check ownership
        const existingResult = await pool.query(
          'SELECT * FROM snippets WHERE id = $1',
          [id]
        );

        if (existingResult.rows.length === 0) {
          return res.status(404).json({
            error: "Not Found",
            message: "Snippet not found",
            statusCode: 404,
          } as ErrorResponse);
        }

        const existingSnippet = existingResult.rows[0];
        
        // TODO: Check if current user is the author
        // if (existingSnippet.author !== currentUser.username) {
        //   return res.status(403).json({
        //     error: "Forbidden",
        //     message: "You can only delete your own snippets",
        //     statusCode: 403,
        //   } as ErrorResponse);
        // }

        // Delete the snippet
        const deleteResult = await pool.query(
          'DELETE FROM snippets WHERE id = $1',
          [id]
        );

        if (deleteResult.rowCount === 0) {
          return res.status(404).json({
            error: "Not Found",
            message: "Snippet not found",
            statusCode: 404,
          } as ErrorResponse);
        }

        // Update user's snippet count
        try {
          await pool.query(
            "UPDATE users SET total_snippets = total_snippets - 1 WHERE username = $1",
            [existingSnippet.author]
          );
        } catch (updateError) {
          console.warn("Failed to update user snippet count:", updateError);
        }

        const response: DeleteCodeSnippetResponse = {
          message: "Snippet deleted successfully",
          deletedId: id,
        };

        return res.json(response);
      } catch (dbError) {
        console.error("Database delete error:", dbError);
        // Fall through to in-memory fallback
      }
    }

    // Fallback to in-memory delete
    const snippetIndex = codeSnippets.findIndex(s => s.id === id);
    if (snippetIndex === -1) {
      return res.status(404).json({
        error: "Not Found",
        message: "Snippet not found",
        statusCode: 404,
      } as ErrorResponse);
    }

    const deletedSnippet = codeSnippets.splice(snippetIndex, 1)[0];

    const response: DeleteCodeSnippetResponse = {
      message: "Snippet deleted successfully",
      deletedId: id,
    };

    return res.json(response);
  } catch (error) {
    console.error("Error deleting snippet:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      message: "Failed to delete snippet",
      statusCode: 500,
    } as ErrorResponse);
  }
};


// Helper function to map database row to snippet object
function mapDbRowToSnippet(row: any) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    code: row.code,
    price: parseFloat(row.price),
    rating: parseFloat(row.rating) || 0,
    author: row.author_username || row.author_username,
    authorId: row.author_id,
    tags: row.tags || [],
    language: row.language,
    framework: row.framework,
    downloads: row.downloads || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    favoriteCount: row.favorite_count ?? undefined,
  };
}
