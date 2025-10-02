"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";

// Safe Area Provider Component
interface SafeAreaProviderProps {
  children: React.ReactNode;
  className?: string;
}

export function SafeAreaProvider({ children, className }: SafeAreaProviderProps) {
  return (
    <div 
      className={cn(
        "min-h-screen",
        "pt-safe-top pb-safe-bottom pl-safe-left pr-safe-right",
        className
      )}
      style={{
        paddingTop: "env(safe-area-inset-top)",
        paddingBottom: "env(safe-area-inset-bottom)",
        paddingLeft: "env(safe-area-inset-left)",
        paddingRight: "env(safe-area-inset-right)",
      }}
    >
      {children}
    </div>
  );
}

// Sticky Header Component
interface StickyHeaderProps {
  children: React.ReactNode;
  className?: string;
  blur?: boolean;
  shadow?: boolean;
  offset?: number;
}

export function StickyHeader({
  children,
  className,
  blur = true,
  shadow = true,
  offset = 0,
}: StickyHeaderProps) {
  const [isSticky, setIsSticky] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const scrollY = window.scrollY;
        setIsSticky(scrollY > offset);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [offset]);

  return (
    <motion.header
      ref={headerRef}
      className={cn(
        "sticky top-0 z-40 w-full transition-all duration-200",
        "safe-area-top",
        blur && "backdrop-blur-lg",
        isSticky && shadow && "shadow-mobile-md border-b",
        className
      )}
      animate={{
        backgroundColor: isSticky 
          ? "rgba(255, 255, 255, 0.95)" 
          : "rgba(255, 255, 255, 0)",
      }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.header>
  );
}

