# Authentication & Authorization

## Overview
This project uses Supabase for authentication (GitHub + optional Google OAuth) and session management. Legacy React SPA / custom AuthContext logic is being deprecated in favor of a unified `useSupabaseSession` hook.

## Supported Providers
- GitHub (primary)
- Google (optional if enabled in Supabase dashboard)

## Environment Variables
Set these in a `.env.local` (local) and your hosting provider (production):
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key   # (Only if needed for server-side privileged ops)
NEXT_PUBLIC_SITE_URL=http://localhost:3000       # Used for redirects (adjust in production)
```

## Enabling GitHub in Supabase
1. Open Supabase Dashboard → Authentication → Providers.
2. Enable GitHub.
3. In GitHub Developer Settings create an OAuth App:
   - Homepage URL: `https://your-production-domain` (or `http://localhost:3000` for local)
   - Authorization callback URL: `https://your-production-domain/auth/callback` (or local equivalent)
4. Copy Client ID & Secret back into Supabase provider config.

## Redirect URLs
Supabase automatically handles OAuth redirect. Ensure these are whitelisted in the Supabase Auth Settings → URL Configuration:
```
http://localhost:3000
https://your-production-domain
```
If using a custom callback path, supply it:
```ts
supabase.auth.signInWithOAuth({
  provider: 'github',
  options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` }
});
```

## Session Management Hook
`hooks/useSupabaseSession.ts` (added in consolidation) exposes live session state.
Returns:
```ts
{
  session: Session | null,
  user: User | null,
  loading: boolean
}
```

## Protecting Routes (Client Side)
Example pattern inside a page component:
```tsx
import { useSupabaseSession } from '@/hooks/useSupabaseSession';
import { redirect } from 'next/navigation';

export default function DashboardPage() {
  const { user, loading } = useSupabaseSession();
  if (loading) return <p>Loading...</p>;
  if (!user) redirect('/');
  return <main>Secure content</main>;
}
```

## Signing Out
```ts
await supabase.auth.signOut();
```
Add this to a nav dropdown (see `NavUserMenu` component in future extraction).

## Server Components & RSC Considerations
- For SSR user context, you can use Supabase helpers (`@supabase/auth-helpers-nextjs`) later if needed.
- Initial phase keeps auth client-only to reduce complexity.

## Authorization (Future)
Planned enhancements:
- Row Level Security (RLS) policies in Supabase
- Role claims (e.g., metadata stored on user)
- Feature flags via a `feature_flags` table

## Migration From Legacy AuthContext
1. Locate any imports from `client/contexts/AuthContext.tsx` (in legacy)
2. Replace with `useSupabaseSession()`
3. Remove custom login/logout handlers now covered by OAuth

---
Document version: v1 (initial auth consolidation guidance)
