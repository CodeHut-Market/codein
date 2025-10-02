"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import { X, Info, AlertCircle, CheckCircle, XCircle } from "lucide-react";
import React, { useState, useEffect, useCallback, useRef } from "react";

// Loading Skeleton Components
interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  animation?: "pulse" | "wave" | "none";
}

export function Skeleton({
  className,
  variant = "rectangular",
  animation = "pulse",
}: SkeletonProps) {
  const variantClasses = {
    text: "h-4 w-full",
    circular: "rounded-full",
    rectangular: "rounded-none",
    rounded: "rounded-mobile",
  };

  const animationClasses = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  return (
    <div
      className={cn(
        "bg-muted",
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
    />
  );
}

// Card Skeleton
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-4 rounded-mobile-lg border bg-card", className)}>
      <div className="space-y-3">
        <Skeleton variant="circular" className="w-10 h-10" />
        <div className="space-y-2">
          <Skeleton variant="text" className="h-4 w-3/4" />
          <Skeleton variant="text" className="h-4 w-1/2" />
        </div>
        <Skeleton variant="rectangular" className="h-32 w-full rounded-mobile" />
      </div>
    </div>
  );
}

// List Item Skeleton
export function ListItemSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center space-x-3 p-4", className)}>
      <Skeleton variant="circular" className="w-12 h-12" />
      <div className="flex-1 space-y-2">
        <Skeleton variant="text" className="h-4 w-3/4" />
        <Skeleton variant="text" className="h-3 w-1/2" />
      </div>
    </div>
  );
}

// Progressive Disclosure Component
interface ProgressiveDisclosureProps {
  children: React.ReactNode;
  preview: React.ReactNode;
  expanded?: boolean;
  onToggle?: (expanded: boolean) => void;
  className?: string;
  previewClassName?: string;
  contentClassName?: string;
}

export function ProgressiveDisclosure({
  children,
  preview,
  expanded: controlledExpanded,
  onToggle,
  className,
  previewClassName,
  contentClassName,
}: ProgressiveDisclosureProps) {
  const [internalExpanded, setInternalExpanded] = useState(false);
  const expanded = controlledExpanded ?? internalExpanded;

  const handleToggle = useCallback(() => {
    const newExpanded = !expanded;
    if (onToggle) {
      onToggle(newExpanded);
    } else {
      setInternalExpanded(newExpanded);
    }
  }, [expanded, onToggle]);

  return (
    <div className={cn("space-y-3", className)}>
      <div
        className={cn(
          "cursor-pointer select-none",
          previewClassName
        )}
        onClick={handleToggle}
      >
        {preview}
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className={cn("overflow-hidden", contentClassName)}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile-Friendly Modal
interface MobileModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "full";
  position?: "center" | "bottom";
  className?: string;
}

export function MobileModal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
  position = "center",
  className,
}: MobileModalProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsAnimating(true);
    } else {
      document.body.style.overflow = "";
      setIsAnimating(false);
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg", 
    full: "max-w-full min-h-screen mobile-s:min-h-screen",
  };

  const positionVariants = {
    center: {
      initial: { scale: 0.9, opacity: 0, y: 20 },
      animate: { scale: 1, opacity: 1, y: 0 },
      exit: { scale: 0.9, opacity: 0, y: 20 },
    },
    bottom: {
      initial: { y: "100%", opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: "100%", opacity: 0 },
    },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            variants={positionVariants[position]}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "fixed z-50 bg-background border shadow-2xl",
              position === "center" && "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-mobile-lg max-h-[90vh] overflow-y-auto",
              position === "bottom" && "bottom-0 left-0 right-0 rounded-t-mobile-lg max-h-[90vh] overflow-y-auto safe-area-bottom",
              sizeClasses[size],
              className
            )}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b">
                <h2 className="text-lg font-semibold mobile-s:text-base">
                  {title}
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className={title ? "p-6" : "p-6"}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Toast Notification System
interface Toast {
  id: string;
  type: "success" | "error" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface ToastProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

function ToastComponent({ toast, onRemove }: ToastProps) {
  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "text-green-600 bg-green-50 border-green-200",
    error: "text-red-600 bg-red-50 border-red-200",
    warning: "text-orange-600 bg-orange-50 border-orange-200",
    info: "text-blue-600 bg-blue-50 border-blue-200",
  };

