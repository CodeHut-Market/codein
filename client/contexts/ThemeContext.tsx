import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState
} from "react";

type Theme = "dark" | "light" | "system";

interface ThemePreferences {
  theme: Theme;
  accentColor: string;
  reducedMotion: boolean;
  compactMode: boolean;
}

interface ThemeProviderContext {
  theme: Theme;
  actualTheme: "dark" | "light"; // The actual applied theme (resolved from system if theme is 'system')
  preferences: ThemePreferences;
  setTheme: (theme: Theme) => void;
  setAccentColor: (color: string) => void;
  setReducedMotion: (enabled: boolean) => void;
  setCompactMode: (enabled: boolean) => void;
  resetToDefaults: () => void;
  isSystemDark: boolean;
}

const ThemeProviderContext = createContext<ThemeProviderContext | undefined>(
  undefined,
);

const defaultPreferences: ThemePreferences = {
  theme: "system",
  accentColor: "green",
  reducedMotion: false,
  compactMode: false,
};

const STORAGE_KEY = "codehut-theme-preferences";

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
}

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = STORAGE_KEY,
}: ThemeProviderProps) {
  const [preferences, setPreferences] = useState<ThemePreferences>(() => {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          return { ...defaultPreferences, ...parsed };
        }
      } catch (error) {
        console.warn("Failed to parse stored theme preferences:", error);
      }
    }
    return { ...defaultPreferences, theme: defaultTheme };
  });

  const [isSystemDark, setIsSystemDark] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }
    return false;
  });

  // Track mounted to avoid SSR hydration mismatches
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  // Listen for system theme changes (only after mount)
  useEffect(() => {
    if(!mounted) return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsSystemDark(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    setIsSystemDark(mediaQuery.matches);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted]);

  // Calculate the actual theme to apply
  const actualTheme: "dark" | "light" =
    preferences.theme === "system"
      ? isSystemDark
        ? "dark"
        : "light"
      : preferences.theme;

  // Apply theme to document
  useEffect(() => {
    if(!mounted) return; // skip until mounted so server markup matches
    const root = window.document.documentElement;

    // Remove existing theme classes
    root.classList.remove("light", "dark");

    // Add new theme class
    root.classList.add(actualTheme);

    // Apply custom properties
    if (preferences.accentColor !== "green") {
      root.style.setProperty(
        "--theme-accent",
        getAccentColorValue(preferences.accentColor),
      );
    } else {
      root.style.removeProperty("--theme-accent");
    }

    // Apply reduced motion preference
    if (preferences.reducedMotion) {
      root.style.setProperty("--animation-duration", "0s");
      root.style.setProperty("--transition-duration", "0s");
      root.classList.add("reduce-motion");
    } else {
      root.style.removeProperty("--animation-duration");
      root.style.removeProperty("--transition-duration");
      root.classList.remove("reduce-motion");
    }

    // Apply compact mode
    if (preferences.compactMode) {
      root.classList.add("compact-mode");
    } else {
      root.classList.remove("compact-mode");
    }

    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        "content",
        actualTheme === "dark" ? "#0f172a" : "#ffffff",
      );
    }
  }, [mounted, actualTheme, preferences]);

  // Save preferences to localStorage
  useEffect(() => {
    if(!mounted) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(preferences));
    } catch (error) {
      console.warn("Failed to save theme preferences:", error);
    }
  }, [mounted, preferences, storageKey]);

  // Listen for system reduced motion preference
  useEffect(() => {
    if(!mounted) return;
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches && !preferences.reducedMotion) {
        setPreferences((prev) => ({ ...prev, reducedMotion: true }));
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    // Apply initial state
    if (mediaQuery.matches && !preferences.reducedMotion) {
      setPreferences((prev) => ({ ...prev, reducedMotion: true }));
    }

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [mounted, preferences.reducedMotion]);

  const setTheme = (theme: Theme) => {
    setPreferences((prev) => ({ ...prev, theme }));
  };

  const setAccentColor = (accentColor: string) => {
    setPreferences((prev) => ({ ...prev, accentColor }));
  };

  const setReducedMotion = (reducedMotion: boolean) => {
    setPreferences((prev) => ({ ...prev, reducedMotion }));
  };

  const setCompactMode = (compactMode: boolean) => {
    setPreferences((prev) => ({ ...prev, compactMode }));
  };

  const resetToDefaults = () => {
    setPreferences(defaultPreferences);
  };

  const value: ThemeProviderContext = {
    theme: preferences.theme,
    actualTheme,
    preferences,
    setTheme,
    setAccentColor,
    setReducedMotion,
    setCompactMode,
    resetToDefaults,
    isSystemDark,
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

// Helper function to get accent color CSS values
function getAccentColorValue(color: string): string {
  const colorMap: Record<string, string> = {
    blue: "59 130 246",
    red: "239 68 68",
    yellow: "234 179 8",
    purple: "147 51 234",
    pink: "236 72 153",
    indigo: "99 102 241",
    green: "34 197 94", // Default
    emerald: "16 185 129",
    teal: "20 184 166",
    cyan: "6 182 212",
    sky: "14 165 233",
    violet: "139 92 246",
    fuchsia: "217 70 239",
    rose: "244 63 94",
    orange: "249 115 22",
    amber: "245 158 11",
    lime: "132 204 22",
    slate: "100 116 139",
    gray: "107 114 128",
    zinc: "113 113 122",
    neutral: "115 115 115",
    stone: "120 113 108",
  };

  return colorMap[color] || colorMap.green;
}

// Theme toggle hook with animation
export function useThemeToggle() {
  const { theme, setTheme, actualTheme } = useTheme();

  const toggleTheme = () => {
    // Cycle through: light -> dark -> system
    switch (theme) {
      case "light":
        setTheme("dark");
        break;
      case "dark":
        setTheme("system");
        break;
      case "system":
        setTheme("light");
        break;
    }
  };

  const setSpecificTheme = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return {
    theme,
    actualTheme,
    toggleTheme,
    setTheme: setSpecificTheme,
  };
}

// Animation preferences hook
export function useAnimationPreferences() {
  const { preferences, setReducedMotion } = useTheme();

  const shouldAnimate = !preferences.reducedMotion;
  const animationDuration = preferences.reducedMotion ? 0 : undefined;

  return {
    shouldAnimate,
    animationDuration,
    reducedMotion: preferences.reducedMotion,
    setReducedMotion,
  };
}

// Compact mode hook
export function useCompactMode() {
  const { preferences, setCompactMode } = useTheme();

  return {
    isCompact: preferences.compactMode,
    setCompactMode,
  };
}
