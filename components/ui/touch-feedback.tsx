"use client";

import { cn } from "@/lib/utils";
import { motion, AnimatePresence, PanInfo } from "framer-motion";
import React, { useState, useCallback, useRef } from "react";

// Inline haptic feedback utility
export class HapticFeedback {
  static isSupported(): boolean {
    return 'vibrate' in navigator;
  }

  static light(): void {
    if (this.isSupported()) {
      navigator.vibrate(10);
    }
  }

  static medium(): void {
    if (this.isSupported()) {
      navigator.vibrate(20);
    }
  }

  static heavy(): void {
    if (this.isSupported()) {
      navigator.vibrate([30, 10, 30]);
    }
  }

  static selection(): void {
    if (this.isSupported()) {
      navigator.vibrate(5);
    }
  }

  static success(): void {
    if (this.isSupported()) {
      navigator.vibrate([10, 5, 10]);
    }
  }
}

// Inline touch ripple hook
function useTouchRipple() {
  const [ripples, setRipples] = useState<Array<{
    x: number;
    y: number;
    id: number;
  }>>([]);

  const addRipple = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (event as React.TouchEvent).touches 
      ? (event as React.TouchEvent).touches[0].clientX - rect.left
      : (event as React.MouseEvent).clientX - rect.left;
    const y = (event as React.TouchEvent).touches
      ? (event as React.TouchEvent).touches[0].clientY - rect.top
      : (event as React.MouseEvent).clientY - rect.top;

    const newRipple = {
      x,
      y,
      id: Date.now(),
    };

    setRipples(prev => [...prev, newRipple]);

    setTimeout(() => {
      setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id));
    }, 600);
  }, []);

  const rippleProps = {
    onTouchStart: addRipple,
    onMouseDown: addRipple,
  };

  return { ripples, rippleProps };
}

// Ripple Button Component
interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "default" | "primary" | "secondary" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
  hapticFeedback?: "light" | "medium" | "heavy" | "selection" | "none";
  rippleColor?: string;
}

export function RippleButton({
  children,
  className,
  variant = "default",
  size = "md",
  hapticFeedback = "light",
  rippleColor = "rgba(255, 255, 255, 0.3)",
  onClick,
  ...props
}: RippleButtonProps) {
  const { ripples, rippleProps } = useTouchRipple();
  const [isPressed, setIsPressed] = useState(false);

  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    if (hapticFeedback !== "none") {
      HapticFeedback[hapticFeedback]();
    }
    onClick?.(e);
  }, [onClick, hapticFeedback]);

  const handleTouchStart = useCallback((e: React.TouchEvent<HTMLButtonElement>) => {
    setIsPressed(true);
    rippleProps.onTouchStart(e);
  }, [rippleProps]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  const buttonVariants = {
    default: "bg-background border border-border hover:bg-muted text-foreground",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/90",
    ghost: "hover:bg-muted hover:text-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  };

  const sizeVariants = {
    sm: "h-touch-sm px-3 text-sm rounded-mobile-sm",
    md: "h-touch px-4 text-base rounded-mobile",
    lg: "h-touch-lg px-6 text-lg rounded-mobile-lg",
  };

  const { onAnimationStart, onAnimationEnd, onAnimationIteration, onDragStart, onDrag, onDragEnd, ...buttonProps } = props;

  return (
    <motion.button
      className={cn(
        "relative overflow-hidden font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/50 active:scale-95",
        "select-none touch-manipulation",
        buttonVariants[variant],
        sizeVariants[size],
        isPressed && "scale-95",
        className
      )}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={rippleProps.onMouseDown}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
      {...buttonProps}
    >
    {children}
      
      {/* Ripple Effects */}
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            className="absolute rounded-full pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              backgroundColor: rippleColor,
            }}
            initial={{ width: 0, height: 0, opacity: 0.8 }}
            animate={{ width: 200, height: 200, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </motion.button>
  );
}

// Touchable Card Component
interface TouchableCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  onPress?: () => void;
  hapticFeedback?: "light" | "medium" | "heavy" | "selection" | "none";
  pressScale?: number;
  disabled?: boolean;
}

