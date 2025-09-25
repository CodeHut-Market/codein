/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Code snippet data structure
 */
export interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  price: number;
  rating: number;
  author: string;
  authorId: string;
  tags: string[];
  language: string;
  framework?: string;
  downloads: number;
  createdAt: string;
  updatedAt: string;
  /** Optional aggregated favorites count */
  favoriteCount?: number;
}

/**
 * Request body for creating a new code snippet
 */
export interface CreateCodeSnippetRequest {
  title: string;
  description: string;
  code: string;
  price: number;
  tags: string[];
  language: string;
  framework?: string;
}

/**
 * Request body for updating an existing code snippet
 */
export interface UpdateCodeSnippetRequest {
  title?: string;
  description?: string;
  code?: string;
  price?: number;
  tags?: string[];
  language?: string;
  framework?: string;
}

/**
 * Response for updating a code snippet
 */
export interface UpdateCodeSnippetResponse {
  snippet: CodeSnippet;
  message: string;
}

/**
 * Response for deleting a code snippet
 */
export interface DeleteCodeSnippetResponse {
  message: string;
  deletedId: string;
}

/**
 * Response for getting code snippets
 */
export interface GetCodeSnippetsResponse {
  snippets: CodeSnippet[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Response for creating a code snippet
 */
export interface CreateCodeSnippetResponse {
  snippet: CodeSnippet;
  message: string;
}

/**
 * Search/filter parameters for code snippets
 */
export interface SearchCodeSnippetsParams {
  query?: string;
  tags?: string[];
  language?: string;
  framework?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "createdAt" | "rating" | "price" | "downloads";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

/**
 * User data structure
 */
export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  totalSnippets: number;
  totalDownloads: number;
  rating: number;
  createdAt: string;
}

/**
 * Purchase data structure
 */
export interface Purchase {
  id: string;
  userId: string;
  snippetId: string;
  price: number;
  purchaseDate: string;
}

/**
 * Response for getting user profile
 */
export interface GetUserResponse {
  user: User;
  snippets: CodeSnippet[];
}

/**
 * Response for purchasing a snippet
 */
export interface PurchaseSnippetResponse {
  purchase: Purchase;
  snippet: CodeSnippet;
  message: string;
}

/**
 * Error response structure
 */
export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}

/**
 * Authentication request/response types
 */
export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  bio?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  message: string;
  expiresIn?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SessionInfo {
  userId: string;
  username: string;
  email: string;
  role: string;
  loginTime: Date;
  lastActivity: Date;
}

export interface SessionsResponse {
  sessions: SessionInfo[];
  totalSessions: number;
  activeSessions: number;
}

/**
 * Notification types
 */
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "success" | "info" | "warning" | "error";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  newSnippetAlerts: boolean;
  purchaseConfirmations: boolean;
}

/**
 * Favorites/Wishlist types
 */
export interface Favorite {
  id: string;
  userId: string;
  snippetId: string;
  addedAt: string;
}

export interface FavoritesResponse {
  favorites: Favorite[];
  snippets: CodeSnippet[];
  total: number;
}

/** Favorite status + count response */
export interface FavoriteStatusResponse {
  snippetId: string;
  isFavorited: boolean;
  favoriteCount: number;
}

/**
 * Enhanced search and filter types
 */
export interface SearchFilters {
  languages: string[];
  frameworks: string[];
  tags: string[];
  priceRanges: Array<{ min: number; max: number; label: string }>;
  authors: Array<{ id: string; username: string; snippetCount: number }>;
}

export interface SearchSuggestion {
  query: string;
  type: "snippet" | "tag" | "author" | "language";
  count: number;
}

export interface SearchSuggestionsResponse {
  suggestions: SearchSuggestion[];
}

/**
 * Analytics and stats types
 */
export interface UserAnalytics {
  totalViews: number;
  totalDownloads: number;
  totalEarnings: number;
  popularSnippets: Array<{
    snippet: CodeSnippet;
    views: number;
    downloads: number;
    earnings: number;
  }>;
  monthlyStats: Array<{
    month: string;
    views: number;
    downloads: number;
    earnings: number;
  }>;
}

/**
 * Theme preferences
 */
export interface ThemePreferences {
  theme: "light" | "dark" | "system";
  accentColor: string;
  reducedMotion: boolean;
  compactMode: boolean;
}
