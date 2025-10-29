# OAuth Deployment Fix Guide

## Problem
When using GitHub OAuth on Vercel deployed site, the redirect URL points to `localhost:3000` instead of your actual domain, causing OAuth to fail in production.

## Solution Steps

### 1. Update Environment Variables

**For Local Development (.env.local):**
```bash
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

**For Vercel Production:**
Go to your Vercel dashboard → Project Settings → Environment Variables and add:
```bash
NEXT_PUBLIC_SITE_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 2. Configure Supabase OAuth Settings

1. Go to your Supabase Dashboard
2. Navigate to Authentication → Settings → URL Configuration
3. Update the redirect URLs to include both local and production URLs:

**Site URL:**
```
https://your-app-name.vercel.app
```

**Redirect URLs (add both):**
```
http://localhost:3000/auth/callback
https://your-app-name.vercel.app/auth/callback
```

### 3. Configure GitHub OAuth App

1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Edit your OAuth App
3. Update the redirect URLs:

**Authorization callback URL:**
```
https://your-project-id.supabase.co/auth/v1/callback
```

### 4. Test the Fix

1. **Local Testing:**
   - Start your dev server: `npm run dev`
   - Test GitHub sign-in on `http://localhost:3000`

2. **Production Testing:**
   - Deploy to Vercel: `vercel --prod`
   - Test GitHub sign-in on your production URL

### 5. Vercel Auto-Detection (Alternative)

If you don't set `NEXT_PUBLIC_SITE_URL`, the code will automatically use `NEXT_PUBLIC_VERCEL_URL` which is set by Vercel automatically. However, setting `NEXT_PUBLIC_SITE_URL` explicitly is recommended for better control.

## Code Changes Made

✅ **Updated AuthContext.tsx:**
- Fixed `signInWithProvider` to use proper redirect URL logic
- Added support for `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_VERCEL_URL`
- Handles both development and production environments

✅ **Updated .env.example:**
- Added `NEXT_PUBLIC_SITE_URL` configuration
- Updated Supabase variable names to match Next.js conventions

## Verification

After implementing these changes, your OAuth flow should work as follows:

1. **Local Development:** `http://localhost:3000` → GitHub OAuth → `http://localhost:3000/auth/callback`
2. **Vercel Production:** `https://your-app.vercel.app` → GitHub OAuth → `https://your-app.vercel.app/auth/callback`

## Troubleshooting

**If OAuth still redirects to localhost:**
1. Clear browser cache and cookies
2. Check Vercel environment variables are set correctly
3. Redeploy your Vercel app after setting environment variables
4. Verify Supabase redirect URLs include your production domain

**If you get "Invalid redirect URI" error:**
1. Double-check GitHub OAuth App callback URL
2. Ensure Supabase redirect URLs match exactly (including trailing slashes)
3. Check that HTTPS is used for production URLs

**Debug Tips:**
- Check browser Network tab for actual redirect URLs being used
- Check Vercel Function logs for any errors in the callback handler
- Test OAuth in private/incognito browser window to avoid cached issues