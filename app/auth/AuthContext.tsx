"use client";
import { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseEnabled, supabase } from '../lib/supabaseClient';

export interface AuthUser { id: string; email?: string | null; }
interface AuthContextValue { user: AuthUser | null; loading: boolean; signOut: () => Promise<void>; }

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true, signOut: async ()=>{} });

export function AuthProvider({ children }: { children: React.ReactNode }){
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=> {
    if(!isSupabaseEnabled()) { setLoading(false); return; }
    supabase!.auth.getSession().then(({ data })=> {
      setUser(data.session?.user ? { id: data.session.user.id, email: data.session.user.email } : null);
      setLoading(false);
    });
    const { data: listener } = supabase!.auth.onAuthStateChange((_event, session)=> {
      setUser(session?.user ? { id: session.user.id, email: session.user.email } : null);
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  async function signOut(){ if(isSupabaseEnabled()) await supabase!.auth.signOut(); }

  return <AuthContext.Provider value={{ user, loading, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth(){ return useContext(AuthContext); }
