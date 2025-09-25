import { ErrorResponse, FavoriteStatusResponse } from "@shared/api";
import { RequestHandler } from "express";
import { pool } from "../db/database";

// Helper to fetch favorite status & count
async function getFavoriteStatus(snippetId: string, userId?: string): Promise<FavoriteStatusResponse> {
  if (!pool) {
    return { snippetId, isFavorited: false, favoriteCount: 0 };
  }
  const statusQuery = `SELECT favorite_count FROM snippets WHERE id = $1`;
  const { rows } = await pool.query(statusQuery, [snippetId]);
  const favoriteCount = rows.length ? parseInt(rows[0].favorite_count) || 0 : 0;

  if (!userId) return { snippetId, isFavorited: false, favoriteCount };
  const favRes = await pool.query(
    `SELECT 1 FROM favorites WHERE snippet_id = $1 AND user_id = $2 LIMIT 1`,
    [snippetId, userId]
  );
  return { snippetId, isFavorited: favRes.rowCount > 0, favoriteCount };
}

export const getFavoriteStatusHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params; // snippet id
    const user = (req as any).user;
    const status = await getFavoriteStatus(id, user?.id);
    res.json(status);
  } catch (error) {
    console.error("Favorite status error", error);
    const err: ErrorResponse = { error: "Internal Server Error", message: "Failed to load favorite status", statusCode: 500 };
    res.status(500).json(err);
  }
};

export const toggleFavoriteHandler: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params; // snippet id
    const user = (req as any).user;
    if (!user) {
      const err: ErrorResponse = { error: "Unauthorized", message: "Authentication required", statusCode: 401 };
      return res.status(401).json(err);
    }

    if (!pool) {
      const err: ErrorResponse = { error: "Service Unavailable", message: "Database not configured", statusCode: 503 };
      return res.status(503).json(err);
    }

    // Determine current status
    const existing = await pool.query(
      `SELECT 1 FROM favorites WHERE snippet_id = $1 AND user_id = $2 LIMIT 1`,
      [id, user.id]
    );

    if (existing.rowCount > 0) {
      // Remove favorite
      await pool.query(`DELETE FROM favorites WHERE snippet_id = $1 AND user_id = $2`, [id, user.id]);
    } else {
      // Add favorite
      await pool.query(`INSERT INTO favorites (snippet_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING`, [id, user.id]);
    }

    const status = await getFavoriteStatus(id, user.id);
    res.json({ ...status, toggled: true });
  } catch (error) {
    console.error("Toggle favorite error", error);
    const err: ErrorResponse = { error: "Internal Server Error", message: "Failed to toggle favorite", statusCode: 500 };
    res.status(500).json(err);
  }
};
