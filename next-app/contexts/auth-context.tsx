"use client"
import * as React from 'react';
import { supabase } from '../lib/supabaseClient';

interface User { id: string; email: string }
interface AuthState {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = React.createContext<AuthState | undefined>(undefined)

export function useAuthState(): AuthState {
  const [user, setUser] = React.useState<User | null>(null)
  const [loading, setLoading] = React.useState(false)

  // Load session (if supabase configured)
  React.useEffect(() => {
    if (!supabase) return
    setLoading(true)
  supabase.auth.getSession().then(({ data }: { data: { session: any } }) => {
      const s = data.session
      if (s?.user) setUser({ id: s.user.id, email: s.user.email ?? '' })
      setLoading(false)
    })
  const { data: sub } = supabase.auth.onAuthStateChange((_event: string, session: any) => {
      if (session?.user) setUser({ id: session.user.id, email: session.user.email ?? '' })
      else setUser(null)
    })
    return () => { sub.subscription.unsubscribe() }
  }, [])

  async function login(email: string, password: string) {
    if (!supabase) {
      // fallback mock
      setUser({ id: 'demo', email });
      return
    }
    setLoading(true)
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) console.error('login error', error.message)
    else if (data.user) setUser({ id: data.user.id, email: data.user.email ?? '' })
    setLoading(false)
  }

  async function logout() {
    if (!supabase) { setUser(null); return }
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    if (error) console.error('logout error', error.message)
    setUser(null)
    setLoading(false)
  }

  return { user, loading, login, logout }
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthContext.Provider')
  return ctx
}
