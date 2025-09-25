import { CodeSnippet, Purchase, User } from "@shared/api";
import { Pool } from "pg";

// Enhanced User interface for internal use
export interface EnhancedUser extends User {
  password_hash?: string;
  role: "user" | "admin" | "moderator";
  lastLoginAt: string;
  isActive: boolean;
  emailVerified: boolean;
}

// PostgreSQL connection pool
let pool: Pool | null = null;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl:
      process.env.NODE_ENV === "production"
        ? { rejectUnauthorized: false }
        : false,
  });
} else {
  console.warn("⚠️  DATABASE_URL not set - database features will be disabled");
}

// Test database connection
export const testConnection = async (): Promise<void> => {
  if (!pool) {
    console.log("⚠️  Database not configured - skipping connection test");
    return;
  }

  try {
    const client = await pool.connect();
    console.log("✅ Neon PostgreSQL database connected successfully");
    client.release();
  } catch (error) {
    console.error("❌ Neon PostgreSQL database connection failed:", error);
    console.error("   Consider connecting to Neon for database functionality");
    throw error;
  }
};

// User Management Functions
export const findUserById = async (
  id: string,
): Promise<EnhancedUser | null> => {
  if (!pool) return null;
  try {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
    return result.rows.length > 0 ? mapDbUserToEnhanced(result.rows[0]) : null;
  } catch (error) {
    console.error("Error finding user by ID:", error);
    return null;
  }
};

export const findUserByUsername = async (
  username: string,
): Promise<EnhancedUser | null> => {
  if (!pool) return null;
  try {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
    return result.rows.length > 0 ? mapDbUserToEnhanced(result.rows[0]) : null;
  } catch (error) {
    console.error("Error finding user by username:", error);
    return null;
  }
};

export const findUserByEmail = async (
  email: string,
): Promise<EnhancedUser | null> => {
  if (!pool) return null;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    return result.rows.length > 0 ? mapDbUserToEnhanced(result.rows[0]) : null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
};

