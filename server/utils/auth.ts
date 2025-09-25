import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { RequestHandler } from "express";
import { ErrorResponse } from "@shared/api";
import { findUserById } from "../db/database";

// Environment variables with defaults for demo
const JWT_SECRET =
  process.env.JWT_SECRET || "demo-secret-key-change-in-production";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || "30d";

export interface JWTPayload {
  userId: string;
  username: string;
  email: string;
  role: "user" | "admin" | "moderator";
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

/**
 * Hash password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compare password with hash
 */
export const comparePassword = async (
  password: string,
  hash: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};

/**
 * Generate JWT access token
 */
export const generateAccessToken = (
  payload: Omit<JWTPayload, "iat" | "exp">,
): string => {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    issuer: "codehut-marketplace",
    audience: "codehut-users",
  });
};

/**
 * Generate JWT refresh token
 */
export const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId, type: "refresh" }, JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    issuer: "codehut-marketplace",
    audience: "codehut-users",
  });
};

/**
 * Generate both access and refresh tokens
 */
export const generateTokenPair = (user: any): TokenPair => {
  const payload: Omit<JWTPayload, "iat" | "exp"> = {
    userId: user.id,
    username: user.username,
    email: user.email,
    role: user.role || "user",
  };

  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(user.id),
  };
};

/**
 * Verify JWT token
 */
export const verifyToken = (token: string): JWTPayload | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET, {
      issuer: "codehut-marketplace",
      audience: "codehut-users",
    }) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};

/**
 * Middleware to authenticate requests
 */
export const authenticateToken: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Access token required",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    const decoded = verifyToken(token);
    if (!decoded || decoded.type === "refresh") {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Invalid or expired access token",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    // Verify user still exists
    const user = await findUserById(decoded.userId);
    if (!user) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "User not found",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    // Add user data to request
    (req as any).user = {
      id: decoded.userId,
      username: decoded.username,
      email: decoded.email,
      role: decoded.role,
      ...user,
    };

    next();
  } catch (error) {
    console.error("Authentication middleware error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Authentication failed",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * Middleware to check user role
 */
export const requireRole = (
  roles: Array<"user" | "admin" | "moderator">,
): RequestHandler => {
  return (req, res, next) => {
    const user = (req as any).user;

    if (!user) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Authentication required",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    if (!roles.includes(user.role)) {
      const errorResponse: ErrorResponse = {
        error: "Forbidden",
        message: "Insufficient permissions",
        statusCode: 403,
      };
      return res.status(403).json(errorResponse);
    }

    next();
  };
};

/**
 * Middleware to check if user is admin
 */
export const requireAdmin = requireRole(["admin"]);

/**
 * Middleware to check if user is admin or moderator
 */
export const requireModerator = requireRole(["admin", "moderator"]);

/**
 * Optional authentication - adds user to request if token is valid, but doesn't fail if not
 */
export const optionalAuth: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = verifyToken(token);
      if (decoded && decoded.type !== "refresh") {
        const user = await findUserById(decoded.userId);
        if (user) {
          (req as any).user = {
            id: decoded.userId,
            username: decoded.username,
            email: decoded.email,
            role: decoded.role,
            ...user,
          };
        }
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

/**
 * Validate password strength
 */
export const validatePassword = (
  password: string,
): { valid: boolean; message?: string } => {
  if (password.length < 8) {
    return {
      valid: false,
      message: "Password must be at least 8 characters long",
    };
  }

  if (!/(?=.*[a-z])/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one lowercase letter",
    };
  }

  if (!/(?=.*[A-Z])/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one uppercase letter",
    };
  }

  if (!/(?=.*\d)/.test(password)) {
    return {
      valid: false,
      message: "Password must contain at least one number",
    };
  }

  return { valid: true };
};

/**
 * Session management - In production, store this in Redis
 */
interface UserSession {
  userId: string;
  username: string;
  email: string;
  role: string;
  loginTime: Date;
  lastActivity: Date;
  refreshToken: string;
}

class SessionManager {
  private sessions = new Map<string, UserSession>();

  createSession(userId: string, user: any, refreshToken: string): void {
    const session: UserSession = {
      userId,
      username: user.username,
      email: user.email,
      role: user.role || "user",
      loginTime: new Date(),
      lastActivity: new Date(),
      refreshToken,
    };
    this.sessions.set(userId, session);
  }

  getSession(userId: string): UserSession | undefined {
    return this.sessions.get(userId);
  }

  updateActivity(userId: string): void {
    const session = this.sessions.get(userId);
    if (session) {
      session.lastActivity = new Date();
    }
  }

  removeSession(userId: string): void {
    this.sessions.delete(userId);
  }

  getAllSessions(): UserSession[] {
    return Array.from(this.sessions.values());
  }

  getActiveSessionsCount(): number {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    return Array.from(this.sessions.values()).filter(
      (session) => session.lastActivity > oneHourAgo,
    ).length;
  }
}

export const sessionManager = new SessionManager();
