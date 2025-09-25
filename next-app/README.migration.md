# CodeHut Next.js Migration

This document tracks the migration from the legacy Vite + Express implementation to Next.js (App Router).

## Goals
- Unify frontend + API with Next.js
- Preserve existing UI patterns (shadcn-inspired, Tailwind design tokens)
- Gradually port business logic (snippets, auth, payments, analytics)

## Status Snapshot
| Area | Status | Notes |
|------|--------|-------|
| Scaffold | ✅ | Next 14 App Router
| Core UI primitives | ✅ | button, badge, input, card, tabs, dialog
| Theming | ✅ | Client theme context with persistence
| Auth (stub) | ✅ | Placeholder login/logout in context
| Routes (marketing + dashboard) | ✅ | Placeholders for features
| Charts | ✅ | Sales + Revenue + Overview stats (stub data)
| API routes | ✅ | /api/ping, /api/demo, /api/razorpay (stub)
| Snippet domain | 🚧 | Not yet ported
| Payments | 🚧 | Razorpay stub only
| Favorites / Explore / Search | 🚧 | Pending domain migration

## Directory Layout
```
next-app/
  app/
    (marketing)/page.tsx      Marketing landing
    dashboard/page.tsx        Authenticated dashboard (stub)
    snippets/[id]/page.tsx    Snippet detail placeholder
    api/                      Route handlers
  components/ui/              Ported UI primitives
  contexts/                   Theme + Auth contexts
  lib/                        Utilities (cn)
```

## Running Locally
```
cd next-app
pnpm install
pnpm dev
# open http://localhost:3100
```

## Theming
- Stored in `localStorage: theme`
- Respects system preference on first load

## Auth Stub
Located in `contexts/auth-context.tsx` – replace with real auth (JWT / OAuth / etc). Provide `login` and `logout` implementations and populate `user` shape.

## API Routes
- `GET /api/ping` health check
- `GET /api/demo` example response
- `POST /api/razorpay` stub for future payment order creation

## Next Migration Steps
1. Port snippet list + filtering logic
2. Implement snippet create/update API routes
3. Integrate real database (Prisma + Neon / PlanetScale / Supabase)
4. Replace auth stub with real provider (Clerk/Auth.js/custom)
5. Payment flow: Implement order creation + webhook handling
6. Analytics: Port existing charts with live data
7. Add error boundaries + loading states (loading.tsx, error.tsx per route)
8. Remove legacy Vite app only after feature parity & sign-off

## Decommission Plan (Draft)
- Phase 1: Dual-run (legacy + next) for QA
- Phase 2: Proxy selective traffic to Next
- Phase 3: Data backfill & webhook verification
- Phase 4: Cutover DNS / hosting
- Phase 5: Archive legacy repo snapshot

## Tech Notes
- Using `typedRoutes` experiment (optional)
- Radix UI components added individually; add more as needed
- Tailwind tokens mirrored from original project for consistent branding

## Contributing During Migration
- New features should target Next.js unless they patch production-only issues in legacy app
- Avoid copying unvetted legacy utilities; rewrite with improved typing when porting

---
Migration owner: (add name)
Last updated: (update when changes occur)
