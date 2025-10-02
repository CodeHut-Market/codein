"use client";

import { cn } from "@/lib/utils";
import React, { 
  useState, 
  useEffect, 
  useRef, 
  useCallback, 
  useMemo,
  memo,
  forwardRef
} from "react";

// Lazy Image Component with Intersection Observer
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  placeholder?: string;
  blurDataURL?: string;
  className?: string;
  containerClassName?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export const LazyImage = memo(forwardRef<HTMLImageElement, LazyImageProps>(({
  src,
  alt,
  placeholder,
  blurDataURL,
  className,
  containerClassName,
  onLoad,
  onError,
  ...props
}, ref) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        rootMargin: '50px',
        threshold: 0.1
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLoad = useCallback(() => {
    setIsLoaded(true);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    setHasError(true);
    onError?.();
  }, [onError]);

  return (
    <div 
      ref={containerRef}
      className={cn("relative overflow-hidden", containerClassName)}
    >
      {/* Placeholder/Blur */}
      {!isLoaded && (
        <div 
          className={cn(
            "absolute inset-0 bg-muted animate-pulse",
            blurDataURL && "bg-cover bg-center filter blur-sm",
            className
          )}
          style={blurDataURL ? { backgroundImage: `url(${blurDataURL})` } : undefined}
        />
      )}

      {/* Actual Image */}
      {isInView && !hasError && (
        <img
          ref={(node) => {
            if (typeof ref === 'function') ref(node);
            else if (ref) ref.current = node;
            imgRef.current = node;
          }}
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            "transition-opacity duration-300",
            isLoaded ? "opacity-100" : "opacity-0",
            className
          )}
          loading="lazy"
          decoding="async"
          {...props}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className={cn(
          "flex items-center justify-center bg-muted text-muted-foreground",
          "text-sm p-4",
          className
        )}>
          Failed to load image
        </div>
      )}
    </div>
  );
}));

LazyImage.displayName = "LazyImage";

// Virtual Scrolling Component
interface VirtualScrollProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  overscan?: number;
  onScroll?: (scrollTop: number) => void;
}

export function VirtualScroll<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  className,
  overscan = 5,
  onScroll,
}: VirtualScrollProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    setScrollTop(scrollTop);
    onScroll?.(scrollTop);
  }, [onScroll]);

  // Calculate visible range
  const { startIndex, endIndex, offsetY } = useMemo(() => {
    const visibleStart = Math.floor(scrollTop / itemHeight);
    const visibleEnd = Math.min(
      items.length - 1,
      Math.floor((scrollTop + containerHeight) / itemHeight)
    );

    return {
      startIndex: Math.max(0, visibleStart - overscan),
      endIndex: Math.min(items.length - 1, visibleEnd + overscan),
      offsetY: Math.max(0, (visibleStart - overscan) * itemHeight),
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // Visible items
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1);
  }, [items, startIndex, endIndex]);

  return (
    <div
      ref={scrollElementRef}
      className={cn("overflow-auto", className)}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={startIndex + index}
              style={{ 
                height: itemHeight,
                display: 'flex',
                alignItems: 'center'
              }}
            >
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Performance-optimized List Component
interface PerformanceListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T, index: number) => string | number;
  className?: string;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;
  onEndReached?: () => void;
  onEndReachedThreshold?: number;
  refreshing?: boolean;
  onRefresh?: () => void;
}

export function PerformanceList<T>({
  items,
  renderItem,
  keyExtractor,
  className,
  loadingComponent,
  emptyComponent,
  onEndReached,
  onEndReachedThreshold = 0.1,
  refreshing = false,
  onRefresh,
}: PerformanceListProps<T>) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const endReachedRef = useRef(false);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
    const threshold = scrollHeight * onEndReachedThreshold;

    if (distanceFromBottom <= threshold && !endReachedRef.current) {
      endReachedRef.current = true;
      onEndReached?.();
      
      // Reset after a delay to prevent multiple triggers
      setTimeout(() => {
        endReachedRef.current = false;
      }, 1000);
    }
  }, [onEndReached, onEndReachedThreshold]);

  const handleRefresh = useCallback(async () => {
    if (onRefresh && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
    }
  }, [onRefresh, isRefreshing]);

  // Memoized list items
  const listItems = useMemo(() => {
    return items.map((item, index) => (
      <MemoizedListItem
        key={keyExtractor(item, index)}
        item={item}
        index={index}
        renderItem={renderItem}
      />
    ));
  }, [items, keyExtractor, renderItem]);

  if (items.length === 0 && emptyComponent) {
    return <>{emptyComponent}</>;
  }

  return (
    <div
      ref={scrollRef}
      className={cn("overflow-auto", className)}
      onScroll={handleScroll}
    >
      {/* Pull to refresh indicator */}
      {(isRefreshing || refreshing) && (
        <div className="flex justify-center py-4">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        </div>
      )}

      {/* List items */}
      {listItems}

      {/* Loading indicator */}
      {loadingComponent && (
        <div className="flex justify-center py-4">
          {loadingComponent}
        </div>
      )}
    </div>
  );
}

