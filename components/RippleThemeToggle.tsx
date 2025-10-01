"use client";

import { cn } from "@/lib/utils";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState } from "react";

interface RippleEffect {
  x: number;
  y: number;
  key: number;
}

interface RippleThemeToggleProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function RippleThemeToggle({
  className,
  size = "md",
}: RippleThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [ripples, setRipples] = useState<RippleEffect[]>([]);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const rippleKeyRef = useRef(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  const iconSizes = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;
    const rect = button.getBoundingClientRect();
    
    // Calculate the position relative to the button
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const newRipple: RippleEffect = {
      x,
      y,
      key: rippleKeyRef.current++,
    };

    setRipples((prev) => [...prev, newRipple]);

    // Remove ripple after animation completes
    setTimeout(() => {
      setRipples((prev) => prev.filter((ripple) => ripple.key !== newRipple.key));
    }, 1200); // Match the animation duration
  };

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>) => {
    createRipple(event);
    
    // Add a slight delay to make the ripple more noticeable before theme change
    setTimeout(() => {
      switch (theme) {
        case "light":
          setTheme("dark");
          break;
        case "dark":
          setTheme("system");
          break;
        case "system":
        default:
          setTheme("light");
          break;
      }
    }, 150);
  };

  const getIcon = () => {
    if (!mounted) return Sun;
    
    switch (theme) {
      case "light":
        return Sun;
      case "dark":
        return Moon;
      case "system":
        return Monitor;
      default:
        return Sun;
    }
  };

  const getThemeLabel = () => {
    if (!mounted) return "Light";
    
    switch (theme) {
      case "light":
        return "Light";
      case "dark":
        return "Dark";
      case "system":
        return "System";
      default:
        return "Light";
    }
  };

  const Icon = getIcon();

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn(
        // Base styles
        "relative overflow-hidden rounded-full",
        "bg-background border-2 border-border",
        "hover:bg-accent hover:text-accent-foreground hover:border-primary/50",
        "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        "transition-all duration-200 ease-out",
        "active:scale-95 group",
        // Theme-specific styles
        "dark:border-gray-700 dark:hover:bg-gray-800",
        // Size classes
        sizeClasses[size],
        className
      )}
      title={`Switch to ${theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light'} theme`}
      aria-label={`Current theme: ${getThemeLabel()}. Click to cycle themes.`}
    >
      {/* Icon with smooth transition */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <Icon
          className={cn(
            iconSizes[size],
            "transition-all duration-300 ease-out",
            // Icon-specific animations - only apply after mounting to prevent hydration mismatch
            mounted && theme === "light" && "text-amber-500 drop-shadow-sm",
            mounted && theme === "dark" && "text-blue-300 drop-shadow-sm", 
            mounted && theme === "system" && "text-gray-600 dark:text-gray-400"
          )}
        />
      </div>

      {/* Ripple effects container */}
      <div className="absolute inset-0 pointer-events-none">
        {ripples.map((ripple) => (
          <div
            key={ripple.key}
            className="absolute rounded-full"
            style={{
              left: ripple.x,
              top: ripple.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Main ripple effect */}
            <div
              className={cn(
                "absolute rounded-full",
                "bg-primary/20 dark:bg-primary/30",
                "animate-ripple"
              )}
              style={{
                width: 0,
                height: 0,
                animation: `ripple-expand 1.2s ease-out forwards`,
              }}
            />
            
            {/* Secondary ripple for more depth */}
            <div
              className={cn(
                "absolute rounded-full",
                "bg-primary/10 dark:bg-primary/20",
                "animate-ripple"
              )}
              style={{
                width: 0,
                height: 0,
                animation: `ripple-expand 1.4s ease-out 0.1s forwards`,
              }}
            />

            {/* Tertiary ripple for extra visual appeal */}
            <div
              className={cn(
                "absolute rounded-full",
                "bg-primary/5 dark:bg-primary/15",
                "animate-ripple"
              )}
              style={{
                width: 0,
                height: 0,
                animation: `ripple-expand 1.6s ease-out 0.2s forwards`,
              }}
            />
          </div>
        ))}
      </div>

      {/* Subtle background glow effect */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full opacity-0 transition-opacity duration-500",
          "bg-gradient-to-br from-primary/10 via-transparent to-primary/5",
          "group-hover:opacity-100"
        )}
      />

      {/* Animated border glow on hover */}
      <div 
        className={cn(
          "absolute inset-0 rounded-full opacity-0 transition-opacity duration-300",
          "border-2 border-primary/30",
          "group-hover:opacity-60 group-hover:animate-pulse"
        )}
      />
    </button>
  );
}

// Note: The ripple animation is defined in globals.css
// Add these styles to your globals.css:
/*
  @keyframes ripple-expand {
    0% {
      width: 0;
      height: 0;
      opacity: 0.8;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      width: 200px;
      height: 200px;
      opacity: 0;
    }
  }
  
  .animate-ripple {
    animation-fill-mode: forwards;
  }
*/