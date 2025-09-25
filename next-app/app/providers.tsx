"use client"
import * as React from 'react'
import { AuthContext, useAuthState } from '../contexts/auth-context'
import { ThemeProviderContext, useThemePreference } from '../contexts/theme-context'

export function AppProviders({ children }: { children: React.ReactNode }) {
  const theme = useThemePreference()
  const auth = useAuthState()
  return (
    <ThemeProviderContext value={theme}>
      <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
    </ThemeProviderContext>
  )
}
