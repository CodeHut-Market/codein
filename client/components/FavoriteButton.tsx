import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNotifications } from "@/hooks/useNotifications";
import { cn } from "@/lib/utils";
import { Heart, Loader2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
  const { showSuccess, showError, showInfo } = useNotifications();

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
      // Optimistic update
      const newIsFavorited = !isFavorited;
      setIsFavorited(newIsFavorited);
      setFavoriteCount((prev) => Math.max(0, newIsFavorited ? prev + 1 : prev - 1));

      // Try API first
      try {
        const res = await fetch('/api/favorites', {
          method: newIsFavorited ? "POST" : "DELETE",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: newIsFavorited 
            ? JSON.stringify({ snippetId })
            : undefined
        });
        
        const url = new URL('/api/favorites', window.location.origin);
        if (!newIsFavorited) {
          url.searchParams.set('snippetId', snippetId);
        }

        const deleteRes = newIsFavorited ? res : await fetch(url.toString(), {
          method: "DELETE",
          credentials: "include",
        });

        if ((newIsFavorited ? res : deleteRes).ok) {
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
        } else {
          throw new Error("API request failed");
        }
      } catch (apiError) {
        // Fallback to localStorage for demo
        console.warn("API failed, using localStorage", apiError);
        
        const userFavorites = JSON.parse(localStorage.getItem("userFavorites") || "[]");
        
        if (newIsFavorited) {
          if (!userFavorites.includes(snippetId)) {
            userFavorites.push(snippetId);
          }
          showSuccess({
            title: "Added to Favorites",
            description: "Snippet saved to your favorites list.",
            duration: 2500,
          });
        } else {
          const index = userFavorites.indexOf(snippetId);
          if (index > -1) {
            userFavorites.splice(index, 1);
          }
          showInfo({
            title: "Removed",
            description: "Snippet removed from favorites.",
            duration: 2000,
          });
        }
        
        localStorage.setItem("userFavorites", JSON.stringify(userFavorites));
      }
    } catch (error) {
      // Revert optimistic update
      setIsFavorited((prev) => !prev);
      setFavoriteCount((prev) => prev); // rely on refresh
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
  );
}