export function TouchableCard({
  children,
  className,
  onPress,
  hapticFeedback = "light",
  pressScale = 0.98,
  disabled = false,
  ...props
}: TouchableCardProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { ripples, rippleProps } = useTouchRipple();

  const handlePress = useCallback(() => {
    if (disabled) return;
    
    if (hapticFeedback !== "none") {
      HapticFeedback[hapticFeedback]();
    }
    onPress?.();
  }, [onPress, hapticFeedback, disabled]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    setIsPressed(true);
    rippleProps.onTouchStart(e);
  }, [rippleProps, disabled]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden bg-card border rounded-mobile-lg p-4 cursor-pointer select-none touch-manipulation",
        "transition-all duration-200",
        !disabled && "hover:shadow-mobile-md",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={!disabled ? rippleProps.onMouseDown : undefined}
      onClick={!disabled ? handlePress : undefined}
      animate={{
        scale: isPressed ? pressScale : 1,
      }}
      transition={{ duration: 0.1 }}
    >
      {children}
      
      {/* Ripple Effects */}
      {!disabled && (
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                backgroundColor: "rgba(0, 0, 0, 0.1)",
              }}
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: 300, height: 300, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

// Touch Feedback Wrapper
interface TouchFeedbackProps {
  children: React.ReactNode;
  onPress?: () => void;
  hapticFeedback?: "light" | "medium" | "heavy" | "selection" | "none";
  pressScale?: number;
  rippleColor?: string;
  disabled?: boolean;
  className?: string;
}

export function TouchFeedback({
  children,
  onPress,
  hapticFeedback = "light",
  pressScale = 0.95,
  rippleColor = "rgba(0, 0, 0, 0.1)",
  disabled = false,
  className,
}: TouchFeedbackProps) {
  const [isPressed, setIsPressed] = useState(false);
  const { ripples, rippleProps } = useTouchRipple();

  const handlePress = useCallback(() => {
    if (disabled) return;
    
    if (hapticFeedback !== "none") {
      HapticFeedback[hapticFeedback]();
    }
    onPress?.();
  }, [onPress, hapticFeedback, disabled]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    setIsPressed(true);
    rippleProps.onTouchStart(e);
  }, [rippleProps, disabled]);

  const handleTouchEnd = useCallback(() => {
    setIsPressed(false);
  }, []);

  return (
    <motion.div
      className={cn(
        "relative overflow-hidden cursor-pointer select-none touch-manipulation",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={!disabled ? rippleProps.onMouseDown : undefined}
      onClick={!disabled ? handlePress : undefined}
      animate={{
        scale: isPressed ? pressScale : 1,
      }}
      transition={{ duration: 0.1 }}
    >
      {children}
      
      {/* Ripple Effects */}
      {!disabled && (
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.span
              key={ripple.id}
              className="absolute rounded-full pointer-events-none"
              style={{
                left: ripple.x,
                top: ripple.y,
                backgroundColor: rippleColor,
              }}
              initial={{ width: 0, height: 0, opacity: 0.8 }}
              animate={{ width: 200, height: 200, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

// Swipeable Item Component
interface SwipeableItemProps {
  children: React.ReactNode;
  leftAction?: {
    icon: React.ReactNode;
    color: string;
    onAction: () => void;
  };
  rightAction?: {
    icon: React.ReactNode;
    color: string;
    onAction: () => void;
  };
  className?: string;
}

export function SwipeableItem({
  children,
  leftAction,
  rightAction,
  className,
}: SwipeableItemProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  const handleDragEnd = useCallback((event: MouseEvent | TouchEvent, info: PanInfo) => {
    const threshold = 80;
    
    if (info.offset.x > threshold && leftAction) {
      leftAction.onAction();
      HapticFeedback.success();
    } else if (info.offset.x < -threshold && rightAction) {
      rightAction.onAction();
      HapticFeedback.success();
    }
    
    setSwipeX(0);
    setIsSwipeActive(false);
  }, [leftAction, rightAction]);

  const handleDrag = useCallback((event: MouseEvent | TouchEvent, info: PanInfo) => {
    setSwipeX(info.offset.x);
    setIsSwipeActive(Math.abs(info.offset.x) > 10);
  }, []);

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Left Action */}
      {leftAction && (
        <motion.div
          className="absolute left-0 top-0 h-full w-20 flex items-center justify-center"
          style={{ backgroundColor: leftAction.color }}
          animate={{ opacity: swipeX > 40 ? 1 : 0 }}
        >
          {leftAction.icon}
        </motion.div>
      )}
      
      {/* Right Action */}
      {rightAction && (
        <motion.div
          className="absolute right-0 top-0 h-full w-20 flex items-center justify-center"
          style={{ backgroundColor: rightAction.color }}
          animate={{ opacity: swipeX < -40 ? 1 : 0 }}
        >
          {rightAction.icon}
        </motion.div>
      )}
      
      {/* Main Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -100, right: 100 }}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ x: swipeX }}
        className={cn(
          "bg-background relative z-10 transition-shadow duration-200",
          isSwipeActive && "shadow-mobile-lg"
        )}
      >
        {children}
      </motion.div>
    </div>
  );
}