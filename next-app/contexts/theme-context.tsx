"use client"
import * as React from 'react'

type Theme = 'light' | 'dark'
interface ThemeState {
  theme: Theme
  toggle: () => void
}

const ThemeContext = React.createContext<ThemeState | undefined>(undefined)

export function useThemePreference(): ThemeState {
  const [theme, setTheme] = React.useState<Theme>('light')

  // On mount read system + localStorage
  React.useEffect(() => {
    const stored = window.localStorage.getItem('theme') as Theme | null
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const initial = stored ?? (systemPrefersDark ? 'dark' : 'light')
    setTheme(initial)
    document.documentElement.classList.toggle('dark', initial === 'dark')
  }, [])

  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    window.localStorage.setItem('theme', theme)
  }, [theme])

  return {
    theme,
    toggle: () => setTheme(t => (t === 'dark' ? 'light' : 'dark'))
  }
}

export const ThemeProviderContext = ({ value, children }: { value: ThemeState; children: React.ReactNode }) => (
  <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
)

export function useTheme() {
  const ctx = React.useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProviderContext')
  return ctx
}