  const Icon = icons[toast.type];

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        onRemove(toast.id);
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, [toast.id, toast.duration, onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.95 }}
      className={cn(
        "flex items-start space-x-3 p-4 rounded-mobile-lg border shadow-mobile-lg backdrop-blur-sm",
        "mobile-s:p-3",
        colors[toast.type]
      )}
    >
      <Icon className="w-5 h-5 mt-0.5 flex-shrink-0 mobile-s:w-4 mobile-s:h-4" />
      
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm mobile-s:text-xs">
          {toast.title}
        </p>
        {toast.message && (
          <p className="text-sm opacity-90 mt-1 mobile-s:text-xs">
            {toast.message}
          </p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        {toast.action && (
          <button
            onClick={toast.action.onClick}
            className="text-sm font-medium underline hover:no-underline mobile-s:text-xs"
          >
            {toast.action.label}
          </button>
        )}
        
        <button
          onClick={() => onRemove(toast.id)}
          className="p-1 rounded-mobile hover:bg-black/10 transition-colors"
        >
          <X className="w-4 h-4 mobile-s:w-3 mobile-s:h-3" />
        </button>
      </div>
    </motion.div>
  );
}

// Toast Provider Hook
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };
}

// Toast Container Component
interface ToastContainerProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
  position?: "top" | "bottom";
  className?: string;
}

export function ToastContainer({
  toasts,
  onRemove,
  position = "top",
  className,
}: ToastContainerProps) {
  const positionClasses = {
    top: "top-4 safe-area-top",
    bottom: "bottom-4 safe-area-bottom",
  };

  return (
    <div
      className={cn(
        "fixed left-4 right-4 z-50 space-y-3 pointer-events-none",
        positionClasses[position],
        className
      )}
    >
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastComponent toast={toast} onRemove={onRemove} />
          </div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// Contextual Help Component
interface ContextualHelpProps {
  children: React.ReactNode;
  content: React.ReactNode;
  trigger?: "hover" | "click" | "focus";
  placement?: "top" | "bottom" | "left" | "right";
  className?: string;
}

export function ContextualHelp({
  children,
  content,
  trigger = "click",
  placement = "top",
  className,
}: ContextualHelpProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !contentRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.getBoundingClientRect();
    const viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    let x = 0;
    let y = 0;

    switch (placement) {
      case "top":
        x = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
        y = triggerRect.top - contentRect.height - 8;
        break;
      case "bottom":
        x = triggerRect.left + (triggerRect.width / 2) - (contentRect.width / 2);
        y = triggerRect.bottom + 8;
        break;
      case "left":
        x = triggerRect.left - contentRect.width - 8;
        y = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2);
        break;
      case "right":
        x = triggerRect.right + 8;
        y = triggerRect.top + (triggerRect.height / 2) - (contentRect.height / 2);
        break;
    }

    // Keep within viewport
    x = Math.max(8, Math.min(x, viewport.width - contentRect.width - 8));
    y = Math.max(8, Math.min(y, viewport.height - contentRect.height - 8));

    setPosition({ x, y });
  }, [placement]);

  const show = useCallback(() => {
    setIsVisible(true);
    setTimeout(updatePosition, 0);
  }, [updatePosition]);

  const hide = useCallback(() => {
    setIsVisible(false);
  }, []);

  const handleTrigger = useCallback(() => {
    if (trigger === "click") {
      if (isVisible) {
        hide();
      } else {
        show();
      }
    }
  }, [trigger, isVisible, show, hide]);

  useEffect(() => {
    if (isVisible) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          contentRef.current &&
          !contentRef.current.contains(event.target as Node) &&
          triggerRef.current &&
          !triggerRef.current.contains(event.target as Node)
        ) {
          hide();
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isVisible, hide]);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={trigger === "hover" ? show : undefined}
        onMouseLeave={trigger === "hover" ? hide : undefined}
        onFocus={trigger === "focus" ? show : undefined}
        onBlur={trigger === "focus" ? hide : undefined}
        onClick={handleTrigger}
        className={className}
      >
        {children}
      </div>

      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={contentRef}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 bg-popover border rounded-mobile-lg shadow-mobile-lg p-3 max-w-xs mobile-s:max-w-[280px]"
            style={{
              left: position.x,
              top: position.y,
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// Micro-interaction Hook
export function useMicroInteraction(duration: number = 200) {
  const controls = useAnimation();
  const [isActive, setIsActive] = useState(false);

  const trigger = useCallback(async () => {
    if (isActive) return;
    
    setIsActive(true);
    await controls.start({
      scale: [1, 1.1, 1],
      transition: { duration: duration / 1000 }
    });
    setIsActive(false);
  }, [controls, duration, isActive]);

  return {
    animate: controls,
    trigger,
    isActive,
  };
}