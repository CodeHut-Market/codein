"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

// Typography variant system optimized for mobile
const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl mobile-m:text-3xl mobile-s:text-2xl",
      h2: "scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0 mobile-m:text-2xl mobile-s:text-xl",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight mobile-m:text-xl mobile-s:text-lg",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight mobile-m:text-lg mobile-s:text-base",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight mobile-m:text-base mobile-s:text-sm",
      h6: "scroll-m-20 text-base font-semibold tracking-tight mobile-m:text-sm mobile-s:text-xs",
      p: "leading-7 mobile-m:text-mobile-base mobile-s:text-mobile-sm [&:not(:first-child)]:mt-4 mobile-s:[&:not(:first-child)]:mt-3",
      blockquote: "mt-6 border-l-2 pl-6 italic mobile-s:pl-4 mobile-s:mt-4",
      code: "relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm font-medium mobile-s:px-[0.25rem] mobile-s:py-[0.15rem] mobile-s:text-xs",
      lead: "text-xl text-muted-foreground mobile-m:text-lg mobile-s:text-base",
      large: "text-lg font-semibold mobile-m:text-base mobile-s:text-sm",
      small: "text-sm font-medium leading-none mobile-s:text-xs",
      muted: "text-sm text-muted-foreground mobile-s:text-xs",
      // Mobile-specific variants
      "display-lg": "text-display-lg font-bold tracking-tight mobile-m:text-display-md mobile-s:text-display-sm",
      "display-md": "text-display-md font-bold tracking-tight mobile-m:text-display-sm mobile-s:text-4xl",
      "display-sm": "text-display-sm font-bold tracking-tight mobile-m:text-3xl mobile-s:text-2xl",
      "mobile-title": "text-mobile-xl font-semibold leading-mobile-tight mobile-s:text-mobile-lg",
      "mobile-subtitle": "text-mobile-lg font-medium leading-mobile-normal mobile-s:text-mobile-base",
      "mobile-body": "text-mobile-base leading-mobile-relaxed mobile-s:text-mobile-sm",
      "mobile-caption": "text-mobile-sm text-muted-foreground leading-mobile-normal mobile-s:text-mobile-xs",
      "mobile-overline": "text-mobile-xs font-medium uppercase tracking-mobile-wide text-muted-foreground",
    },
    weight: {
      light: "font-light",
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
      extrabold: "font-extrabold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    spacing: {
      tight: "leading-mobile-tight",
      normal: "leading-mobile-normal",
      relaxed: "leading-mobile-relaxed",
      loose: "leading-mobile-loose",
    },
  },
  defaultVariants: {
    variant: "p",
    weight: "normal",
    align: "left",
    spacing: "normal",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  as?: keyof JSX.IntrinsicElements;
  children: React.ReactNode;
}

export function Typography({
  className,
  variant,
  weight,
  align,
  spacing,
  as,
  children,
  ...props
}: TypographyProps) {
  const Component = as || getDefaultComponent(variant);

  return (
    <Component
      className={cn(typographyVariants({ variant, weight, align, spacing }), className)}
      {...(props as any)}
    >
      {children}
    </Component>
  );
}

function getDefaultComponent(variant: string | null | undefined): keyof JSX.IntrinsicElements {
  switch (variant) {
    case "h1":
      return "h1";
    case "h2":
      return "h2";
    case "h3":
      return "h3";
    case "h4":
      return "h4";
    case "h5":
      return "h5";
    case "h6":
      return "h6";
    case "blockquote":
      return "blockquote";
    case "code":
      return "code";
    case "lead":
    case "large":
    case "p":
    case "mobile-body":
    default:
      return "p";
    case "small":
    case "muted":
    case "mobile-caption":
    case "mobile-overline":
      return "span";
    case "display-lg":
    case "display-md":
    case "display-sm":
    case "mobile-title":
    case "mobile-subtitle":
      return "h2";
  }
}

// Responsive Text Component
interface ResponsiveTextProps {
  size: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  weight?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export function ResponsiveText({
  size,
  weight,
  children,
  className,
  as = "p",
  ...props
}: ResponsiveTextProps) {
  const Component = as;
  
  const responsiveClasses = cn(
    // Mobile sizes
    size.mobile && `text-${size.mobile}`,
    weight?.mobile && `font-${weight.mobile}`,
    // Tablet sizes
    size.tablet && `tablet:text-${size.tablet}`,
    weight?.tablet && `tablet:font-${weight.tablet}`,
    // Desktop sizes
    size.desktop && `lg:text-${size.desktop}`,
    weight?.desktop && `lg:font-${weight.desktop}`,
    className
  );

  return (
    <Component className={responsiveClasses} {...(props as any)}>
      {children}
    </Component>
  );
}

// Mobile Optimized Heading Component
interface MobileHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
  responsive?: boolean;
}

export function MobileHeading({ level, children, className, responsive = true }: MobileHeadingProps) {
  const HeadingTag = `h${level}` as "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  
  const headingClasses = cn(
    "font-semibold tracking-tight leading-mobile-tight",
    {
      // Level 1 - Hero headings
      "text-3xl mobile-m:text-2xl mobile-s:text-xl lg:text-4xl xl:text-5xl": level === 1 && responsive,
      "text-4xl": level === 1 && !responsive,
      
      // Level 2 - Section headings
      "text-2xl mobile-m:text-xl mobile-s:text-lg lg:text-3xl": level === 2 && responsive,
      "text-3xl": level === 2 && !responsive,
      
      // Level 3 - Subsection headings
      "text-xl mobile-m:text-lg mobile-s:text-base lg:text-2xl": level === 3 && responsive,
      "text-2xl": level === 3 && !responsive,
      
      // Level 4 - Component headings
      "text-lg mobile-m:text-base mobile-s:text-sm lg:text-xl": level === 4 && responsive,
      "text-xl": level === 4 && !responsive,
      
      // Level 5 - Small headings
      "text-base mobile-m:text-sm mobile-s:text-xs lg:text-lg": level === 5 && responsive,
      "text-lg": level === 5 && !responsive,
      
      // Level 6 - Micro headings
      "text-sm mobile-m:text-xs mobile-s:text-xs lg:text-base": level === 6 && responsive,
      "text-base": level === 6 && !responsive,
    },
    className
  );

  return (
    <HeadingTag className={headingClasses}>
      {children}
    </HeadingTag>
  );
}
// Mobile-optimized paragraph component
interface MobileParagraphProps {
  size?: "xs" | "sm" | "base" | "lg";
  children: React.ReactNode;
  className?: string;
}

export function MobileParagraph({ size = "base", children, className }: MobileParagraphProps) {
  const paragraphClasses = cn(
    "leading-mobile-relaxed",
    {
      "text-mobile-xs mobile-m:text-xs lg:text-sm": size === "xs",
      "text-mobile-sm mobile-m:text-sm lg:text-base": size === "sm",
      "text-mobile-base mobile-m:text-base lg:text-lg": size === "base",
      "text-mobile-lg mobile-m:text-lg lg:text-xl": size === "lg",
    },
    className
  );

  return <p className={paragraphClasses}>{children}</p>;
}