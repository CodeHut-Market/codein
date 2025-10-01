"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from 'react';
import { TooltipProvider } from '../client/components/ui/tooltip';
import { ToastProvider } from '../components/ToastProvider';
import { AuthProvider } from '../client/contexts/AuthContext';

// Central place to compose all client-side context providers (Theme, Auth, Notifications, etc.)

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <TooltipProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </TooltipProvider>
      </AuthProvider>
    </NextThemesProvider>
  );
}
