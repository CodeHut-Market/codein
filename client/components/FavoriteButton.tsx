import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabaseClient";
import { Heart, Loader2, LogIn, UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface FavoriteButtonProps {
  snippetId: string;
  userId?: string;
  initialIsFavorited?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  showCount?: boolean;
  variant?: "default" | "ghost" | "outline";
}

export default function FavoriteButton({
  snippetId,
  userId,
  initialIsFavorited = false,
  className,
  size = "md",
  showCount = false,
  variant = "ghost",
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const { showSuccess, showError, showInfo } = useNotifications();
  const router = useRouter();

  const loadFavoriteStatus = useCallback(async () => {
    try {
      // For now, use localStorage as fallback - this will be replaced when auth is fully integrated
      const userFavorites = JSON.parse(localStorage.getItem("userFavorites") || "[]");
      setIsFavorited(userFavorites.includes(snippetId));
      
      // Try to get count from API if available
      try {
        const res = await fetch(`/api/favorites/status/${snippetId}`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          setFavoriteCount(data.favoriteCount || 0);
        }
      } catch (e) {
        // Silent fail for count
        console.warn("Could not load favorite count", e);
      }
    } catch (e) {
      console.warn("Favorite status load failed", e);
    }
  }, [snippetId]);

  useEffect(() => {
    loadFavoriteStatus();
  }, [loadFavoriteStatus]);

  const toggleFavorite = async () => {
    setLoading(true);

    try {
      // Check if Supabase is configured
      if (!supabase) {
        console.log('⚠️ Supabase not configured, showing sign-in dialog');
        setShowSignInDialog(true);
        setLoading(false);
        return;
      }

      // Check if user is authenticated first
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.log('❌ No active session, showing sign-in dialog');
        setShowSignInDialog(true);
        setLoading(false);
        return;
      }
      
      console.log('✅ User authenticated:', session.user.email);

      // Optimistic update
      const newIsFavorited = !isFavorited;
      setIsFavorited(newIsFavorited);
      setFavoriteCount((prev) => Math.max(0, newIsFavorited ? prev + 1 : prev - 1));

      // Try API with auth token
      try {
        let res;
        
        if (newIsFavorited) {
          // Add to favorites
          res = await fetch('/api/favorites', {
            method: "POST",
            credentials: "include",
            headers: { 
              "Content-Type": "application/json",
              "Authorization": `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ snippetId })
          });
        } else {
          // Remove from favorites
          res = await fetch(`/api/favorites?snippetId=${snippetId}`, {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Authorization": `Bearer ${session.access_token}`
            }
          });
        }

        if (res.ok) {
          if (newIsFavorited) {
            showSuccess({
              title: "Added to Favorites",
              description: "Snippet saved to your favorites list.",
              duration: 2500,
            });
          } else {
            showInfo({
              title: "Removed",
              description: "Snippet removed from favorites.",
              duration: 2000,
            });
          }
          
          // Update localStorage as backup
          const userFavorites = JSON.parse(localStorage.getItem("userFavorites") || "[]");
          if (newIsFavorited) {
            if (!userFavorites.includes(snippetId)) {
              userFavorites.push(snippetId);
            }
          } else {
            const index = userFavorites.indexOf(snippetId);
            if (index > -1) {
              userFavorites.splice(index, 1);
            }
          }
          localStorage.setItem("userFavorites", JSON.stringify(userFavorites));
        } else {
          // Check if it's an auth error
          if (res.status === 401) {
            console.log('⚠️ Token expired, attempting refresh...');
            // Try to refresh the session
            const { data: { session: newSession }, error: refreshError } = await supabase.auth.refreshSession();
            
            if (newSession) {
              console.log('✅ Session refreshed, retrying...');
              // Retry the operation
              setLoading(false);
              toggleFavorite();
              return;
            } else {
              console.log('❌ Session refresh failed');
              // Revert optimistic update
              setIsFavorited((prev) => !prev);
              setFavoriteCount((prev) => Math.max(0, newIsFavorited ? prev - 1 : prev + 1));
              // Show sign in dialog
              setShowSignInDialog(true);
              setLoading(false);
              return;
            }
          }
          throw new Error(`API request failed with status ${res.status}`);
        }
      } catch (apiError) {
        console.error('API error:', apiError);
        
        // Revert optimistic update
        setIsFavorited((prev) => !prev);
        setFavoriteCount((prev) => Math.max(0, newIsFavorited ? prev - 1 : prev + 1));
        
        showError({
          title: "Failed",
          description: "Could not update favorite. Please try again.",
        });
      }
    } catch (error) {
      console.error('Toggle favorite error:', error);
      showError({
        title: "Failed",
        description: "Could not update favorite. Please retry.",
      });
      // Reload actual server state
      loadFavoriteStatus();
    } finally {
      setLoading(false);
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-8 w-8";
      case "lg":
        return "h-12 w-12";
      default:
        return "h-10 w-10";
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-6 h-6";
      default:
        return "w-5 h-5";
    }
  };

  const buttonContent = (
    <Button
      variant={variant}
      size="icon"
      onClick={toggleFavorite}
      disabled={loading}
      className={cn(
        getSizeClasses(),
        "transition-all duration-200",
        isFavorited && "text-red-500 hover:text-red-600",
        className,
      )}
    >
      {loading ? (
        <Loader2 className={cn(getIconSize(), "animate-spin")} />
      ) : (
        <Heart
          className={cn(
            getIconSize(),
            "transition-all duration-200",
            isFavorited && "fill-current scale-110",
          )}
        />
      )}
    </Button>
  );

  return (
    <>
      <div className="flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>{buttonContent}</TooltipTrigger>
          <TooltipContent>
            <p>
              {loading
                ? "Updating..."
                : isFavorited
                  ? "Remove from favorites"
                  : "Add to favorites"}
            </p>
          </TooltipContent>
        </Tooltip>

        {showCount && favoriteCount > 0 && (
          <span className="text-sm text-muted-foreground">{favoriteCount}</span>
        )}
      </div>

      {/* Sign In Dialog */}
      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-md bg-white dark:bg-gray-900 backdrop-blur-none border-2 border-gray-200 dark:border-gray-700 shadow-2xl">
          <DialogHeader className="bg-white dark:bg-gray-900">
            <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Heart className="h-5 w-5 text-red-500" />
              Sign in to save favorites
            </DialogTitle>
            <DialogDescription className="pt-2 text-gray-600 dark:text-gray-400">
              Create an account or sign in to save your favorite snippets and access them across all your devices.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-3 py-4 bg-white dark:bg-gray-900">
            <div className="flex items-start gap-3 rounded-lg border-2 border-pink-200 dark:border-pink-800 bg-pink-50 dark:bg-pink-950/30 p-3">
              <div className="rounded-full bg-pink-500/20 dark:bg-pink-500/30 p-2">
                <Heart className="h-4 w-4 text-pink-600 dark:text-pink-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Save & Sync</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Your favorites will be saved and synced across all devices
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950/30 p-3">
              <div className="rounded-full bg-purple-500/20 dark:bg-purple-500/30 p-2">
                <UserPlus className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">Free Forever</h4>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  Create a free account in seconds - no credit card required
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col sm:flex-row gap-2 bg-white dark:bg-gray-900">
            <Button
              variant="outline"
              onClick={() => setShowSignInDialog(false)}
              className="w-full sm:w-auto border-2"
            >
              Maybe Later
            </Button>
            <Button
              onClick={() => {
                setShowSignInDialog(false);
                router.push('/login');
              }}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
