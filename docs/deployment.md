# Deployment Checklist

## 1. Prerequisites
- Supabase project created
- GitHub OAuth enabled (and Google if desired)
- Environment variables set locally & in hosting provider

## 2. Required Environment Variables
```bash
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...        # (only if using server actions with elevated access)
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NODE_ENV=production
```

## 3. Local Development
```bash
pnpm install
pnpm dev
```
App runs (default) on: http://localhost:3000

## 4. Production Build
```bash
pnpm build
pnpm start
```

## 5. Hosting Options
| Platform | Notes |
|----------|-------|
| Vercel   | Simplest for Next.js; just add env vars |
| Netlify  | Use Next.js adapter; ensure edge functions not required initially |
| Render   | Supply `pnpm build` then `pnpm start` |
| Custom Node | Use `pnpm build` and serve `.next/standalone` (optional optimization) |

## 6. Redirect / Callback URLs (Supabase)
Add to Supabase Auth → URL Configuration:
```
http://localhost:3000
https://your-domain.com
```
If using custom callback: `https://your-domain.com/auth/callback`

## 7. Health Verification
- Visit landing page (theme loads, no hydration warnings)
- Click GitHub login → returns authenticated
- Session persists on hard refresh
- Sign out works

## 8. Optional Hardening
- Enable RLS policies on tables
- Add rate limiting (middleware) for API routes
- Turn on email confirmations if using email auth
- Configure logging / analytics (PostHog / Sentry)

## 9. Monitoring Post-Deploy
| Concern | Tool |
|---------|------|
| Errors | Sentry |
| Performance | Lighthouse / Web Vitals |
| Auth Anomalies | Supabase Auth Logs |
| DB Slow Queries | Supabase Analytics |

## 10. Rollback Plan
- Keep last successful build artifact (Vercel automatic)
- Maintain schema migration scripts under version control
- Use Supabase point-in-time recovery if on appropriate tier

---
Version: v1 initial deployment guide.
