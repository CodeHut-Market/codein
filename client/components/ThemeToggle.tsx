import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  useAnimationPreferences,
  useCompactMode,
  useTheme,
} from "@/contexts/ThemeContext";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Eye, Monitor, Moon, Palette, Settings, Sun, Zap } from "lucide-react";
import { useEffect, useState } from 'react';

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg";
  showLabel?: boolean;
}

export default function ThemeToggle({
  className,
  variant = "ghost",
  size = "default",
  showLabel = false,
}: ThemeToggleProps) {
  const {
    theme,
    actualTheme,
    isSystemDark,
    setTheme,
    setAccentColor,
    preferences,
    resetToDefaults,
  } = useTheme();
  const { reducedMotion, setReducedMotion } = useAnimationPreferences();
  const { isCompact, setCompactMode } = useCompactMode();

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return Sun;
      case "dark":
        return Moon;
      case "system":
        return Monitor;
    }
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return `System ${isSystemDark ? "(Dark)" : "(Light)"}`;
    }
  };

  const ThemeIcon = getThemeIcon();
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{ setMounted(true); },[]);

  const accentColors = [
    { name: "Green", value: "green", color: "bg-green-500" },
    { name: "Blue", value: "blue", color: "bg-blue-500" },
    { name: "Purple", value: "purple", color: "bg-purple-500" },
    { name: "Red", value: "red", color: "bg-red-500" },
    { name: "Orange", value: "orange", color: "bg-orange-500" },
    { name: "Pink", value: "pink", color: "bg-pink-500" },
    { name: "Teal", value: "teal", color: "bg-teal-500" },
    { name: "Indigo", value: "indigo", color: "bg-indigo-500" },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn("relative", showLabel && "gap-2", className)}
        >
          <AnimatePresence mode="wait">
            {mounted && (
              <motion.div
                key={theme}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{
                  duration: reducedMotion ? 0 : 0.3,
                  ease: "easeInOut",
                }}
              >
                <ThemeIcon className="h-4 w-4" />
              </motion.div>
            )}
            {!mounted && <ThemeIcon className="h-4 w-4" />}
          </AnimatePresence>
          {showLabel && (
            <span className="hidden sm:inline-block">{getThemeLabel()}</span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Settings className="h-4 w-4" />
          Theme Settings
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {/* Theme Selection */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Appearance
        </DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => setTheme("light")}
          className="flex items-center gap-2"
        >
          <Sun className="h-4 w-4" />
          <span>Light</span>
          {theme === "light" && (
            <Badge variant="secondary" className="ml-auto text-xs">
              Active
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("dark")}
          className="flex items-center gap-2"
        >
          <Moon className="h-4 w-4" />
          <span>Dark</span>
          {theme === "dark" && (
            <Badge variant="secondary" className="ml-auto text-xs">
              Active
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() => setTheme("system")}
          className="flex items-center gap-2"
        >
          <Monitor className="h-4 w-4" />
          <span>System</span>
          {theme === "system" && (
            <Badge variant="secondary" className="ml-auto text-xs">
              {isSystemDark ? "Dark" : "Light"}
            </Badge>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* Accent Color Selection */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="flex items-center gap-2">
            <Palette className="h-4 w-4" />
            <span>Accent Color</span>
            <div
              className={cn(
                "w-3 h-3 rounded-full ml-auto",
                accentColors.find((c) => c.value === preferences.accentColor)
                  ?.color || "bg-green-500",
              )}
            />
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-48">
            <div className="grid grid-cols-4 gap-2 p-2">
              {accentColors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setAccentColor(color.value)}
                  className={cn(
                    "w-8 h-8 rounded-full transition-all hover:scale-110",
                    color.color,
                    preferences.accentColor === color.value &&
                      "ring-2 ring-offset-2 ring-foreground",
                  )}
                  title={color.name}
                />
              ))}
            </div>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator />

        {/* Accessibility Options */}
        <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
          Accessibility
        </DropdownMenuLabel>

        <DropdownMenuCheckboxItem
          checked={reducedMotion}
          onCheckedChange={setReducedMotion}
          className="flex items-center gap-2"
        >
          <Zap className="h-4 w-4" />
          <span>Reduce Motion</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuCheckboxItem
          checked={isCompact}
          onCheckedChange={setCompactMode}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          <span>Compact Mode</span>
        </DropdownMenuCheckboxItem>

        <DropdownMenuSeparator />

        {/* Reset to Defaults */}
        <DropdownMenuItem
          onClick={resetToDefaults}
          className="text-destructive focus:text-destructive"
        >
          Reset to Defaults
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Simple theme toggle button (for basic use cases)
export function SimpleThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, actualTheme } = useTheme();
  const { reducedMotion } = useAnimationPreferences();

  const toggleTheme = () => {
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

  const getIcon = () => {
    switch (theme) {
      case "light":
        return Sun;
      case "dark":
        return Moon;
      case "system":
        return Monitor;
    }
  };

  const Icon = getIcon();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn("relative", className)}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={theme}
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{
            duration: reducedMotion ? 0 : 0.3,
            ease: "easeInOut",
          }}
        >
          <Icon className="h-4 w-4" />
        </motion.div>
      </AnimatePresence>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
