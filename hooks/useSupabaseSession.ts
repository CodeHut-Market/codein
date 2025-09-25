import { useEffect, useState } from 'react';
// Adjusted relative import because tsconfig updated to include lib alias; keeping direct path for reliability.
import { isSupabaseEnabled, supabase } from '../app/lib/supabaseClient';

// Basic shapes; refine with Supabase types if desired.
interface SupabaseSession {
  user?: any;
  [k: string]: any;
}
interface UseSupabaseSessionResult {
  session: SupabaseSession | null;
  user: any | null;
  loading: boolean;
}

export function useSupabaseSession(): UseSupabaseSessionResult {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(!isSupabaseEnabled()) {
      setLoading(false);
      return;
    }
    let active = true;
    supabase!.auth.getSession().then((res: any) => {
      if(!active) return;
      setSession(res?.data?.session ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase!.auth.onAuthStateChange((_evt: string, sess: SupabaseSession | null) => {
      setSession(sess);
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { session, user: session?.user ?? null, loading };
}