export const addUser = async (
  user: EnhancedUser,
  passwordHash: string,
): Promise<void> => {
  if (!pool) throw new Error("Database not configured");
  try {
    await pool.query(
      `INSERT INTO users (
        id, username, email, password_hash, bio, avatar, role, 
        total_snippets, total_downloads, rating, is_active, 
        email_verified, created_at, last_login_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
      [
        user.id,
        user.username,
        user.email,
        passwordHash,
        user.bio || "",
        user.avatar,
        user.role,
        user.totalSnippets || 0,
        user.totalDownloads || 0,
        user.rating || 0,
        user.isActive,
        user.emailVerified,
        user.createdAt,
        user.lastLoginAt,
      ],
    );
  } catch (error) {
    console.error("Error adding user:", error);
    throw error;
  }
};

export const updateUser = async (
  userId: string,
  updates: Partial<EnhancedUser>,
): Promise<EnhancedUser | null> => {
  if (!pool) return null;
  try {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    // Map camelCase properties to snake_case column names
    const columnMapping: { [key: string]: string } = {
      lastLoginAt: "last_login_at",
      isActive: "is_active",
      emailVerified: "email_verified",
      createdAt: "created_at",
      totalSnippets: "total_snippets",
      totalDownloads: "total_downloads",
      razorpayAccountId: "razorpay_account_id",
    };

    for (const [key, value] of Object.entries(updates)) {
      if (value !== undefined) {
        const columnName = columnMapping[key] || key;
        setClause.push(`${columnName} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (setClause.length === 0) return null;

    values.push(userId);
    const query = `
      UPDATE users
      SET ${setClause.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);
    return result.rows.length > 0 ? mapDbUserToEnhanced(result.rows[0]) : null;
  } catch (error) {
    console.error("Error updating user:", error);
    return null;
  }
};

export const updateUserPassword = async (
  userId: string,
  passwordHash: string,
): Promise<void> => {
  if (!pool) throw new Error("Database not configured");
  try {
    await pool.query(
      "UPDATE users SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2",
      [passwordHash, userId],
    );
  } catch (error) {
    console.error("Error updating user password:", error);
    throw error;
  }
};

export const getUserPassword = async (
  userId: string,
): Promise<string | null> => {
  if (!pool) return null;
  try {
    const result = await pool.query(
      "SELECT password_hash FROM users WHERE id = $1",
      [userId],
    );
    return result.rows.length > 0 ? result.rows[0].password_hash : null;
  } catch (error) {
    console.error("Error getting user password:", error);
    return null;
  }
};

// Session Management
export const createSession = async (
  userId: string,
  refreshToken: string,
  expiresAt: Date,
): Promise<void> => {
  if (!pool) throw new Error("Database not configured");
  try {
    // Remove existing sessions for the user
    await pool.query("DELETE FROM user_sessions WHERE user_id = $1", [userId]);

    // Create new session
    await pool.query(
      "INSERT INTO user_sessions (user_id, refresh_token, expires_at) VALUES ($1, $2, $3)",
      [userId, refreshToken, expiresAt],
    );
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  }
};

export const getSession = async (userId: string): Promise<any | null> => {
  if (!pool) return null;
  try {
    const result = await pool.query(
      "SELECT * FROM user_sessions WHERE user_id = $1 AND expires_at > CURRENT_TIMESTAMP",
      [userId],
    );
    return result.rows.length > 0 ? result.rows[0] : null;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
};

export const removeSession = async (userId: string): Promise<void> => {
  if (!pool) return;
  try {
    await pool.query("DELETE FROM user_sessions WHERE user_id = $1", [userId]);
  } catch (error) {
    console.error("Error removing session:", error);
    throw error;
  }
};

export const updateSessionActivity = async (userId: string): Promise<void> => {
  if (!pool) return;
  try {
    await pool.query(
      "UPDATE user_sessions SET last_activity = CURRENT_TIMESTAMP WHERE user_id = $1",
      [userId],
    );
  } catch (error) {
    console.error("Error updating session activity:", error);
  }
};

// Snippet Management
export const getAllSnippets = async (): Promise<CodeSnippet[]> => {
  if (!pool) return [];
  try {
    const result = await pool.query(
      "SELECT * FROM snippets ORDER BY created_at DESC",
    );
    return result.rows.map(mapDbSnippetToCodeSnippet);
  } catch (error) {
    console.error("Error getting all snippets:", error);
    return [];
  }
};

export const findSnippetById = async (
  id: string,
): Promise<CodeSnippet | null> => {
  if (!pool) return null;
  try {
    const result = await pool.query("SELECT * FROM snippets WHERE id = $1", [
      id,
    ]);
    return result.rows.length > 0
      ? mapDbSnippetToCodeSnippet(result.rows[0])
      : null;
  } catch (error) {
    console.error("Error finding snippet by ID:", error);
    return null;
  }
};

export const createSnippet = async (
  snippet: Omit<
    CodeSnippet,
    "id" | "createdAt" | "updatedAt" | "rating" | "downloads"
  >,
): Promise<CodeSnippet> => {
  if (!pool) throw new Error("Database not configured");
  try {
    const id = `snippet-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await pool.query(
      `INSERT INTO snippets (
        id, title, description, code, price, author_id, author_username,
        tags, language, framework, rating, downloads
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
      [
        id,
        snippet.title,
        snippet.description,
        snippet.code,
        snippet.price,
        snippet.authorId,
        snippet.author,
        snippet.tags,
        snippet.language,
        snippet.framework,
        0, // rating
        0, // downloads
      ],
    );

    const result = await pool.query("SELECT * FROM snippets WHERE id = $1", [
      id,
    ]);
    return mapDbSnippetToCodeSnippet(result.rows[0]);
  } catch (error) {
    console.error("Error creating snippet:", error);
    throw error;
  }
};

// Purchase Management
export const createPurchase = async (
  purchase: Omit<Purchase, "id" | "purchaseDate">,
): Promise<Purchase> => {
  if (!pool) throw new Error("Database not configured");
  try {
    const id = `purchase-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    await pool.query(
      "INSERT INTO purchases (id, user_id, snippet_id, price) VALUES ($1, $2, $3, $4)",
      [id, purchase.userId, purchase.snippetId, purchase.price],
    );

    const result = await pool.query("SELECT * FROM purchases WHERE id = $1", [
      id,
    ]);
    return {
      id: result.rows[0].id,
      userId: result.rows[0].user_id,
      snippetId: result.rows[0].snippet_id,
      price: parseFloat(result.rows[0].price),
      purchaseDate: result.rows[0].purchase_date,
    };
  } catch (error) {
    console.error("Error creating purchase:", error);
    throw error;
  }
};

export const getUserPurchases = async (userId: string): Promise<Purchase[]> => {
  if (!pool) return [];
  try {
    const result = await pool.query(
      "SELECT * FROM purchases WHERE user_id = $1 ORDER BY purchase_date DESC",
      [userId],
    );
    return result.rows.map((row) => ({
      id: row.id,
      userId: row.user_id,
      snippetId: row.snippet_id,
      price: parseFloat(row.price),
      purchaseDate: row.purchase_date,
    }));
  } catch (error) {
    console.error("Error getting user purchases:", error);
    return [];
  }
};

// Utility functions to map database rows to application types
const mapDbUserToEnhanced = (dbRow: any): EnhancedUser => ({
  id: dbRow.id,
  username: dbRow.username,
  email: dbRow.email,
  bio: dbRow.bio || "",
  avatar: dbRow.avatar,
  totalSnippets: dbRow.total_snippets || 0,
  totalDownloads: dbRow.total_downloads || 0,
  rating: parseFloat(dbRow.rating) || 0,
  role: dbRow.role,
  lastLoginAt: dbRow.last_login_at,
  isActive: dbRow.is_active,
  emailVerified: dbRow.email_verified,
  createdAt: dbRow.created_at,
  password_hash: dbRow.password_hash,
});

const mapDbSnippetToCodeSnippet = (dbRow: any): CodeSnippet => ({
  id: dbRow.id,
  title: dbRow.title,
  description: dbRow.description,
  code: dbRow.code,
  price: parseFloat(dbRow.price),
  rating: parseFloat(dbRow.rating) || 0,
  author: dbRow.author_username,
  authorId: dbRow.author_id,
  tags: dbRow.tags || [],
  language: dbRow.language,
  framework: dbRow.framework,
  downloads: dbRow.downloads || 0,
  createdAt: dbRow.created_at,
  updatedAt: dbRow.updated_at,
  favoriteCount: dbRow.favorite_count ?? undefined,
});

// Initialize connection on module load - only if database is configured
if (pool) {
  testConnection().catch((error) => {
    console.error("Database connection failed:", error);
  });
}

export { pool };

