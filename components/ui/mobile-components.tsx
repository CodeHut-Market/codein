"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import { X, Plus, ChevronDown, ChevronUp } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";

// Bottom Sheet Component
interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  snapPoints?: number[];
  initialSnap?: number;
  className?: string;
}

export function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  snapPoints = [0.3, 0.6, 0.9],
  initialSnap = 1,
  className,
}: BottomSheetProps) {
  const [currentSnap, setCurrentSnap] = useState(initialSnap);
  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  const heightPercentage = snapPoints[currentSnap];

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDragEnd = (event: MouseEvent | TouchEvent, info: PanInfo) => {
    setIsDragging(false);
    
    if (info.velocity.y > 500 || info.offset.y > 100) {
      // Close if dragged down with sufficient velocity or distance
      onClose();
    } else {
      // Snap to nearest point
      const currentHeight = window.innerHeight * heightPercentage;
      const draggedHeight = currentHeight - info.offset.y;
      const targetPercentage = draggedHeight / window.innerHeight;
      
      let nearestSnapIndex = 0;
      let minDistance = Math.abs(targetPercentage - snapPoints[0]);
      
      snapPoints.forEach((point, index) => {
        const distance = Math.abs(targetPercentage - point);
        if (distance < minDistance) {
          minDistance = distance;
          nearestSnapIndex = index;
        }
      });
      
      setCurrentSnap(nearestSnapIndex);
    }
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
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Bottom Sheet */}
          <motion.div
            ref={sheetRef}
            initial={{ y: "100%" }}
            animate={{ 
              y: `${100 - (heightPercentage * 100)}%`,
            }}
            exit={{ y: "100%" }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.1}
            onDragStart={() => setIsDragging(true)}
            onDragEnd={handleDragEnd}
            transition={{
              type: "spring",
              damping: 30,
              stiffness: 300,
            }}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-50",
              "bg-background border-t rounded-t-xl shadow-2xl",
              "safe-area-bottom",
              className
            )}
            style={{ 
              height: `${heightPercentage * 100}vh`,
              touchAction: "none"
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing">
              <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between px-6 pb-4 border-b">
                <h3 className="text-lg font-semibold">{title}</h3>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {children}
            </div>

            {/* Snap Indicators */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col space-y-2">
              {snapPoints.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSnap(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-colors",
                    currentSnap === index 
                      ? "bg-primary" 
                      : "bg-muted-foreground/30"
                  )}
                />
              ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Floating Action Button
interface FloatingActionButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  size?: "sm" | "md" | "lg";
  className?: string;
  extended?: boolean;
  label?: string;
}

export function FloatingActionButton({
  children,
  onClick,
  position = "bottom-right",
  size = "md",
  className,
  extended = false,
  label,
}: FloatingActionButtonProps) {
  const positionClasses = {
    "bottom-right": "bottom-6 right-6",
    "bottom-left": "bottom-6 left-6",
    "bottom-center": "bottom-6 left-1/2 -translate-x-1/2",
  };

  const sizeClasses = {
    sm: extended ? "h-12 px-4" : "w-12 h-12",
    md: extended ? "h-14 px-6" : "w-14 h-14",
    lg: extended ? "h-16 px-8" : "w-16 h-16",
  };

  const iconSizes = {
    sm: "w-5 h-5",
    md: "w-6 h-6",
    lg: "w-7 h-7",
  };

  return (
    <motion.button
      className={cn(
        "fixed z-50 bg-primary text-primary-foreground rounded-full shadow-float",
        "flex items-center justify-center",
        "transition-all duration-200 hover:shadow-float-lg",
        "active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50",
        "safe-area-bottom safe-area-right safe-area-left",
        positionClasses[position],
        sizeClasses[size],
        className
      )}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      exit={{ scale: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <span className={iconSizes[size]}>{children}</span>
      {extended && label && (
        <motion.span
          className="ml-2 font-medium"
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
        >
          {label}
        </motion.span>
      )}
    </motion.button>
  );
}

// Mobile Card Component
interface MobileCardProps {
  children: React.ReactNode;
  variant?: "default" | "elevated" | "outlined";
  padding?: "sm" | "md" | "lg";
  className?: string;
  interactive?: boolean;
  onPress?: () => void;
}

export function MobileCard({
  children,
  variant = "default",
  padding = "md",
  className,
  interactive = false,
  onPress,
}: MobileCardProps) {
  const [isPressed, setIsPressed] = useState(false);

  const variantClasses = {
    default: "bg-card border border-border",
    elevated: "bg-card shadow-mobile-lg",
    outlined: "bg-transparent border-2 border-border",
  };

  const paddingClasses = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };

  return (
    <motion.div
      className={cn(
        "rounded-mobile-lg transition-all duration-200",
        variantClasses[variant],
        paddingClasses[padding],
        interactive && "cursor-pointer active:scale-98",
        className
      )}
      onTouchStart={() => interactive && setIsPressed(true)}
      onTouchEnd={() => interactive && setIsPressed(false)}
      onMouseDown={() => interactive && setIsPressed(true)}
      onMouseUp={() => interactive && setIsPressed(false)}
      onClick={interactive ? onPress : undefined}
      animate={{
        scale: isPressed ? 0.98 : 1,
      }}
      transition={{ duration: 0.1 }}
    >
      {children}
    </motion.div>
  );
}

// Mobile Form Field Component
interface MobileFormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
  helperText?: string;
  className?: string;
}

export function MobileFormField({
  label,
  children,
  error,
  required,
  helperText,
  className,
}: MobileFormFieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block text-sm font-medium text-foreground mobile-s:text-xs">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      
      <div className="relative">
        {children}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive mobile-s:text-xs"
        >
          {error}
        </motion.p>
      )}
      
      {helperText && !error && (
        <p className="text-sm text-muted-foreground mobile-s:text-xs">
          {helperText}
        </p>
      )}
    </div>
  );
}

