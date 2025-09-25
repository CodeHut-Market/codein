# Architecture Overview

## Goal
Converge the codebase on a single Next.js App Router application with Supabase for auth & persistence, TailwindCSS for styling, and a modular, documented structure.

## Current State (Pre-Consolidation)
- `app/` – Active Next.js App Router UI (landing + auth)
- `client/` – Legacy Vite + React SPA (to be archived)
- `server/` – Legacy Express server (remove or port endpoints to Next.js route handlers)
- `next components/` – Collection of example / experimental Next.js component bundles (prune & extract what is needed)
- `netlify/` – Functions setup (likely unnecessary once fully Next.js unless specific edge/serverless function behavior remains)
- `shared/` – Shared TypeScript types

## Target Structure
```
app/                # Next.js routes (App Router)
components/         # Shared UI + domain components
  ui/               # Reusable primitives (buttons, inputs, etc.)
  layout/           # Nav, footer, shells
  feature/          # Feature-specific composite components
hooks/              # Reusable hooks (useSupabaseSession, useTheme, etc.)
lib/                # Supabase client, utilities, config helpers
shared/             # Cross-project types (kept)
styles/             # Global styles + tailwind extensions (optional move of globals)
docs/               # Documentation (architecture, auth, deployment, theming, roadmap)
legacy/             # Archived previous stacks (client/, server/, netlify/, examples)
```

## Design Principles
1. **Single Source of Truth for Auth** – Supabase session hook replaces legacy AuthContext.
2. **Feature Isolation** – Group feature code (e.g., `snippets/`, `notifications/`) to ease scaling.
3. **Progressive Schema Tolerance** – Repository layer handles snake_case / camelCase drift gracefully.
4. **Resilient Theming** – Pre-hydration inline script ensures no flash-of-wrong-theme.
5. **Minimal Surface** – Remove unused infra (Express, Netlify functions) unless a requirement exists.

## Auth Flow (GitHub OAuth)
```
User clicks GitHub → supabase.auth.signInWithOAuth → Supabase hosted flow → redirect back → supabase.auth.getSession() resolves → onAuthStateChange listener updates React state → UI reacts (show dashboard/logout)
```

## Supabase Client Pattern
- Centralized in `lib/supabaseClient.ts` exporting a singleton.
- Avoid re-instantiation (prevents multiple listeners & memory leaks).
- Hook `useSupabaseSession` wraps subscription logic and returns `{ session, user, loading }`.

## Theming Strategy
- Inline script sets initial className (`dark` or `light`) before hydration.
- React context manages runtime changes; avoids SSR mismatch with a `mounted` flag.

## Deployment Model
- Preferred: Deploy as a full Next.js app (Vercel, Netlify adapter, or custom Node).
- Database & Auth: Supabase hosted.
- No separate Express layer unless specialized middleware needed.

## Cleanup Tasks (Sequenced)
1. Create `legacy/` and move: `client/`, `server/`, `netlify/`, `next components/`.
2. Add `hooks/useSupabaseSession.ts` and refactor pages.
3. Extract reusable UI primitives to `components/ui/`.
4. Add nav avatar with sign-out.
5. Write additional docs (`auth.md`, `deployment.md`, `theming.md`).

## Future Enhancements
- Role-based route guards.
- Edge runtime for select routes (auth-light endpoints).
- Analytics abstraction.
- Automated DB migrations pipeline.

---
Document updated: Initial consolidated architecture description.
