"use client";

import { cn } from "@/lib/utils";
import React, { 
  useEffect, 
  useRef, 
  useState, 
  useCallback,
  createContext,
  useContext,
  KeyboardEvent,
  FocusEvent
} from "react";

// Focus Management Context
interface FocusContextValue {
  focusedElement: HTMLElement | null;
  focusHistory: HTMLElement[];
  trapFocus: (container: HTMLElement) => () => void;
  restoreFocus: () => void;
  announceToScreenReader: (message: string, priority?: "polite" | "assertive") => void;
}

const FocusContext = createContext<FocusContextValue | null>(null);

export function FocusProvider({ children }: { children: React.ReactNode }) {
  const [focusedElement, setFocusedElement] = useState<HTMLElement | null>(null);
  const [focusHistory, setFocusHistory] = useState<HTMLElement[]>([]);
  const announcerRef = useRef<HTMLDivElement>(null);

  // Track focus changes
  useEffect(() => {
    const handleFocusChange = (e: FocusEvent) => {
      const target = e.target as HTMLElement;
      if (target && target !== focusedElement) {
        setFocusedElement(target);
        setFocusHistory(prev => [...prev.slice(-9), target]);
      }
    };

    document.addEventListener('focusin', handleFocusChange as any);
    return () => document.removeEventListener('focusin', handleFocusChange as any);
  }, [focusedElement]);

  const trapFocus = useCallback((container: HTMLElement) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    container.addEventListener('keydown', handleKeyDown as any);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleKeyDown as any);
    };
  }, []);

  const restoreFocus = useCallback(() => {
    const lastFocused = focusHistory[focusHistory.length - 2];
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus();
    }
  }, [focusHistory]);

  const announceToScreenReader = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    if (announcerRef.current) {
      announcerRef.current.setAttribute('aria-live', priority);
      announcerRef.current.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (announcerRef.current) {
          announcerRef.current.textContent = '';
        }
      }, 1000);
    }
  }, []);

  return (
    <FocusContext.Provider value={{
      focusedElement,
      focusHistory,
      trapFocus,
      restoreFocus,
      announceToScreenReader
    }}>
      {children}
      {/* Screen reader announcements */}
      <div
        ref={announcerRef}
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      />
    </FocusContext.Provider>
  );
}

export function useFocus() {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error('useFocus must be used within a FocusProvider');
  }
  return context;
}

// Accessible Button Component
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  loadingText?: string;
  announcePress?: boolean;
}

export function AccessibleButton({
  children,
  className,
  variant = "primary",
  size = "md",
  loading = false,
  loadingText = "Loading",
  announcePress = false,
  disabled,
  onClick,
  ...props
}: AccessibleButtonProps) {
  const { announceToScreenReader } = useFocus();
  const [isPressed, setIsPressed] = useState(false);

  const variantClasses = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary/50",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90 focus:ring-secondary/50",
    ghost: "hover:bg-muted hover:text-foreground focus:ring-muted/50",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:ring-destructive/50",
  };

  const sizeClasses = {
    sm: "h-touch-sm px-3 text-sm rounded-mobile-sm",
    md: "h-touch px-4 text-base rounded-mobile",
    lg: "h-touch-lg px-6 text-lg rounded-mobile-lg",
  };

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || loading) return;
    
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 150);
    
    if (announcePress) {
      announceToScreenReader("Button activated");
    }
    
    onClick?.(e);
  }, [disabled, loading, announcePress, announceToScreenReader, onClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick(e as any);
    }
  }, [handleClick]);

  return (
    <button
      className={cn(
        "relative font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2",
        "select-none touch-manipulation",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        isPressed && "scale-95",
        className
      )}
      disabled={disabled || loading}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-pressed={isPressed}
      aria-busy={loading}
      {...props}
    >
      <span className={cn("flex items-center justify-center", loading && "invisible")}>
        {children}
      </span>
      
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="sr-only">{loadingText}</span>
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        </span>
      )}
    </button>
  );
}

// Accessible Modal
interface AccessibleModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  description?: string;
  closeOnEscape?: boolean;
  closeOnBackdrop?: boolean;
  className?: string;
}

