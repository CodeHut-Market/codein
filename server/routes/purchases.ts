import { RequestHandler } from "express";
import { PurchaseSnippetResponse, ErrorResponse } from "@shared/api";
import {
  findSnippetById,
  findUserById,
  createPurchase,
  purchases,
  codeSnippets,
} from "../database";

/**
 * POST /api/purchases
 * Purchase a code snippet
 */
export const purchaseSnippet: RequestHandler = (req, res) => {
  try {
    const { userId, snippetId } = req.body;

    // Validate required fields
    if (!userId || !snippetId) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Missing required fields: userId, snippetId",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Check if user exists
    const user = findUserById(userId);
    if (!user) {
      const errorResponse: ErrorResponse = {
        error: "Not Found",
        message: "User not found",
        statusCode: 404,
      };
      return res.status(404).json(errorResponse);
    }

    // Check if snippet exists
    const snippet = findSnippetById(snippetId);
    if (!snippet) {
      const errorResponse: ErrorResponse = {
        error: "Not Found",
        message: "Code snippet not found",
        statusCode: 404,
      };
      return res.status(404).json(errorResponse);
    }

    // Check if user already purchased this snippet
    const existingPurchase = purchases.find(
      (p) => p.userId === userId && p.snippetId === snippetId,
    );

    if (existingPurchase) {
      const errorResponse: ErrorResponse = {
        error: "Conflict",
        message: "You have already purchased this code snippet",
        statusCode: 409,
      };
      return res.status(409).json(errorResponse);
    }

    // Check if user is trying to buy their own snippet
    if (snippet.authorId === userId) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "You cannot purchase your own code snippet",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Create the purchase
    const purchase = createPurchase({
      userId,
      snippetId,
      price: snippet.price,
    });

    // Increment download count
    const snippetIndex = codeSnippets.findIndex((s) => s.id === snippetId);
    if (snippetIndex !== -1) {
      codeSnippets[snippetIndex].downloads += 1;
    }

    const response: PurchaseSnippetResponse = {
      purchase,
      snippet,
      message: "Code snippet purchased successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Error purchasing snippet:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to purchase code snippet",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/purchases/user/:userId
 * Get all purchases for a specific user
 */
export const getUserPurchases: RequestHandler = (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20 } = req.query;

    // Check if user exists
    const user = findUserById(userId);
    if (!user) {
      const errorResponse: ErrorResponse = {
        error: "Not Found",
        message: "User not found",
        statusCode: 404,
      };
      return res.status(404).json(errorResponse);
    }

    // Get user's purchases
    const userPurchases = purchases.filter(
      (purchase) => purchase.userId === userId,
    );

    // Add snippet details to each purchase
    const purchasesWithSnippets = userPurchases.map((purchase) => {
      const snippet = findSnippetById(purchase.snippetId);
      return {
        ...purchase,
        snippet,
      };
    });

    // Sort by purchase date (newest first)
    purchasesWithSnippets.sort(
      (a, b) =>
        new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime(),
    );

    // Apply pagination
    const startIndex = (Number(page) - 1) * Number(limit);
    const endIndex = startIndex + Number(limit);
    const paginatedPurchases = purchasesWithSnippets.slice(
      startIndex,
      endIndex,
    );

    const response = {
      purchases: paginatedPurchases,
      total: userPurchases.length,
      page: Number(page),
      limit: Number(limit),
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting user purchases:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch user purchases",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/purchases/snippet/:snippetId
 * Get purchase statistics for a specific snippet
 */
export const getSnippetPurchaseStats: RequestHandler = (req, res) => {
  try {
    const { snippetId } = req.params;

    // Check if snippet exists
    const snippet = findSnippetById(snippetId);
    if (!snippet) {
      const errorResponse: ErrorResponse = {
        error: "Not Found",
        message: "Code snippet not found",
        statusCode: 404,
      };
      return res.status(404).json(errorResponse);
    }

    // Get snippet purchases
    const snippetPurchases = purchases.filter(
      (purchase) => purchase.snippetId === snippetId,
    );

    // Calculate statistics
    const totalSales = snippetPurchases.length;
    const totalRevenue = snippetPurchases.reduce(
      (sum, purchase) => sum + purchase.price,
      0,
    );
    const averagePrice = totalSales > 0 ? totalRevenue / totalSales : 0;

    // Group purchases by date for trend analysis
    const salesByDate = snippetPurchases.reduce(
      (acc, purchase) => {
        const date = purchase.purchaseDate.split("T")[0]; // Get date part only
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    const response = {
      snippet,
      stats: {
        totalSales,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        averagePrice: Number(averagePrice.toFixed(2)),
        salesByDate,
      },
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting snippet purchase stats:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch snippet purchase statistics",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/purchases/check/:userId/:snippetId
 * Check if a user has purchased a specific snippet
 */
export const checkPurchaseStatus: RequestHandler = async (req, res) => {
  try {
    const { userId, snippetId } = req.params as { userId: string; snippetId: string };

    // Try modern DB first if available
    try {
      const { pool } = await import("../db/database");
      if (pool) {
        const result = await pool.query(
          `SELECT p.* FROM purchases p WHERE p.user_id = $1 AND p.snippet_id = $2`,
          [userId, snippetId],
        );
        const hasPurchased = result.rows.length > 0;
        return res.json({ hasPurchased, purchase: hasPurchased ? result.rows[0] : null });
      }
    } catch {}

    // Fallback to in-memory data
    const { purchases: memPurchases } = await import("../database");
    const hasPurchased = memPurchases.some(
      (p) => p.userId === userId && p.snippetId === snippetId,
    );
    return res.json({ hasPurchased, purchase: null });
  } catch (error) {
    console.error("Error checking purchase status:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to check purchase status",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};