// Mobile Input Component
interface MobileInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

export function MobileInput({
  label,
  error,
  icon,
  iconPosition = "left",
  className,
  ...props
}: MobileInputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-foreground mobile-s:text-xs">
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === "left" && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
        
        <input
          className={cn(
            "w-full h-touch rounded-mobile border border-border bg-background px-4 py-3 text-base",
            "mobile-s:text-mobile-base mobile-s:h-touch-sm",
            "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent",
            "transition-all duration-200",
            "placeholder:text-muted-foreground",
            icon && iconPosition === "left" && "pl-10",
            icon && iconPosition === "right" && "pr-10",
            error && "border-destructive focus:ring-destructive/50",
            isFocused && "shadow-mobile-sm",
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {icon && iconPosition === "right" && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {icon}
          </div>
        )}
      </div>
      
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive mobile-s:text-xs"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

// Collapsible Section Component
interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
  className,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={cn("border rounded-mobile-lg overflow-hidden", className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 bg-muted/30 hover:bg-muted/50 transition-colors"
      >
        <h3 className="font-medium text-left mobile-s:text-sm">{title}</h3>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 mobile-s:w-4 mobile-s:h-4" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 border-t">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Mobile Badge Component
interface MobileBadgeProps {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "destructive" | "success";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function MobileBadge({
  children,
  variant = "default",
  size = "md",
  className,
}: MobileBadgeProps) {
  const variantClasses = {
    default: "bg-muted text-muted-foreground",
    primary: "bg-primary text-primary-foreground",
    secondary: "bg-secondary text-secondary-foreground",
    destructive: "bg-destructive text-destructive-foreground",
    success: "bg-green-500 text-white",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs mobile-s:text-mobile-xs",
    md: "px-3 py-1 text-sm mobile-s:text-mobile-sm",
    lg: "px-4 py-1.5 text-base mobile-s:text-mobile-base",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </span>
  );
}