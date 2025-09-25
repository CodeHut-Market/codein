import { createClient } from '@supabase/supabase-js'

// Server-side (never expose service role client to browser)
const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

export const supabaseAdmin = url && serviceKey
    ? createClient(url, serviceKey, {
        auth: { persistSession: false, autoRefreshToken: false }
    })
    : undefined

if (!supabaseAdmin) {
  // Intentionally silent in production; useful during local dev
    if (process.env.NODE_ENV !== 'production') {
    console.warn('[supabaseAdmin] Not initialized (missing URL or service role key)')
    }
}