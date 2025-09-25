import { ErrorResponse, GetUserResponse } from "@shared/api";
import { RequestHandler } from "express";
import {
  codeSnippets,
  findUserById,
  findUserByUsername,
  users,
} from "../database";
import {
  findUserById as dbFindUserById,
  findUserByUsername as dbFindUserByUsername,
  pool,
} from "../db/database";

/**
 * GET /api/users/:id
 * Get user profile by ID
 */
export const getUserById: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    // Try to fetch from database first
    if (pool) {
      const user = await dbFindUserById(id);
      if (user) {
        // Fetch user's snippets from database
        const userSnippetsResult = await pool.query(
          'SELECT id, title, description, language, code, "createdAt", "updatedAt", author, tags, price, "isPremium" FROM snippets WHERE author = (SELECT username FROM users WHERE id = $1) ORDER BY "createdAt" DESC',
          [id]
        );

        // Get user snippet count and total downloads from database
        const snippetCount = userSnippetsResult.rows.length;
        const totalDownloads = 0; // TODO: implement downloads tracking

        // Map database snippets to CodeSnippet interface
        const mappedSnippets = userSnippetsResult.rows.map(row => ({
          id: row.id,
          title: row.title,
          description: row.description,
          language: row.language,
          code: row.code,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          author: row.author,
          authorId: user.id,
          tags: row.tags || [],
          price: row.price,
          isPremium: row.isPremium,
          rating: 0, // TODO: implement ratings
          downloads: 0, // TODO: implement downloads tracking
        }));

        const response: GetUserResponse = {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio || "",
            avatar: user.avatar || "",
            totalSnippets: snippetCount,
            totalDownloads: totalDownloads,
            rating: 0, // TODO: implement user ratings
            createdAt: user.createdAt,
          },
          snippets: mappedSnippets,
        };

        return res.json(response);
      }
    }

    // Fallback to in-memory data
    const user = findUserById(id);
    if (!user) {
      const errorResponse: ErrorResponse = {
        error: "Not Found",
        message: "User not found",
        statusCode: 404,
      };
      return res.status(404).json(errorResponse);
    }

    // Get user's snippets from in-memory data
    const userSnippets = codeSnippets.filter(
      (snippet) => snippet.authorId === id,
    );

    const response: GetUserResponse = {
      user,
      snippets: userSnippets,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting user by ID:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch user profile",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/users/username/:username
 * Get user profile by username
 */
export const getUserByUsername: RequestHandler = async (req, res) => {
  try {
    const { username } = req.params;

    // Try to fetch from database first
    if (pool) {
      const user = await dbFindUserByUsername(username);
      if (user) {
        // Fetch user's snippets from database
        const userSnippetsResult = await pool.query(
          'SELECT id, title, description, language, code, "createdAt", "updatedAt", author, tags, price, "isPremium" FROM snippets WHERE author = $1 ORDER BY "createdAt" DESC',
          [username]
        );

        // Get user snippet count and total downloads from database
        const snippetCount = userSnippetsResult.rows.length;
        const totalDownloads = 0; // TODO: implement downloads tracking

        // Map database snippets to CodeSnippet interface
        const mappedSnippets = userSnippetsResult.rows.map(row => ({
          id: row.id,
          title: row.title,
          description: row.description,
          language: row.language,
          code: row.code,
          createdAt: row.createdAt,
          updatedAt: row.updatedAt,
          author: row.author,
          authorId: user.id,
          tags: row.tags || [],
          price: row.price,
          isPremium: row.isPremium,
          rating: 0, // TODO: implement ratings
          downloads: 0, // TODO: implement downloads tracking
        }));

        const response: GetUserResponse = {
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            bio: user.bio || "",
            avatar: user.avatar || "",
            totalSnippets: snippetCount,
            totalDownloads: totalDownloads,
            rating: 0, // TODO: implement user ratings
            createdAt: user.createdAt,
          },
          snippets: mappedSnippets,
        };

        return res.json(response);
      }
    }

    // Fallback to in-memory data
    const user = findUserByUsername(username);
    if (!user) {
      const errorResponse: ErrorResponse = {
        error: "Not Found",
        message: "User not found",
        statusCode: 404,
      };
      return res.status(404).json(errorResponse);
    }

    // Get user's snippets from in-memory data
    const userSnippets = codeSnippets.filter(
      (snippet) => snippet.authorId === user.id,
    );

    const response: GetUserResponse = {
      user,
      snippets: userSnippets,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting user by username:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch user profile",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/users
 * Get all users (for listing/discovery)
 */
export const getAllUsers: RequestHandler = (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    let sortedUsers = [...users];

    // Apply sorting
    sortedUsers.sort((a, b) => {
      let aValue: any = a[sortBy as keyof typeof a];
      let bValue: any = b[sortBy as keyof typeof b];

      if (sortBy === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedUsers = sortedUsers.slice(startIndex, endIndex);

    const response = {
      users: paginatedUsers,
      total: users.length,
      page: Number(page),
      limit: Number(limit),
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting all users:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch users",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/users/top-authors
 * Get top authors based on their snippet ratings and downloads
 */
export const getTopAuthors: RequestHandler = (req, res) => {
  try {
    const { limit = 10 } = req.query;

    // Calculate author scores based on their snippets
    const authorStats = users.map((user) => {
      const userSnippets = codeSnippets.filter(
        (snippet) => snippet.authorId === user.id,
      );

      if (userSnippets.length === 0) {
        return {
          ...user,
          totalDownloads: 0,
          averageRating: 0,
          authorScore: 0,
        };
      }

      const totalDownloads = userSnippets.reduce(
        (sum, snippet) => sum + snippet.downloads,
        0,
      );
      const averageRating =
        userSnippets.reduce((sum, snippet) => sum + snippet.rating, 0) /
        userSnippets.length;
      const authorScore =
        totalDownloads * 0.3 + averageRating * 20 + userSnippets.length * 5;

      return {
        ...user,
        totalDownloads,
        averageRating: Number(averageRating.toFixed(1)),
        authorScore,
      };
    });

    // Sort by author score and get top authors
    const topAuthors = authorStats
      .sort((a, b) => b.authorScore - a.authorScore)
      .slice(0, Number(limit))
      .map(({ authorScore, ...author }) => author);

    const response = {
      authors: topAuthors,
      total: topAuthors.length,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting top authors:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch top authors",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};