export function AccessibleModal({
  isOpen,
  onClose,
  children,
  title,
  description,
  closeOnEscape = true,
  closeOnBackdrop = true,
  className,
}: AccessibleModalProps) {
  const { trapFocus, restoreFocus, announceToScreenReader } = useFocus();
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = `modal-title-${React.useId()}`;
  const descriptionId = `modal-description-${React.useId()}`;

  // Focus management
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const cleanup = trapFocus(modalRef.current);
      announceToScreenReader(`Modal opened: ${title}`);
      
      return () => {
        cleanup();
        restoreFocus();
        announceToScreenReader("Modal closed");
      };
    }
  }, [isOpen, trapFocus, restoreFocus, announceToScreenReader, title]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown as any);
      return () => document.removeEventListener('keydown', handleKeyDown as any);
    }
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className={cn(
          "relative bg-background border rounded-mobile-lg shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto",
          "safe-area-left safe-area-right safe-area-bottom",
          className
        )}
        tabIndex={-1}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b">
          <div>
            <h2 id={titleId} className="text-lg font-semibold mobile-s:text-base">
              {title}
            </h2>
            {description && (
              <p id={descriptionId} className="text-sm text-muted-foreground mt-1 mobile-s:text-xs">
                {description}
              </p>
            )}
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-mobile hover:bg-muted transition-colors"
            aria-label="Close modal"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
}

// Skip Link Component
export function SkipLink({ href = "#main-content", children = "Skip to main content" }) {
  return (
    <a
      href={href}
      className={cn(
        "absolute left-0 top-0 z-50 p-4 bg-primary text-primary-foreground",
        "transform -translate-y-full focus:translate-y-0",
        "transition-transform duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      )}
    >
      {children}
    </a>
  );
}

// Screen Reader Only Text
export function ScreenReaderOnly({ children, className, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "absolute w-px h-px p-0 -m-px overflow-hidden clip-rect-0 whitespace-nowrap border-0",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

// Live Region for Announcements
interface LiveRegionProps {
  children: React.ReactNode;
  priority?: "polite" | "assertive";
  atomic?: boolean;
  className?: string;
}

export function LiveRegion({
  children,
  priority = "polite",
  atomic = true,
  className,
}: LiveRegionProps) {
  return (
    <div
      className={cn("sr-only", className)}
      aria-live={priority}
      aria-atomic={atomic}
      role="status"
    >
      {children}
    </div>
  );
}

// Focus Visible Hook
export function useFocusVisible() {
  const [isFocusVisible, setIsFocusVisible] = useState(false);
  const [hadKeyboardEvent, setHadKeyboardEvent] = useState(true);

  useEffect(() => {
    const handleKeyDown = () => setHadKeyboardEvent(true);
    const handlePointerDown = () => setHadKeyboardEvent(false);

    document.addEventListener('keydown', handleKeyDown, true);
    document.addEventListener('mousedown', handlePointerDown, true);
    document.addEventListener('pointerdown', handlePointerDown, true);

    return () => {
      document.removeEventListener('keydown', handleKeyDown, true);
      document.removeEventListener('mousedown', handlePointerDown, true);
      document.removeEventListener('pointerdown', handlePointerDown, true);
    };
  }, []);

  const handleFocus = useCallback(() => {
    setIsFocusVisible(hadKeyboardEvent);
  }, [hadKeyboardEvent]);

  const handleBlur = useCallback(() => {
    setIsFocusVisible(false);
  }, []);

  return {
    isFocusVisible,
    onFocus: handleFocus,
    onBlur: handleBlur,
  };
}

// Accessible Form Field
interface AccessibleFormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  description?: string;
  required?: boolean;
  className?: string;
}

export function AccessibleFormField({
  label,
  children,
  error,
  description,
  required,
  className,
}: AccessibleFormFieldProps) {
  const fieldId = React.useId();
  const errorId = `${fieldId}-error`;
  const descriptionId = `${fieldId}-description`;

  return (
    <div className={cn("space-y-2", className)}>
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-foreground mobile-s:text-xs"
      >
        {label}
        {required && (
          <span className="text-destructive ml-1" aria-label="required">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-muted-foreground mobile-s:text-xs">
          {description}
        </p>
      )}

      <div>
        {React.cloneElement(children as React.ReactElement, {
          id: fieldId,
          'aria-describedby': [
            description ? descriptionId : '',
            error ? errorId : ''
          ].filter(Boolean).join(' ') || undefined,
          'aria-invalid': error ? 'true' : undefined,
          'aria-required': required ? 'true' : undefined,
        })}
      </div>

      {error && (
        <p
          id={errorId}
          role="alert"
          className="text-sm text-destructive mobile-s:text-xs"
        >
          <ScreenReaderOnly>Error: </ScreenReaderOnly>
          {error}
        </p>
      )}
    </div>
  );
}

// High Contrast Mode Detection
export function useHighContrast() {
  const [isHighContrast, setIsHighContrast] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-contrast: high)');
    
    const handleChange = () => {
      setIsHighContrast(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return isHighContrast;
}

// Reduced Motion Detection
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    
    const handleChange = () => {
      setPrefersReducedMotion(mediaQuery.matches);
    };

    handleChange();
    mediaQuery.addEventListener('change', handleChange);

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
}