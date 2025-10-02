import type { Config } from "tailwindcss";

// Extended Tailwind config with mobile-first responsive design
export const mobileConfig: Partial<Config> = {
  theme: {
    extend: {
      // Mobile-optimized breakpoints
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
      
      // Mobile-optimized spacing scale
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        '0.5': '0.125rem', // 2px
        '1.5': '0.375rem', // 6px
        '2.5': '0.625rem', // 10px
        '3.5': '0.875rem', // 14px
        '4.5': '1.125rem', // 18px
        '5.5': '1.375rem', // 22px
        '6.5': '1.625rem', // 26px
        '7.5': '1.875rem', // 30px
        '8.5': '2.125rem', // 34px
        '9.5': '2.375rem', // 38px
        // Touch target sizes
        'touch-sm': '2.75rem', // 44px
        'touch': '3rem',      // 48px
        'touch-lg': '3.5rem', // 56px
        'touch-xl': '4rem',   // 64px
      },
      
      // Mobile-optimized typography
      fontSize: {
        // Mobile-first text scales
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
        'mobile-xs': ['0.6875rem', { lineHeight: '1rem', letterSpacing: '0.03em' }], // 11px
        'mobile-sm': ['0.8125rem', { lineHeight: '1.25rem', letterSpacing: '0.025em' }], // 13px
        'mobile-base': ['0.9375rem', { lineHeight: '1.5rem', letterSpacing: '0.02em' }], // 15px
        'mobile-lg': ['1.0625rem', { lineHeight: '1.625rem', letterSpacing: '0.015em' }], // 17px
        'mobile-xl': ['1.1875rem', { lineHeight: '1.75rem', letterSpacing: '0.01em' }], // 19px
        
        // Display sizes for mobile
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
        // Mobile-specific line heights
        'mobile-tight': '1.2',
        'mobile-normal': '1.4',
        'mobile-relaxed': '1.6',
        'mobile-loose': '1.8',
      },
      
      // Enhanced letter spacing for mobile readability
      letterSpacing: {
        'tightest': '-0.075em',
        'tighter': '-0.05em',
        'tight': '-0.025em',
        'normal': '0em',
        'wide': '0.025em',
        'wider': '0.05em',
        'widest': '0.1em',
        // Mobile-optimized spacing
        'mobile-tight': '-0.01em',
        'mobile-normal': '0.01em',
        'mobile-wide': '0.025em',
        'mobile-wider': '0.05em',
      },
      
      // Mobile-friendly border radius
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',   // 2px
        'DEFAULT': '0.25rem', // 4px
        'md': '0.375rem',   // 6px
        'lg': '0.5rem',     // 8px
        'xl': '0.75rem',    // 12px
        '2xl': '1rem',      // 16px
        '3xl': '1.5rem',    // 24px
        '4xl': '2rem',      // 32px
        'full': '9999px',
        // Mobile-specific radius
        'mobile-sm': '0.1875rem',  // 3px
        'mobile': '0.3125rem',     // 5px
        'mobile-lg': '0.625rem',   // 10px
        'mobile-xl': '0.875rem',   // 14px
        'mobile-2xl': '1.25rem',   // 20px
      },
      
      // Mobile touch targets and interaction sizes
      minHeight: {
        'touch': '3rem',      // 48px minimum touch target
        'touch-sm': '2.75rem', // 44px small touch target
        'touch-lg': '3.5rem',  // 56px large touch target
      },
      
      minWidth: {
        'touch': '3rem',
        'touch-sm': '2.75rem',
        'touch-lg': '3.5rem',
      },
      
      // Mobile-optimized shadows
      boxShadow: {
        // Soft shadows for mobile
        'mobile-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'mobile': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'mobile-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'mobile-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'mobile-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        // Floating shadows for FABs and cards
        'float': '0 8px 16px rgba(0, 0, 0, 0.15)',
        'float-lg': '0 12px 24px rgba(0, 0, 0, 0.15)',
      },
      
      // Animation and transition durations optimized for mobile
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
      
      // Mobile-specific animations
      animation: {
        // Bounce animations
        'bounce-soft': 'bounce-soft 1s infinite',
        'bounce-once': 'bounce-once 0.6s ease-out',
        // Slide animations
        'slide-up': 'slide-up 0.3s ease-out',
        'slide-down': 'slide-down 0.3s ease-out',
        'slide-left': 'slide-left 0.3s ease-out',
        'slide-right': 'slide-right 0.3s ease-out',
        // Fade animations
        'fade-in': 'fade-in 0.2s ease-out',
        'fade-out': 'fade-out 0.2s ease-out',
        // Scale animations
        'scale-in': 'scale-in 0.2s ease-out',
        'scale-out': 'scale-out 0.2s ease-out',
        // Mobile-specific
        'tap-scale': 'tap-scale 0.1s ease-out',
        'ripple': 'ripple 0.6s linear',
      },
      
      // Keyframes for animations
      keyframes: {
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
    },
  },
};