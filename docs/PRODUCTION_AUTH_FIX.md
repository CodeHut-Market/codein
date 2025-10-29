# 🚨 URGENT: Fix GitHub OAuth Authentication for Production

## Problem: "localhost refused to connect"
Your site is deployed at `https://codehutcode.vercel.app/` but Supabase is configured for localhost URLs.

## ⚡ IMMEDIATE FIXES NEEDED:

### 1. Update Supabase Dashboard (2 minutes)

Go to: https://supabase.com/dashboard/project/lapgjnimnkyyxeltzcxw/auth/url-configuration

**Site URL:**
```
https://codehutcode.vercel.app
```

**Redirect URLs (replace all existing ones):**
```
https://codehutcode.vercel.app/auth/callback
https://codehutcode.vercel.app/auth/callback?next=/dashboard
https://codehutcode.vercel.app/login
https://codehutcode.vercel.app/signup
http://localhost:3000/auth/callback
```

### 2. Update Vercel Environment Variables (1 minute)

Go to: https://vercel.com/codehut-market/codehutcode/settings/environment-variables

**Update this variable:**
```
NEXT_PUBLIC_SITE_URL = https://codehutcode.vercel.app
```

### 3. Update GitHub OAuth App (1 minute)

Go to: https://github.com/settings/developers

**Update your CodeHut OAuth App:**
- Homepage URL: `https://codehutcode.vercel.app`
- Authorization callback URL: `https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback`

### 4. Redeploy (30 seconds)

After making these changes:
1. Go to Vercel dashboard
2. Trigger a redeploy or push a small change to GitHub

## 🎯 Expected Result:
- ✅ GitHub login will redirect to your live site
- ✅ No more "localhost refused to connect" errors
- ✅ Users can successfully authenticate

## ⚠️ Important Notes:
- Keep localhost URLs in the redirect list for local development
- Always use HTTPS for production URLs
- Changes take effect immediately after saving

---

**Test Steps After Fix:**
1. Go to https://codehutcode.vercel.app/login
2. Click "Sign in with GitHub"
3. Should redirect back to your live site successfully