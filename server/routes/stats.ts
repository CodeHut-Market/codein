import { RequestHandler } from "express";
import { ErrorResponse } from "@shared/api";
import { codeSnippets, users, purchases } from "../database";

/**
 * GET /api/stats
 * Get marketplace statistics
 */
export const getMarketplaceStats: RequestHandler = (req, res) => {
  try {
    // Calculate general statistics
    const totalSnippets = codeSnippets.length;
    const totalUsers = users.length;
    const totalPurchases = purchases.length;
    const totalRevenue = purchases.reduce(
      (sum, purchase) => sum + purchase.price,
      0,
    );

    // Calculate averages
    const averagePrice =
      totalSnippets > 0
        ? codeSnippets.reduce((sum, snippet) => sum + snippet.price, 0) /
          totalSnippets
        : 0;

    const averageRating =
      totalSnippets > 0
        ? codeSnippets.reduce((sum, snippet) => sum + snippet.rating, 0) /
          totalSnippets
        : 0;

    // Language distribution
    const languageStats = codeSnippets.reduce(
      (acc, snippet) => {
        acc[snippet.language] = (acc[snippet.language] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Framework distribution
    const frameworkStats = codeSnippets.reduce(
      (acc, snippet) => {
        if (snippet.framework) {
          acc[snippet.framework] = (acc[snippet.framework] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    );

    // Top tags
    const tagFrequency = codeSnippets.reduce(
      (acc, snippet) => {
        snippet.tags.forEach((tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
      },
      {} as Record<string, number>,
    );

    const topTags = Object.entries(tagFrequency)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    // Price distribution
    const priceRanges = {
      free: codeSnippets.filter((s) => s.price === 0).length,
      budget: codeSnippets.filter((s) => s.price > 0 && s.price <= 5).length,
      standard: codeSnippets.filter((s) => s.price > 5 && s.price <= 15).length,
      premium: codeSnippets.filter((s) => s.price > 15).length,
    };

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentSnippets = codeSnippets.filter(
      (snippet) => new Date(snippet.createdAt) > thirtyDaysAgo,
    ).length;

    const recentPurchases = purchases.filter(
      (purchase) => new Date(purchase.purchaseDate) > thirtyDaysAgo,
    ).length;

    // Most popular snippets
    const popularSnippets = [...codeSnippets]
      .sort(
        (a, b) =>
          b.downloads * 0.7 + b.rating * 20 - a.downloads * 0.7 - a.rating * 20,
      )
      .slice(0, 5)
      .map((snippet) => ({
        id: snippet.id,
        title: snippet.title,
        author: snippet.author,
        downloads: snippet.downloads,
        rating: snippet.rating,
        price: snippet.price,
      }));

    const response = {
      overview: {
        totalSnippets,
        totalUsers,
        totalPurchases,
        totalRevenue: Number(totalRevenue.toFixed(2)),
        averagePrice: Number(averagePrice.toFixed(2)),
        averageRating: Number(averageRating.toFixed(1)),
      },
      distributions: {
        languages: languageStats,
        frameworks: frameworkStats,
        priceRanges,
        topTags,
      },
      recentActivity: {
        newSnippets: recentSnippets,
        newPurchases: recentPurchases,
      },
      popularSnippets,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting marketplace stats:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch marketplace statistics",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/stats/trending
 * Get trending snippets and tags
 */
export const getTrendingData: RequestHandler = (req, res) => {
  try {
    const { days = 7 } = req.query;
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - Number(days));

    // Get recent purchases to determine trending snippets
    const recentPurchases = purchases.filter(
      (purchase) => new Date(purchase.purchaseDate) > daysAgo,
    );

    // Count purchases per snippet
    const snippetPurchaseCounts = recentPurchases.reduce(
      (acc, purchase) => {
        acc[purchase.snippetId] = (acc[purchase.snippetId] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    // Get trending snippets
    const trendingSnippets = Object.entries(snippetPurchaseCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([snippetId, purchaseCount]) => {
        const snippet = codeSnippets.find((s) => s.id === snippetId);
        return {
          ...snippet,
          recentPurchases: purchaseCount,
        };
      })
      .filter(Boolean);

    // Get trending tags from recently purchased snippets
    const trendingTags = recentPurchases
      .map((purchase) => {
        const snippet = codeSnippets.find((s) => s.id === purchase.snippetId);
        return snippet?.tags || [];
      })
      .flat()
      .reduce(
        (acc, tag) => {
          acc[tag] = (acc[tag] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

    const topTrendingTags = Object.entries(trendingTags)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([tag, count]) => ({ tag, count }));

    const response = {
      period: `${days} days`,
      trendingSnippets,
      trendingTags: topTrendingTags,
      totalTrendingPurchases: recentPurchases.length,
    };

    res.json(response);
  } catch (error) {
    console.error("Error getting trending data:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to fetch trending data",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};
