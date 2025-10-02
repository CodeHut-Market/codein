import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: [
    "./client/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./shared/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./next components/**/*.{ts,tsx}"
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      // Mobile-specific breakpoints
      'mobile-s': '320px',
      'mobile-m': '375px',
      'mobile-l': '425px',
      'tablet': '768px',
      // Safe area support
      'safe': { 'raw': '(display-mode: standalone)' },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        // Custom accent colors from CSS variables
        "success": {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        "warning": {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        "info": {
          DEFAULT: "hsl(var(--info))",
          foreground: "hsl(var(--info-foreground))",
        },
        // New vibrant accent colors
        "emerald-vivid": {
          DEFAULT: "hsl(var(--emerald-vivid))",
          foreground: "hsl(var(--emerald-vivid-foreground))",
        },
        "violet-vivid": {
          DEFAULT: "hsl(var(--violet-vivid))",
          foreground: "hsl(var(--violet-vivid-foreground))",
        },
        "amber-vivid": {
          DEFAULT: "hsl(var(--amber-vivid))",
          foreground: "hsl(var(--amber-vivid-foreground))",
        },
        "rose-vivid": {
          DEFAULT: "hsl(var(--rose-vivid))",
          foreground: "hsl(var(--rose-vivid-foreground))",
        },
        "cyan-vivid": {
          DEFAULT: "hsl(var(--cyan-vivid))",
          foreground: "hsl(var(--cyan-vivid-foreground))",
        },
        "indigo-vivid": {
          DEFAULT: "hsl(var(--indigo-vivid))",
          foreground: "hsl(var(--indigo-vivid-foreground))",
        },
        "orange-vivid": {
          DEFAULT: "hsl(var(--orange-vivid))",
          foreground: "hsl(var(--orange-vivid-foreground))",
        },
        "teal-vivid": {
          DEFAULT: "hsl(var(--teal-vivid))",
          foreground: "hsl(var(--teal-vivid-foreground))",
        },
        // Enhanced color palette for better visual appeal
        "blue-light": {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
        },
        // Subtle accent colors for modern UI
        "emerald": {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        "violet": {
          50: "#f5f3ff",
          100: "#ede9fe",
          200: "#ddd6fe",
          300: "#c4b5fd",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
          700: "#6d28d9",
          800: "#5b21b6",
          900: "#4c1d95",
        },
        "amber": {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        "rose": {
          50: "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
        "cyan": {
          50: "#ecfeff",
          100: "#cffafe",
          200: "#a5f3fc",
          300: "#67e8f9",
          400: "#22d3ee",
          500: "#06b6d4",
          600: "#0891b2",
          700: "#0e7490",
          800: "#155e75",
          900: "#164e63",
        },
        // Brand-specific accent colors
        "code": {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
        },

      },
      // Mobile-optimized spacing scale
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        '0.5': '0.125rem',
        '1.5': '0.375rem',
        '2.5': '0.625rem',
        '3.5': '0.875rem',
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '9.5': '2.375rem',
        // Touch target sizes
        'touch-sm': '2.75rem',
        'touch': '3rem',
        'touch-lg': '3.5rem',
        'touch-xl': '4rem',
      },
      // Mobile-optimized typography
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '0.025em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '0.0125em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '0.0125em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '0.0125em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '0.0125em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '0.0125em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '0.0125em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '0.0125em' }],
        // Mobile-specific sizes
        'mobile-xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.03em' }],
        'mobile-sm': ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }],
        'mobile-base': ['0.9375rem', { lineHeight: '1.5rem', letterSpacing: '0.02em' }],
        'mobile-lg': ['1.0625rem', { lineHeight: '1.625rem', letterSpacing: '0.015em' }],
        'mobile-xl': ['1.1875rem', { lineHeight: '1.75rem', letterSpacing: '0.01em' }],
        // Display sizes
        'display-sm': ['2rem', { lineHeight: '2.25rem', letterSpacing: '-0.025em' }],
        'display-md': ['2.5rem', { lineHeight: '2.75rem', letterSpacing: '-0.025em' }],
        'display-lg': ['3rem', { lineHeight: '3.25rem', letterSpacing: '-0.025em' }],
        'display-xl': ['3.5rem', { lineHeight: '3.75rem', letterSpacing: '-0.025em' }],
      },
      // Mobile-optimized line heights
      lineHeight: {
        '3': '0.75rem',
        '4': '1rem',
        '5': '1.25rem',
        '6': '1.5rem',
        '7': '1.75rem',
        '8': '2rem',
        '9': '2.25rem',
        '10': '2.5rem',
        'mobile-tight': '1.2',
        'mobile-normal': '1.4',
        'mobile-relaxed': '1.6',
        'mobile-loose': '1.8',
      },
      // Enhanced letter spacing
      letterSpacing: {
        'tightest': '-0.075em',
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
        'mobile-tight': '-0.01em',
        'mobile-normal': '0.01em',
        'mobile-wide': '0.025em',
        'mobile-wider': '0.05em',
      },
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        'DEFAULT': '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        'full': '9999px',
        // Mobile-specific radius
        'mobile-sm': '0.1875rem',
        'mobile': '0.3125rem',
        'mobile-lg': '0.625rem',
        'mobile-xl': '0.875rem',
        'mobile-2xl': '1.25rem',
      },
      // Mobile touch targets
      minHeight: {
        'touch': '3rem',
        'touch-sm': '2.75rem',
        'touch-lg': '3.5rem',
      },
      minWidth: {
        'touch': '3rem',
        'touch-sm': '2.75rem',
        'touch-lg': '3.5rem',
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        // Mobile-optimized shadows
        'mobile-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'mobile': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'mobile-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'mobile-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'mobile-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        'float': '0 8px 16px rgba(0, 0, 0, 0.15)',
        'float-lg': '0 12px 24px rgba(0, 0, 0, 0.15)',
      },
      // Animation durations
      transitionDuration: {
        '50': '50ms',
        '100': '100ms',
        '200': '200ms',
        '250': '250ms',
        '400': '400ms',
        '600': '600ms',
        '800': '800ms',
        '1200': '1200ms',
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        // Mobile keyframes
        'bounce-soft': {
          '0%, 100%': { transform: 'translateY(-5%)' },
          '50%': { transform: 'translateY(0)' },
        },
        'bounce-once': {
          '0%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-100%)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-left': {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'slide-right': {
          '0%': { transform: 'translateX(-100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-out': {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'scale-out': {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(0.95)', opacity: '0' },
        },
        'tap-scale': {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        'ripple': {
          '0%': { transform: 'scale(0)', opacity: '1' },
          '100%': { transform: 'scale(4)', opacity: '0' },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        // Mobile animations
        'bounce-soft': 'bounce-soft 1s infinite',
        'bounce-once': 'bounce-once 0.6s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-left': 'slide-left 0.3s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-out',
        'tap-scale': 'tap-scale 0.1s ease-out',
        'ripple': 'ripple 0.6s linear',
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
