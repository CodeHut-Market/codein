import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

// Small helper hook that returns a function to ensure the user is authenticated.
// If not authenticated, it navigates to /login and returns false.
export const useRequireAuth = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

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
