"use client"

import { Code, Cpu, GitBranch, Terminal, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';

interface LoadingSpinnerProps {
  variant?: 'default' | 'code-matrix' | 'terminal' | 'circuit' | 'git-flow' | 'neural';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  className?: string;
}

export default function LoadingSpinner({ 
  variant = 'default', 
  size = 'md', 
  message = 'Loading...', 
  className = '' 
}: LoadingSpinnerProps) {
  const [dots, setDots] = useState('');
  const [codeChars, setCodeChars] = useState<string[]>([]);

  // Animated dots for loading text
  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Matrix-style code characters
  useEffect(() => {
    const chars = ['0', '1', '{', '}', '<', '>', '/', '\\', '(', ')', '[', ']', ';', ':', '=', '+', '-', '*'];
    const interval = setInterval(() => {
      setCodeChars(Array(12).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]));
    }, 200);
    return () => clearInterval(interval);
  }, []);

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
    xl: 'text-lg'
  };

  // Default tech loading spinner
  if (variant === 'default') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          {/* Outer rotating ring */}
          <div className={`${sizeClasses[size]} border-4 border-primary/20 border-t-primary rounded-full animate-spin`}></div>
          {/* Inner pulsing core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Code className="w-1/2 h-1/2 text-primary animate-pulse" />
          </div>
        </div>
        <div className={`text-muted-foreground ${textSizeClasses[size]} font-mono`}>
          {message}{dots}
        </div>
      </div>
    );
  }

  // Matrix code falling effect
  if (variant === 'code-matrix') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          <div className={`${sizeClasses[size]} bg-black/10 dark:bg-white/10 rounded-lg border border-primary/30 flex flex-wrap items-center justify-center p-2 overflow-hidden`}>
            {codeChars.map((char, i) => (
              <span
                key={i}
                className="text-primary font-mono text-xs animate-pulse opacity-70"
                style={{ 
                  animationDelay: `${i * 100}ms`,
                  animationDuration: '1s'
                }}
              >
                {char}
              </span>
            ))}
          </div>
          {/* Scanning line */}
          <div className="absolute inset-0 border border-primary/50 rounded-lg">
            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent animate-pulse"></div>
          </div>
        </div>
        <div className={`text-muted-foreground ${textSizeClasses[size]} font-mono`}>
          Compiling{dots}
        </div>
      </div>
    );
  }

  // Terminal loading
  if (variant === 'terminal') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          <div className={`${sizeClasses[size]} bg-black/90 dark:bg-black/70 rounded border border-gray-600 flex items-center justify-center`}>
            <Terminal className="w-1/2 h-1/2 text-green-400 animate-pulse" />
          </div>
          {/* Terminal cursor */}
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-green-400 animate-ping"></div>
        </div>
        <div className={`text-green-400 ${textSizeClasses[size]} font-mono`}>
          $ npm run build{dots}
        </div>
      </div>
    );
  }

  // Circuit board loading
  if (variant === 'circuit') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          {/* Main circuit */}
          <div className={`${sizeClasses[size]} flex items-center justify-center`}>
            <Cpu className="w-full h-full text-primary animate-pulse" />
          </div>
          {/* Orbiting electrons */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-blue-400 rounded-full transform -translate-x-1/2 animate-ping"></div>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }}>
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-green-400 rounded-full animate-ping"></div>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '2s' }}>
            <div className="absolute left-0 top-1/2 w-1 h-1 bg-yellow-400 rounded-full transform -translate-y-1/2 animate-ping"></div>
          </div>
        </div>
        <div className={`text-muted-foreground ${textSizeClasses[size]} font-mono`}>
          Processing{dots}
        </div>
      </div>
    );
  }

  // Git flow loading
  if (variant === 'git-flow') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          <div className={`${sizeClasses[size]} flex items-center justify-center`}>
            <GitBranch className="w-full h-full text-primary animate-pulse" />
          </div>
          {/* Commit dots flowing */}
          <div className="absolute inset-0">
            <div className="absolute top-2 left-2 w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
            <div className="absolute top-4 left-4 w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
            <div className="absolute top-6 left-6 w-1 h-1 bg-primary rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
          </div>
        </div>
        <div className={`text-muted-foreground ${textSizeClasses[size]} font-mono`}>
          git push origin main{dots}
        </div>
      </div>
    );
  }

  // Neural network loading
  if (variant === 'neural') {
    return (
      <div className={`flex flex-col items-center justify-center space-y-4 ${className}`}>
        <div className="relative">
          <div className={`${sizeClasses[size]} flex items-center justify-center`}>
            <Zap className="w-full h-full text-primary animate-pulse" />
          </div>
          {/* Neural connections */}
          <div className="absolute inset-0">
            <svg className="w-full h-full" viewBox="0 0 100 100">
              <circle cx="20" cy="20" r="2" fill="currentColor" className="text-blue-400 animate-pulse" />
              <circle cx="80" cy="20" r="2" fill="currentColor" className="text-green-400 animate-pulse" style={{ animationDelay: '0.3s' }} />
              <circle cx="20" cy="80" r="2" fill="currentColor" className="text-yellow-400 animate-pulse" style={{ animationDelay: '0.6s' }} />
              <circle cx="80" cy="80" r="2" fill="currentColor" className="text-red-400 animate-pulse" style={{ animationDelay: '0.9s' }} />
              <line x1="20" y1="20" x2="80" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-primary/30 animate-pulse" />
              <line x1="80" y1="20" x2="20" y2="80" stroke="currentColor" strokeWidth="0.5" className="text-primary/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </svg>
          </div>
        </div>
        <div className={`text-muted-foreground ${textSizeClasses[size]} font-mono`}>
          Neural network training{dots}
        </div>
      </div>
    );
  }

  return null;
}

// Fullscreen loading overlay component
export function LoadingOverlay({ 
  isLoading, 
  variant = 'default', 
  message = 'Loading...' 
}: { 
  isLoading: boolean; 
  variant?: LoadingSpinnerProps['variant']; 
  message?: string; 
}) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="bg-background border border-border rounded-lg p-8 shadow-xl">
        <LoadingSpinner variant={variant} size="xl" message={message} />
      </div>
    </div>
  );
}

// Page loading component
export function PageLoading({ variant = 'code-matrix' }: { variant?: LoadingSpinnerProps['variant'] }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <LoadingSpinner variant={variant} size="xl" message="Loading CodeHut" />
    </div>
  );
}