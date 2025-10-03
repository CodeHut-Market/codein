import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Custom Loading Components Library
 * 
 * A collection of beautiful loading animations and spinners
 */

interface LoadingProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Simple spinner (uses Lucide icon)
 */
export function Spinner({ className, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <Loader2 className={cn("animate-spin", sizeClasses[size], className)} />
  );
}

/**
 * Dots loader - three bouncing dots
 */
export function DotsLoader({ className, size = "md" }: LoadingProps) {
  const dotSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
    xl: "w-6 h-6",
  };

  const gapSizes = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
    xl: "gap-4",
  };

  return (
    <div className={cn("flex items-center", gapSizes[size], className)}>
      <div
        className={cn(
          dotSizes[size],
          "rounded-full bg-current animate-bounce",
        )}
        style={{ animationDelay: "0ms" }}
      />
      <div
        className={cn(
          dotSizes[size],
          "rounded-full bg-current animate-bounce",
        )}
        style={{ animationDelay: "150ms" }}
      />
      <div
        className={cn(
          dotSizes[size],
          "rounded-full bg-current animate-bounce",
        )}
        style={{ animationDelay: "300ms" }}
      />
    </div>
  );
}

/**
 * Pulse loader - expanding circle
 */
export function PulseLoader({ className, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full bg-current opacity-75 animate-ping" />
      <div className="absolute inset-0 rounded-full bg-current opacity-75" />
    </div>
  );
}

/**
 * Progress bar loader
 */
export function BarLoader({ className }: { className?: string }) {
  return (
    <div className={cn("w-full h-1 bg-gray-200 rounded-full overflow-hidden", className)}>
      <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-[loading_1.5s_ease-in-out_infinite]" />
    </div>
  );
}

/**
 * Ring loader - rotating circle
 */
export function RingLoader({ className, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8 border-2",
    md: "w-12 h-12 border-4",
    lg: "w-16 h-16 border-4",
    xl: "w-24 h-24 border-8",
  };

  return (
    <div
      className={cn(
        "rounded-full border-gray-200 border-t-blue-600 animate-spin",
        sizeClasses[size],
        className,
      )}
    />
  );
}

/**
 * Dual ring loader - two rotating rings
 */
export function DualRingLoader({ className, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div className={cn("relative", sizeClasses[size], className)}>
      <div className="absolute inset-0 rounded-full border-4 border-gray-200 border-t-blue-600 animate-spin" />
      <div
        className="absolute inset-2 rounded-full border-4 border-gray-200 border-t-purple-600 animate-spin"
        style={{ animationDirection: "reverse", animationDuration: "0.75s" }}
      />
    </div>
  );
}

/**
 * Grid loader - pulsing squares
 */
export function GridLoader({ className, size = "md" }: LoadingProps) {
  const gridSizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
    xl: "w-6 h-6",
  };

  const containerSizes = {
    sm: "gap-1",
    md: "gap-2",
    lg: "gap-3",
    xl: "gap-4",
  };

  return (
    <div className={cn("grid grid-cols-3", containerSizes[size], className)}>
      {[0, 150, 300, 100, 250, 400, 200, 350, 500].map((delay, i) => (
        <div
          key={i}
          className={cn(gridSizes[size], "rounded bg-current animate-pulse")}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

/**
 * Gradient spinner - colorful rotating circle
 */
export function GradientSpinner({ className, size = "md" }: LoadingProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-24 h-24",
  };

  return (
    <div
      className={cn(
        "rounded-full animate-spin",
        "bg-gradient-to-tr from-blue-500 via-purple-500 to-pink-500",
        sizeClasses[size],
        className,
      )}
      style={{
        WebkitMaskImage: "linear-gradient(transparent 50%, black 50%)",
        maskImage: "linear-gradient(transparent 50%, black 50%)",
      }}
    />
  );
}

/**
 * Wave loader - animated wave
 */
export function WaveLoader({ className, size = "md" }: LoadingProps) {
  const barHeights = {
    sm: "h-4",
    md: "h-6",
    lg: "h-8",
    xl: "h-12",
  };

  const barWidths = {
    sm: "w-1",
    md: "w-1.5",
    lg: "w-2",
    xl: "w-3",
  };

  return (
    <div className={cn("flex items-end gap-1", className)}>
      {[0, 100, 200, 300, 400].map((delay, i) => (
        <div
          key={i}
          className={cn(
            barWidths[size],
            barHeights[size],
            "bg-current rounded-full animate-wave",
          )}
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  );
}

/**
 * Full-screen loading overlay
 */
export function LoadingOverlay({
  message,
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-black/50 backdrop-blur-sm",
        className,
      )}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 flex flex-col items-center gap-4">
        <RingLoader size="xl" className="text-blue-600" />
        {message && (
          <p className="text-gray-700 dark:text-gray-300 font-medium text-lg">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

/**
 * Inline loading with text
 */
export function LoadingText({
  text = "Loading...",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Spinner size="sm" className="text-blue-600" />
      <span className="text-gray-700 dark:text-gray-300">{text}</span>
    </div>
  );
}

/**
 * Card skeleton loader
 */
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "border border-gray-200 dark:border-gray-700 rounded-xl p-6",
        "bg-white dark:bg-gray-800 shadow-sm",
        className,
      )}
    >
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
        </div>
      </div>
    </div>
  );
}

// Add custom animations to globals.css or tailwind config
/*
@keyframes loading {
  0%, 100% { transform: translateX(-100%); }
  50% { transform: translateX(100%); }
}

@keyframes wave {
  0%, 100% { height: 25%; }
  50% { height: 100%; }
}
*/
