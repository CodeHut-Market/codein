// Utility functions for purchase verification

export interface PurchaseStatus {
  hasPurchased: boolean;
  isLoading: boolean;
  error?: string;
}

const STORAGE_PREFIX = "purchasedSnippets";

// Local fallback storage helpers (used for demo mode or immediate unlock UX)
export const markSnippetAsPurchased = (snippetId: string, userId: string) => {
  try {
    const key = `${STORAGE_PREFIX}:${userId}`;
    const raw = localStorage.getItem(key);
    const set = new Set<string>(raw ? JSON.parse(raw) : []);
    set.add(snippetId);
    localStorage.setItem(key, JSON.stringify(Array.from(set)));
  } catch (e) {
    console.warn("Failed to persist local purchase record", e);
  }
};

export const hasLocallyPurchased = (snippetId: string, userId: string) => {
  try {
    const key = `${STORAGE_PREFIX}:${userId}`;
    const raw = localStorage.getItem(key);
    if (!raw) return false;
    const arr: string[] = JSON.parse(raw);
    return arr.includes(snippetId);
  } catch {
    return false;
  }
};

// Check if user has purchased a specific snippet
export const checkPurchaseStatus = async (
  snippetId: string,
  userId: string,
): Promise<boolean> => {
  // Don't check if no user ID
  if (!userId) {
    return false;
  }

  // Immediate local check to unlock right after payment
  if (hasLocallyPurchased(snippetId, userId)) {
    return true;
  }

  try {
    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `/api/purchases/check/${encodeURIComponent(userId)}/${encodeURIComponent(snippetId)}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        signal: controller.signal,
      },
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.warn(`Purchase check failed with status: ${response.status}`);
      // Fall back to local record if available
      return hasLocallyPurchased(snippetId, userId);
    }

    const data = await response.json();
    return data.hasPurchased || hasLocallyPurchased(snippetId, userId);
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "AbortError") {
        console.warn("Purchase check timed out");
      } else if (error.message.includes("Failed to fetch")) {
        console.warn(
          "Network error checking purchase status - defaulting to local record",
        );
      } else {
        console.error("Error checking purchase status:", error.message);
      }
    } else {
      console.error("Unknown error checking purchase status:", error);
    }
    // Fall back to local record on error
    return hasLocallyPurchased(snippetId, userId);
  }
};

// Get current user ID from localStorage or session
export const getCurrentUserId = (): string | null => {
  try {
    const userData = localStorage.getItem("user");
    if (userData) {
      const user = JSON.parse(userData);
      return user.id;
    }
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
};

// Check if snippet should be accessible (free or purchased)
export const isSnippetAccessible = async (
  snippet: { id: string; price: number },
  userId: string | null,
): Promise<boolean> => {
  try {
    // Free snippets are always accessible
    if (snippet.price === 0) {
      return true;
    }

    // If no user is logged in, not accessible
    if (!userId) {
      return false;
    }

    // For paid snippets, check purchase status with fallback
    try {
      return await checkPurchaseStatus(snippet.id, userId);
    } catch (error) {
      console.warn(
        "Purchase check failed, defaulting to no access for paid snippet",
      );
      return false;
    }
  } catch (error) {
    console.error("Error checking snippet accessibility:", error);
    // For paid snippets, default to not accessible if there's an error
    return snippet.price === 0;
  }
};
