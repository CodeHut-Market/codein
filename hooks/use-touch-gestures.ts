"use client";

import { useCallback, useEffect, useRef, useState } from "react";

// Touch gesture detection hooks and utilities

export interface SwipeDirection {
  x: number;
  y: number;
  direction: "left" | "right" | "up" | "down" | null;
}

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface UseSwipeOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  minSwipeDistance?: number;
  maxSwipeTime?: number;
  preventDefaultTouchmoveEvent?: boolean;
}

export function useSwipe(options: UseSwipeOptions = {}) {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    minSwipeDistance = 50,
    maxSwipeTime = 300,
    preventDefaultTouchmoveEvent = false,
  } = options;

  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefaultTouchmoveEvent) {
      e.preventDefault();
    }
  }, [preventDefaultTouchmoveEvent]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };

    const deltaX = touchEndRef.current.x - touchStartRef.current.x;
    const deltaY = touchEndRef.current.y - touchStartRef.current.y;
    const deltaTime = touchEndRef.current.timestamp - touchStartRef.current.timestamp;

    if (deltaTime > maxSwipeTime) return;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (Math.max(absX, absY) < minSwipeDistance) return;

    if (absX > absY) {
      // Horizontal swipe
      if (deltaX > 0 && onSwipeRight) {
        onSwipeRight();
      } else if (deltaX < 0 && onSwipeLeft) {
        onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (deltaY > 0 && onSwipeDown) {
        onSwipeDown();
      } else if (deltaY < 0 && onSwipeUp) {
        onSwipeUp();
      }
    }

    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown, minSwipeDistance, maxSwipeTime]);

  const swipeHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return swipeHandlers;
}

// Pull to refresh hook
export interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void> | void;
  threshold?: number;
  resistance?: number;
  enabled?: boolean;
}

export function usePullToRefresh(options: UsePullToRefreshOptions) {
  const {
    onRefresh,
    threshold = 80,
    resistance = 2.5,
    enabled = true,
  } = options;

  const [isPulling, setIsPulling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  
  const startY = useRef(0);
  const currentY = useRef(0);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!enabled || window.scrollY > 0) return;
    
    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  }, [enabled]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!enabled || !isPulling || window.scrollY > 0) return;

    currentY.current = e.touches[0].clientY;
    const diff = currentY.current - startY.current;

    if (diff > 0) {
      const distance = Math.min(diff / resistance, threshold * 1.5);
      setPullDistance(distance);
      
      if (distance > 20) {
        e.preventDefault();
      }
    }
  }, [enabled, isPulling, resistance, threshold]);

  const handleTouchEnd = useCallback(async () => {
    if (!enabled || !isPulling) return;

    setIsPulling(false);

    if (pullDistance >= threshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }

    setPullDistance(0);
  }, [enabled, isPulling, pullDistance, threshold, onRefresh]);

  const pullToRefreshHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    isPulling,
    isRefreshing,
    pullDistance,
    pullToRefreshHandlers,
  };
}

// Long press hook
export interface UseLongPressOptions {
  onLongPress: () => void;
  delay?: number;
  shouldPreventDefault?: boolean;
}

export function useLongPress(options: UseLongPressOptions) {
  const {
    onLongPress,
    delay = 500,
    shouldPreventDefault = true,
  } = options;

  const timerRef = useRef<NodeJS.Timeout>();
  const isLongPressRef = useRef(false);

  const start = useCallback((event: React.TouchEvent | React.MouseEvent) => {
    if (shouldPreventDefault) {
      event.preventDefault();
    }

    isLongPressRef.current = false;
    timerRef.current = setTimeout(() => {
      isLongPressRef.current = true;
      onLongPress();
    }, delay);
  }, [onLongPress, delay, shouldPreventDefault]);

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = undefined;
    }
  }, []);

  const clickHandler = useCallback((event: React.MouseEvent) => {
    if (isLongPressRef.current) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, []);

  return {
    onMouseDown: start,
    onTouchStart: start,
    onMouseUp: clear,
    onMouseLeave: clear,
    onTouchEnd: clear,
    onClick: clickHandler,
  };
}

// Haptic feedback utility
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

  static error(): void {
    if (this.isSupported()) {
      navigator.vibrate([50, 30, 50]);
    }
  }

  static warning(): void {
    if (this.isSupported()) {
      navigator.vibrate([30, 10, 30, 10, 30]);
    }
  }

  static notification(): void {
    if (this.isSupported()) {
      navigator.vibrate([20, 10, 20]);
    }
  }

  static custom(pattern: number | number[]): void {
    if (this.isSupported()) {
      navigator.vibrate(pattern);
    }
  }
}

// Touch ripple effect hook
export function useTouchRipple() {
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

    // Remove ripple after animation
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

// Double tap hook
export interface UseDoubleTapOptions {
  onDoubleTap: () => void;
  delay?: number;
}

export function useDoubleTap(options: UseDoubleTapOptions) {
  const { onDoubleTap, delay = 300 } = options;
  const lastTapRef = useRef<number>(0);

  const handleTap = useCallback(() => {
    const now = Date.now();
    const timeDiff = now - lastTapRef.current;

    if (timeDiff < delay && timeDiff > 0) {
      onDoubleTap();
      lastTapRef.current = 0;
    } else {
      lastTapRef.current = now;
    }
  }, [onDoubleTap, delay]);

  return {
    onTouchEnd: handleTap,
    onClick: handleTap,
  };
}

// Pinch zoom hook
export interface UsePinchZoomOptions {
  onPinchStart?: (scale: number) => void;
  onPinchMove?: (scale: number) => void;
  onPinchEnd?: (scale: number) => void;
  minScale?: number;
  maxScale?: number;
}

export function usePinchZoom(options: UsePinchZoomOptions = {}) {
  const {
    onPinchStart,
    onPinchMove,
    onPinchEnd,
    minScale = 0.5,
    maxScale = 3,
  } = options;

  const [scale, setScale] = useState(1);
  const [isPinching, setIsPinching] = useState(false);
  const lastDistanceRef = useRef<number>(0);

  const getDistance = (touches: TouchList): number => {
    const [touch1, touch2] = Array.from(touches);
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      setIsPinching(true);
      lastDistanceRef.current = getDistance(e.touches);
      onPinchStart?.(scale);
    }
  }, [scale, onPinchStart]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2 && isPinching) {
      e.preventDefault();
      
      const distance = getDistance(e.touches);
      const scaleChange = distance / lastDistanceRef.current;
      const newScale = Math.max(minScale, Math.min(maxScale, scale * scaleChange));
      
      setScale(newScale);
      onPinchMove?.(newScale);
      lastDistanceRef.current = distance;
    }
  }, [isPinching, scale, minScale, maxScale, onPinchMove]);

  const handleTouchEnd = useCallback(() => {
    if (isPinching) {
      setIsPinching(false);
      onPinchEnd?.(scale);
    }
  }, [isPinching, scale, onPinchEnd]);

  const pinchHandlers = {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };

  return {
    scale,
    isPinching,
    pinchHandlers,
    resetScale: () => setScale(1),
  };
}