// Mobile Grid System
interface MobileGridProps {
  children: React.ReactNode;
  columns?: {
    mobile: number;
    tablet?: number;
    desktop?: number;
  };
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function MobileGrid({
  children,
  columns = { mobile: 1, tablet: 2, desktop: 3 },
  gap = "md",
  className,
}: MobileGridProps) {
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  const gridClasses = cn(
    "grid",
    gapClasses[gap],
    `grid-cols-${columns.mobile}`,
    columns.tablet && `tablet:grid-cols-${columns.tablet}`,
    columns.desktop && `lg:grid-cols-${columns.desktop}`,
    className
  );

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

// Responsive Container
interface ResponsiveContainerProps {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: "sm" | "md" | "lg";
  className?: string;
}

export function ResponsiveContainer({
  children,
  size = "lg",
  padding = "md",
  className,
}: ResponsiveContainerProps) {
  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-4xl",
    xl: "max-w-6xl",
    full: "max-w-full",
  };

  const paddingClasses = {
    sm: "px-4 mobile-s:px-3",
    md: "px-6 mobile-s:px-4",
    lg: "px-8 mobile-s:px-6",
  };

  return (
    <div
      className={cn(
        "mx-auto w-full",
        sizeClasses[size],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

// Mobile Stack Layout
interface MobileStackProps {
  children: React.ReactNode;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "stretch";
  className?: string;
}

export function MobileStack({
  children,
  spacing = "md",
  align = "stretch",
  className,
}: MobileStackProps) {
  const spacingClasses = {
    xs: "space-y-1",
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
    xl: "space-y-8",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };

  return (
    <div
      className={cn(
        "flex flex-col",
        spacingClasses[spacing],
        alignClasses[align],
        className
      )}
    >
      {children}
    </div>
  );
}

// Horizontal Stack Layout
interface HorizontalStackProps {
  children: React.ReactNode;
  spacing?: "xs" | "sm" | "md" | "lg" | "xl";
  align?: "start" | "center" | "end" | "baseline";
  justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
  wrap?: boolean;
  className?: string;
}

export function HorizontalStack({
  children,
  spacing = "md",
  align = "center",
  justify = "start",
  wrap = false,
  className,
}: HorizontalStackProps) {
  const spacingClasses = {
    xs: "space-x-1",
    sm: "space-x-2",
    md: "space-x-4",
    lg: "space-x-6",
    xl: "space-x-8",
  };

  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    baseline: "items-baseline",
  };

  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly",
  };

  return (
    <div
      className={cn(
        "flex",
        spacingClasses[spacing],
        alignClasses[align],
        justifyClasses[justify],
        wrap && "flex-wrap",
        className
      )}
    >
      {children}
    </div>
  );
}

// Mobile Section Component
interface MobileSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  spacing?: "sm" | "md" | "lg";
  className?: string;
}

export function MobileSection({
  children,
  title,
  subtitle,
  action,
  spacing = "md",
  className,
}: MobileSectionProps) {
  const spacingClasses = {
    sm: "py-4",
    md: "py-6",
    lg: "py-8",
  };

  return (
    <section className={cn(spacingClasses[spacing], className)}>
      {(title || subtitle || action) && (
        <div className="mb-6">
          <div className="flex items-start justify-between mb-2">
            {title && (
              <h2 className="text-xl font-semibold mobile-s:text-lg">
                {title}
              </h2>
            )}
            {action && action}
          </div>
          {subtitle && (
            <p className="text-muted-foreground mobile-s:text-sm">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}

// Mobile Divider
interface MobileDividerProps {
  variant?: "horizontal" | "vertical";
  spacing?: "sm" | "md" | "lg";
  className?: string;
  children?: React.ReactNode;
}

export function MobileDivider({
  variant = "horizontal",
  spacing = "md",
  className,
  children,
}: MobileDividerProps) {
  const spacingClasses = {
    sm: variant === "horizontal" ? "my-2" : "mx-2",
    md: variant === "horizontal" ? "my-4" : "mx-4",
    lg: variant === "horizontal" ? "my-6" : "mx-6",
  };

  if (children) {
    return (
      <div className={cn("flex items-center", spacingClasses[spacing], className)}>
        <div className="flex-1 border-t border-border" />
        <div className="px-3 text-sm text-muted-foreground bg-background">
          {children}
        </div>
        <div className="flex-1 border-t border-border" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "border-border",
        variant === "horizontal" 
          ? "border-t w-full" 
          : "border-l h-full",
        spacingClasses[spacing],
        className
      )}
    />
  );
}

// Mobile Layout with Header and Footer
interface MobileLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
}

export function MobileLayout({
  children,
  header,
  footer,
  className,
}: MobileLayoutProps) {
  return (
    <SafeAreaProvider>
      <div className={cn("min-h-screen flex flex-col", className)}>
        {header && (
          <StickyHeader>
            {header}
          </StickyHeader>
        )}
        
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
        
        {footer && (
          <footer className="mt-auto border-t bg-background/95 backdrop-blur-sm">
            {footer}
          </footer>
        )}
      </div>
    </SafeAreaProvider>
  );
}

// Viewport Height Hook and Component
export function useViewportHeight() {
  const [vh, setVh] = useState(0);

  useEffect(() => {
    const updateVh = () => {
      setVh(window.innerHeight * 0.01);
    };

    updateVh();
    window.addEventListener("resize", updateVh);
    window.addEventListener("orientationchange", updateVh);

    return () => {
      window.removeEventListener("resize", updateVh);
      window.removeEventListener("orientationchange", updateVh);
    };
  }, []);

  return vh;
}

// Full Height Component
interface FullHeightProps {
  children: React.ReactNode;
  className?: string;
  subtract?: number;
}

export function FullHeight({ children, className, subtract = 0 }: FullHeightProps) {
  const vh = useViewportHeight();

  return (
    <div
      className={cn("overflow-hidden", className)}
      style={{ 
        height: vh ? `${(vh * 100) - subtract}px` : `calc(100vh - ${subtract}px)` 
      }}
    >
      {children}
    </div>
  );
}