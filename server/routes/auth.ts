import { RequestHandler } from "express";
import { ErrorResponse } from "@shared/api";
import {
  findUserByUsername,
  findUserById,
  findUserByEmail,
  addUser,
  updateUser,
  updateUserPassword,
  getUserPassword,
  createSession,
  getSession,
  removeSession,
  updateSessionActivity,
  EnhancedUser,
} from "../db/database";
import {
  hashPassword,
  comparePassword,
  generateTokenPair,
  verifyToken,
  validatePassword,
  authenticateToken,
} from "../utils/auth";

/**
 * POST /api/auth/signup
 * Register a new user
 */
export const signup: RequestHandler = async (req, res) => {
  try {
    const { username, email, password, bio } = req.body;

    // Validate required fields
    if (!username || !email || !password) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Missing required fields: username, email, password",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Invalid email format",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_-]{3,20}$/;
    if (!usernameRegex.test(username)) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message:
          "Username must be 3-20 characters long and contain only letters, numbers, underscores, and hyphens",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Validate password strength
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: passwordValidation.message!,
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    try {
      // Try PostgreSQL database first
      // Check if username already exists
      if (await findUserByUsername(username)) {
        const errorResponse: ErrorResponse = {
          error: "Conflict",
          message: "Username already exists",
          statusCode: 409,
        };
        return res.status(409).json(errorResponse);
      }

      // Check if email already exists
      if (await findUserByEmail(email)) {
        const errorResponse: ErrorResponse = {
          error: "Conflict",
          message: "Email already registered",
          statusCode: 409,
        };
        return res.status(409).json(errorResponse);
      }
    } catch (dbError) {
      console.log(
        "PostgreSQL unavailable for auth, falling back to in-memory data",
      );

      // Fallback to in-memory data
      const {
        findUserByUsername: memFindUserByUsername,
        findUserByEmail: memFindUserByEmail,
      } = await import("../database");

      // Check if username already exists
      if (memFindUserByUsername(username)) {
        const errorResponse: ErrorResponse = {
          error: "Conflict",
          message: "Username already exists",
          statusCode: 409,
        };
        return res.status(409).json(errorResponse);
      }

      // Check if email already exists
      if (memFindUserByEmail(email)) {
        const errorResponse: ErrorResponse = {
          error: "Conflict",
          message: "Email already registered",
          statusCode: 409,
        };
        return res.status(409).json(errorResponse);
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create new user with default role
    const newUser: EnhancedUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      username,
      email,
      bio: bio || "",
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
      totalSnippets: 0,
      totalDownloads: 0,
      rating: 0,
      role: "user" as const, // Default role
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      isActive: true,
      emailVerified: false, // In production, implement email verification
    };

    // Generate tokens
    const tokens = generateTokenPair(newUser);

    // Add user to database
    try {
      await addUser(newUser, passwordHash);

      // Create session
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30); // 30 days
      await createSession(newUser.id, tokens.refreshToken, expiresAt);
    } catch (dbError) {
      console.log(
        "PostgreSQL unavailable for user creation, falling back to in-memory data",
      );

      // Fallback to in-memory data
      const { addUser: memAddUser } = await import("../database");
      memAddUser(newUser, passwordHash);

      // Note: Session management not available in fallback mode
    }

    // Remove sensitive data before sending response
    const { password_hash, ...userResponse } = newUser;

    const response = {
      user: userResponse,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: "Account created successfully",
    };

    res.status(201).json(response);
  } catch (error) {
    console.error("Signup error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to create account",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * POST /api/auth/login
 * Login user
 */
export const login: RequestHandler = async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    // Validate required fields
    if (!email || !password) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Missing required fields: email, password",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Find user by email with fallback
    let user: any = null;
    let storedPasswordHash: string | null | undefined = null;

    try {
      // Try PostgreSQL database first
      user = await findUserByEmail(email);

      if (user) {
        storedPasswordHash = await getUserPassword(user.id);
      }

      // If DB didn't return a user (or no password hash), try in-memory before rejecting
      if (!user || !storedPasswordHash) {
        const {
          findUserByEmail: memFindUserByEmail,
          getUserPassword: memGetUserPassword,
        } = await import("../database");
        const memUser = memFindUserByEmail(email);
        if (memUser) {
          user = memUser;
          storedPasswordHash = memGetUserPassword(memUser.id);
        }
      }
    } catch (dbError) {
      console.log(
        "PostgreSQL unavailable for login, falling back to in-memory data",
      );
      const {
        findUserByEmail: memFindUserByEmail,
        getUserPassword: memGetUserPassword,
      } = await import("../database");
      user = memFindUserByEmail(email);
      storedPasswordHash = user ? memGetUserPassword(user.id) : null;
    }

    // Validate user and status
    if (!user) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Invalid email or password",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    if (!user.isActive) {
      const errorResponse: ErrorResponse = {
        error: "Forbidden",
        message: "Account has been deactivated",
        statusCode: 403,
      };
      return res.status(403).json(errorResponse);
    }

    if (!storedPasswordHash) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Invalid email or password",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    // Check password
    const isPasswordValid = await comparePassword(password, storedPasswordHash);
    if (!isPasswordValid) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Invalid email or password",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Update last login and create session with fallback
    try {
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() });

      // Create session
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + (rememberMe ? 30 : 7));
      await createSession(user.id, tokens.refreshToken, expiresAt);
    } catch (dbError) {
      console.log(
        "PostgreSQL unavailable for session management, falling back to in-memory data",
      );

      // Fallback to in-memory data
      const { updateUser: memUpdateUser } = await import("../database");
      memUpdateUser(user.id, { lastLoginAt: new Date().toISOString() });

      // Note: Session management not available in fallback mode
    }

    // Remove sensitive data before sending response
    const { password_hash, ...userResponse } = user;

    const response = {
      user: userResponse,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      expiresIn: rememberMe ? "30d" : "7d",
      message: "Login successful",
    };

    res.json(response);
  } catch (error) {
    console.error("Login error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to login",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * POST /api/auth/refresh
 * Refresh access token using refresh token
 */
export const refreshToken: RequestHandler = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Refresh token required",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken);
    if (!decoded || decoded.type !== "refresh") {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Invalid refresh token",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    // Check if session exists
    const session = await getSession(decoded.userId);
    if (!session || session.refresh_token !== refreshToken) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Session expired or invalid",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    // Get user
    const user = await findUserById(decoded.userId);
    if (!user || !user.isActive) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "User not found or inactive",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    // Generate new tokens
    const tokens = generateTokenPair(user);

    // Update session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);
    await createSession(user.id, tokens.refreshToken, expiresAt);

    // Remove sensitive data before sending response
    const { password_hash, ...userResponse } = user;

    const response = {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: userResponse,
    };

    res.json(response);
  } catch (error) {
    console.error("Refresh token error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to refresh token",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * POST /api/auth/logout
 * Logout user and invalidate session
 */
export const logout: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;

    if (user) {
      // Remove session
      await removeSession(user.id);
    }

    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error("Logout error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to logout",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/auth/me
 * Get current user profile
 */
export const getCurrentUser: RequestHandler = async (req, res) => {
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

    // Update activity
    await updateSessionActivity(user.id);

    // Remove sensitive data before sending response
    const { password_hash, ...userResponse } = user;

    res.json({ user: userResponse });
  } catch (error) {
    console.error("Get current user error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to get user profile",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * PUT /api/auth/change-password
 * Change user password
 */
export const changePassword: RequestHandler = async (req, res) => {
  try {
    const user = (req as any).user;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: "Current password and new password are required",
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Validate new password strength
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.valid) {
      const errorResponse: ErrorResponse = {
        error: "Bad Request",
        message: passwordValidation.message!,
        statusCode: 400,
      };
      return res.status(400).json(errorResponse);
    }

    // Get stored password hash
    const storedPasswordHash = await getUserPassword(user.id);

    if (!storedPasswordHash) {
      const errorResponse: ErrorResponse = {
        error: "Internal Server Error",
        message: "Account configuration error",
        statusCode: 500,
      };
      return res.status(500).json(errorResponse);
    }

    // Verify current password
    const isCurrentPasswordValid = await comparePassword(
      currentPassword,
      storedPasswordHash,
    );
    if (!isCurrentPasswordValid) {
      const errorResponse: ErrorResponse = {
        error: "Unauthorized",
        message: "Current password is incorrect",
        statusCode: 401,
      };
      return res.status(401).json(errorResponse);
    }

    // Hash new password
    const newPasswordHash = await hashPassword(newPassword);

    // Update password
    await updateUserPassword(user.id, newPasswordHash);

    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to change password",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /api/auth/sessions
 * Get active sessions (admin only)
 */
export const getActiveSessions: RequestHandler = async (req, res) => {
  try {
    // This would need to be implemented based on your session storage
    // For now, return empty array
    res.json({
      sessions: [],
      totalSessions: 0,
      activeSessions: 0,
    });
  } catch (error) {
    console.error("Get sessions error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to get sessions",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

// Demo login for existing users (for testing purposes)
export const demoLogin: RequestHandler = async (req, res) => {
  try {
    const { username } = req.params;

    // Find user with fallback
    let user;
    try {
      user = await findUserByUsername(username);
    } catch (dbError) {
      console.log(
        "PostgreSQL unavailable for demo login, falling back to in-memory data",
      );

      // Fallback to in-memory data
      const { findUserByUsername: memFindUserByUsername } = await import(
        "../database"
      );
      user = memFindUserByUsername(username);
    }

    if (!user) {
      // Auto-provision a demo user if not found
      const nowIso = new Date().toISOString();
      const demoUser: EnhancedUser = {
        id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        username,
        email: `${username.toLowerCase()}@example.com`,
        bio: "Demo user account",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random`,
        totalSnippets: 0,
        totalDownloads: 0,
        rating: 0,
        role: "user",
        lastLoginAt: nowIso,
        isActive: true,
        emailVerified: true,
        createdAt: nowIso,
      };

      const tokens = generateTokenPair(demoUser);

      try {
        // Try to persist if DB available
        const { addUser } = await import("../db/database");
        // Provide a default password hash for demo accounts
        const { hashPassword } = await import("../utils/auth");
        const hash = await hashPassword("demo1234A!");
        await addUser(demoUser, hash);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        await createSession(demoUser.id, tokens.refreshToken, expiresAt);
      } catch {
        // Fallback to in-memory store
        const { addUser: memAddUser } = await import("../database");
        const { hashPassword } = await import("../utils/auth");
        const hash = await hashPassword("demo1234A!");
        memAddUser(demoUser as any, hash);
      }

      const { password_hash, ...userResponse } = demoUser as any;
      return res.json({
        user: userResponse,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        message: "Demo login successful",
      });
    }

    // Generate tokens
    const tokens = generateTokenPair(user);

    // Update last login and create session with fallback
    try {
      await updateUser(user.id, { lastLoginAt: new Date().toISOString() });

      // Create session
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 7);
      await createSession(user.id, tokens.refreshToken, expiresAt);
    } catch (dbError) {
      console.log(
        "PostgreSQL unavailable for session management in demo login, falling back to in-memory data",
      );

      // Fallback to in-memory data
      const { updateUser: memUpdateUser } = await import("../database");
      memUpdateUser(user.id, { lastLoginAt: new Date().toISOString() });

      // Note: Session management not available in fallback mode
    }

    // Remove sensitive data before sending response
    const { password_hash, ...userResponse } = user;

    const response = {
      user: userResponse,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      message: "Demo login successful",
    };

    res.json(response);
  } catch (error) {
    console.error("Demo login error:", error);
    const errorResponse: ErrorResponse = {
      error: "Internal Server Error",
      message: "Failed to demo login",
      statusCode: 500,
    };
    res.status(500).json(errorResponse);
  }
};

// Export the middleware for use in other routes
export { authenticateToken };