// Memoized List Item
interface MemoizedListItemProps<T> {
  item: T;
  index: number;
  renderItem: (item: T, index: number) => React.ReactNode;
}

const MemoizedListItem = memo(<T,>({
  item,
  index,
  renderItem,
}: MemoizedListItemProps<T>) => {
  return <>{renderItem(item, index)}</>;
});

MemoizedListItem.displayName = "MemoizedListItem";

// Touch Event Optimization Hook
export function useOptimizedTouchEvents() {
  const touchStartRef = useRef<{ x: number; y: number; timestamp: number } | null>(null);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now(),
    };
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStartRef.current.x);
    const deltaY = Math.abs(touch.clientY - touchStartRef.current.y);

    // Prevent default if it's likely a horizontal scroll
    if (deltaX > deltaY && deltaX > 10) {
      e.preventDefault();
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    touchStartRef.current = null;
  }, []);

  return {
    onTouchStart: handleTouchStart,
    onTouchMove: handleTouchMove,
    onTouchEnd: handleTouchEnd,
  };
}

// Debounced Input Hook
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Throttled Scroll Hook
export function useThrottledScroll(callback: (scrollY: number) => void, delay: number = 16) {
  const lastRun = useRef(Date.now());

  useEffect(() => {
    const handleScroll = () => {
      if (Date.now() - lastRun.current >= delay) {
        callback(window.scrollY);
        lastRun.current = Date.now();
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback, delay]);
}

// Memory-efficient Image Preloader
class ImagePreloader {
  private cache = new Map<string, HTMLImageElement>();
  private maxCacheSize = 50;

  preload(src: string): Promise<HTMLImageElement> {
    if (this.cache.has(src)) {
      return Promise.resolve(this.cache.get(src)!);
    }

    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        if (this.cache.size >= this.maxCacheSize) {
          const firstKey = this.cache.keys().next().value;
          this.cache.delete(firstKey);
        }
        this.cache.set(src, img);
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }

  clearCache(): void {
    this.cache.clear();
  }

  getCacheSize(): number {
    return this.cache.size;
  }
}

export const imagePreloader = new ImagePreloader();

// Web Worker Hook for Heavy Computations
export function useWebWorker<T, R>(
  workerFunction: (data: T) => R,
  dependencies: any[] = []
) {
  const workerRef = useRef<Worker | null>(null);

  const runWorker = useCallback((data: T): Promise<R> => {
    return new Promise((resolve, reject) => {
      if (!workerRef.current) {
        const workerBlob = new Blob([`
          self.onmessage = function(e) {
            try {
              const result = (${workerFunction.toString()})(e.data);
              self.postMessage({ success: true, result });
            } catch (error) {
              self.postMessage({ success: false, error: error.message });
            }
          };
        `], { type: 'application/javascript' });

        workerRef.current = new Worker(URL.createObjectURL(workerBlob));
      }

      const handleMessage = (e: MessageEvent) => {
        workerRef.current?.removeEventListener('message', handleMessage);
        if (e.data.success) {
          resolve(e.data.result);
        } else {
          reject(new Error(e.data.error));
        }
      };

      workerRef.current.addEventListener('message', handleMessage);
      workerRef.current.postMessage(data);
    });
  }, dependencies);

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  return runWorker;
}

// Optimized Animation Hook
export function useOptimizedAnimation(enabled: boolean = true) {
  const rafRef = useRef<number>();
  const callbackRef = useRef<(() => void) | null>(null);

  const animate = useCallback((callback: () => void) => {
    if (!enabled) {
      callback();
      return;
    }

    callbackRef.current = callback;
    
    const frame = () => {
      if (callbackRef.current) {
        callbackRef.current();
        callbackRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(frame);
  }, [enabled]);

  const cancelAnimation = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = undefined;
    }
    callbackRef.current = null;
  }, []);

  useEffect(() => {
    return cancelAnimation;
  }, [cancelAnimation]);

  return { animate, cancelAnimation };
}