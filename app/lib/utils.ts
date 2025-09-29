import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Glassmorphism utility functions for consistent glass effects across components
export const glassmorphism = {
  // Light glass effect for dropdowns and overlays
  light: "bg-background/80 backdrop-blur-lg border-white/20 supports-[backdrop-filter]:bg-background/60",
  
  // Medium glass effect for cards and containers
  medium: "bg-background/70 backdrop-blur-md border-white/30 supports-[backdrop-filter]:bg-background/50",
  
  // Strong glass effect for modals and major overlays
  strong: "bg-background/60 backdrop-blur-xl border-white/40 supports-[backdrop-filter]:bg-background/40",
  
  // Trigger glass effect for form elements
  trigger: "bg-background/70 backdrop-blur-sm border-input/50 hover:bg-background/80 focus:bg-background/90",
  
  // Item hover glass effect for interactive elements
  hover: "hover:bg-accent/50 hover:backdrop-blur-sm focus:bg-accent/70"
}