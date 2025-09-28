"use client";
import { ThemeProvider } from '@/contexts/ThemeContext';
import React from 'react';
import { AuthProvider } from '../contexts/AuthContext';
// Central place to compose all client-side context providers (Theme, Auth, Notifications, etc.)

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </ThemeProvider>
  );
}
