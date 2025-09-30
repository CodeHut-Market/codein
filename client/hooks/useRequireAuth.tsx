import { useEffect, useState } from "react";

// Conditional auth hook for both React Router and Next.js compatibility
const useConditionalAuth = () => {
  // Check if we're in a Next.js environment
  if (typeof window !== 'undefined' && window.location.pathname.includes('/snippet/')) {
    // We're likely in Next.js context, use local storage fallback
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      // Check for authentication token or session
      const checkAuth = async () => {
        // Try Supabase auth first
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { supabase } = require("../../app/lib/supabaseClient");
          if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          // Fallback to localStorage check
        }
        
        // Fallback to token check
        const token = localStorage.getItem('token') || localStorage.getItem('sb-auth-token');
        setIsAuthenticated(!!token);
        setIsLoading(false);
      };
      
      checkAuth();
    }, []);
    
    return { isAuthenticated, isLoading };
  }
  
  // Try to use React Router AuthContext, fallback to local storage
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-var-requires
    const { useAuth } = require("@/contexts/AuthContext");
    return useAuth();
  } catch {
    // Fallback for when AuthContext is not available
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
      const checkAuth = async () => {
        // Try Supabase auth first
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { supabase } = require("../../app/lib/supabaseClient");
          if (supabase) {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
            setIsLoading(false);
            return;
          }
        } catch (error) {
          // Fallback to localStorage check
        }
        
        // Fallback to token check
        const token = localStorage.getItem('token') || localStorage.getItem('sb-auth-token');
        setIsAuthenticated(!!token);
        setIsLoading(false);
      };
      
      checkAuth();
    }, []);
    
    return { isAuthenticated, isLoading };
  }
};

// Conditional navigation hook for both React Router and Next.js compatibility
const useConditionalNavigate = () => {
  // Check if we're in a Next.js environment
  if (typeof window !== 'undefined' && window.location.pathname.includes('/snippet/')) {
    // We're likely in Next.js context, use window.location
    return (path: string, options?: any) => {
      window.location.href = path;
    };
  }
  
  // Try to use React Router useNavigate, fallback to window.location
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks, @typescript-eslint/no-var-requires
    const { useNavigate } = require("react-router-dom");
    return useNavigate();
  } catch {
    return (path: string, options?: any) => {
      window.location.href = path;
    };
  }
};

// Small helper hook that returns a function to ensure the user is authenticated.
// If not authenticated, it navigates to /login and returns false.
export const useRequireAuth = () => {
  const navigate = useConditionalNavigate();
  const { isAuthenticated, isLoading } = useConditionalAuth();

  const requireAuth = (redirectAfter = true): boolean => {
    // If still loading, don't redirect (caller can handle waiting)
    if (isLoading) return false;

    if (!isAuthenticated) {
      // Preserve optional redirect back to current path using state
      if (redirectAfter) {
        navigate("/login", { replace: true });
      } else {
        navigate("/login");
      }
      return false;
    }

    return true;
  };

  return requireAuth;
};

export default useRequireAuth;
