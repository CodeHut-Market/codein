import React, {
    createContext,
    ReactNode,
    useContext,
    useEffect,
    useState,
} from "react";
import { isSupabaseEnabled, supabase } from "../../app/lib/supabaseClient";

interface User {
  id: string;
  username: string;
  email: string;
  bio: string;
  avatar: string;
  totalSnippets: number;
  totalDownloads: number;
  rating: number;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, accessToken: string) => void;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ data?: any; error?: any }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthState = async () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          // Verify token is still valid
          const response = await fetch("/api/auth/me", {
            headers: {
              Authorization: `Bearer ${storedToken}`,
            },
          });

          // Read response once and handle both cases
          let responseData;
          try {
            responseData = await response.json();
          } catch (parseError) {
            // If we can't parse the response, treat as invalid token
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            return;
          }

          if (response.ok) {
            setUser(responseData.user);
            setToken(storedToken);
          } else {
            // Token is invalid, clear stored data
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          }
        } catch (error) {
          console.error("Auth check failed:", error);
          // Clear invalid stored data
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
      setIsLoading(false);
    };

    checkAuthState();
  }, []);

  const login = (userData: User, accessToken: string) => {
    setUser(userData);
    setToken(accessToken);
    localStorage.setItem("token", accessToken);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const signUp = async (email: string, password: string, metadata?: any) => {
    try {
      setIsLoading(true);
      
      // Try Supabase signup first if available
      if (isSupabaseEnabled() && supabase) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: metadata || {}
          }
        });
        
        if (error) {
          return { error };
        }
        
        if (data.user) {
          // Auto-login if session is available
          if (data.session) {
            const userData: User = {
              id: data.user.id,
              username: metadata?.username || data.user.email?.split('@')[0] || 'User',
              email: data.user.email || email,
              bio: metadata?.bio || '',
              avatar: data.user.user_metadata?.avatar_url || '',
              totalSnippets: 0,
              totalDownloads: 0,
              rating: 0,
              role: 'user',
              isActive: true,
              emailVerified: data.user.email_confirmed_at ? true : false,
              createdAt: data.user.created_at || new Date().toISOString(),
              lastLoginAt: new Date().toISOString()
            };
            
            login(userData, data.session.access_token);
          }
        }
        
        return { data, error: null };
      } else {
        // Fallback to API-based signup
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password,
            metadata
          })
        });
        
        const result = await response.json();
        
        if (!response.ok) {
          return { error: { message: result.error || 'Signup failed' } };
        }
        
        return { data: result, error: null };
      }
    } catch (error) {
      console.error('SignUp error:', error);
      return { 
        error: { 
          message: error instanceof Error ? error.message : 'An unexpected error occurred during signup' 
        } 
      };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate session
      if (token) {
        await fetch("/api/auth/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state regardless of API call success
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const value: AuthContextType = {
    user,
    token,
    login,
    signUp,
    logout,
    updateUser,
    isLoading,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook for making authenticated API calls
export const useAuthenticatedFetch = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthenticatedFetch must be used within an AuthProvider");
  }
  const { token } = context;

  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const headers = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    return fetch(url, {
      ...options,
      headers,
    });
  };

  return authenticatedFetch;
};

export default AuthContext;
