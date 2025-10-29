# 🔐 Google OAuth Setup Guide

This guide walks you through setting up Google OAuth authentication for your CodeHut application.

## 📋 Prerequisites

- A Google Cloud Console account
- Your Supabase project URL: `https://lapgjnimnkyyxeltzcxw.supabase.co`
- Local development running on `http://localhost:3000`
- Production deployment on `https://codehutcode.vercel.app`

## 🚀 Quick Setup

### Step 1: Configure Google Cloud Console

1. **Visit Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Select your project or create a new one

2. **Create OAuth 2.0 Client ID:**
   - Click **"Create Credentials"** → **"OAuth client ID"**
   - Choose **"Web application"** as application type
   - Give it a name (e.g., "CodeHut OAuth")

3. **Configure Authorized JavaScript Origins:**
   ```
   http://localhost:3000
   https://codehutcode.vercel.app
   https://lapgjnimnkyyxeltzcxw.supabase.co
   ```

4. **Configure Authorized Redirect URIs (CRITICAL):**
   
   Add these **exact** URLs to your Google OAuth Client:
   ```
   https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback
   http://localhost:3000/auth/callback
   https://codehutcode.vercel.app/auth/callback
   ```
   
   **⚠️ IMPORTANT:** The Supabase callback URL (`https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback`) is the primary OAuth redirect that Google will use. Your app URLs are for JavaScript origins only.

5. **Save and Copy Credentials:**
   - Client ID: `your-google-client-id-here`
   - Client Secret: `your-google-client-secret-here`

### Step 2: Configure Supabase Dashboard

1. **Go to Supabase Dashboard:**
   - Visit [Supabase Dashboard](https://supabase.com/dashboard)
   - Select your project: `lapgjnimnkyyxeltzcxw`

2. **Enable Google Provider:**
   - Navigate to **Authentication** → **Providers**
   - Find **Google** and click to expand
   - Toggle **"Enable Google"** to ON

3. **Add Google Credentials:**
   - **Client ID:** `your-google-client-id-here`
   - **Client Secret:** `your-google-client-secret-here`
   - Click **"Save"**

4. **Configure Redirect URLs:**
   - Go to **Authentication** → **URL Configuration**
   - Set **Site URL:** `http://localhost:3000`
   - Add **Redirect URLs:**
     ```
     http://localhost:3000/auth/callback
     https://codehutcode.vercel.app/auth/callback
     ```

### Step 3: Update Local Environment Variables

Your `.env.local` file should contain:

```env
# Supabase Configuration (REQUIRED)
NEXT_PUBLIC_SUPABASE_URL=https://lapgjnimnkyyxeltzcxw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcGdqbmltbmt5eXhlbHR6Y3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2OTMzOTgsImV4cCI6MjA3NDI2OTM5OH0.tcQ6s07MNwvTonr35cXdvOG4QTDuTgrDX4Xqdsp1CNA

# Google OAuth Configuration (REQUIRED for Google Sign-in)
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client-id-here
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-google-client-secret-here

# Site Configuration (REQUIRED for OAuth redirects)
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**⚠️ Important:** After updating `.env.local`, restart your development server.

### Step 4: Test Google OAuth

1. **Start Development Server:**
   ```powershell
   pnpm dev
   ```

2. **Open Login Page:**
   - Navigate to `http://localhost:3000/login`

3. **Click "Continue with Google":**
   - You should be redirected to Google's login page
   - After successful login, you'll be redirected back to your app

4. **Verify Authentication:**
   - Check that you're redirected to `/dashboard`
   - Your user profile should be visible

## 🔧 Troubleshooting

### Error: "OAuth sign in not available without Supabase"

**Cause:** Supabase client is not initialized properly.

**Solution:**
1. Verify environment variables have `NEXT_PUBLIC_` prefix for client-side access
2. Restart your development server
3. Clear browser cache and cookies

### Error: "Invalid redirect URL"

**Cause:** The redirect URL is not whitelisted in Google Console or Supabase.

**Solution:**
1. Double-check all redirect URLs match exactly (including protocol and trailing paths)
2. Ensure URLs are added in both Google Console AND Supabase Dashboard

### Error: "Access denied"

**Cause:** Google OAuth app configuration issue.

**Solution:**
1. Verify your Google OAuth app is in "Production" mode (or add test users in "Testing" mode)
2. Check that your email is authorized to use the OAuth app
3. Review Google Cloud Console OAuth consent screen settings

### OAuth popup closes immediately

**Cause:** Browser popup blocker or configuration issue.

**Solution:**
1. Disable popup blockers for localhost
2. Try in an incognito/private window
3. Check browser console for error messages

## 🌐 Production Deployment

When deploying to production (Vercel):

1. **Update Environment Variables on Vercel:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://lapgjnimnkyyxeltzcxw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxhcGdqbmltbmt5eXhlbHR6Y3h3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg2OTMzOTgsImV4cCI6MjA3NDI2OTM5OH0.tcQ6s07MNwvTonr35cXdvOG4QTDuTgrDX4Xqdsp1CNA
   NEXT_PUBLIC_SITE_URL=https://codehutcode.vercel.app
   SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client-id-here
   SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-google-client-secret-here
   ```

2. **Update Supabase Site URL:**
   - In Supabase Dashboard → Authentication → URL Configuration
   - Change Site URL to: `https://codehutcode.vercel.app`

3. **Verify Google Console:**
   - Ensure production URLs are in Authorized origins and redirect URIs
   - Redeploy your Vercel app

## ✅ Verification Checklist

- [ ] Google OAuth Client ID created in Google Cloud Console
- [ ] Authorized JavaScript origins configured (localhost + production)
- [ ] Authorized redirect URIs configured (localhost + production + Supabase)
- [ ] Google provider enabled in Supabase Dashboard
- [ ] Client ID and Secret added to Supabase
- [ ] Environment variables set in `.env.local`
- [ ] Development server restarted
- [ ] Login page shows "Continue with Google" button
- [ ] Google OAuth flow completes successfully
- [ ] User is redirected to dashboard after login
- [ ] Production environment variables configured on Vercel

## 📚 Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)

## 🆘 Getting Help

If you encounter issues:
1. Check browser console for error messages
2. Review Supabase Auth logs in the dashboard
3. Verify all URLs match exactly (case-sensitive)
4. Test in an incognito window to rule out cache issues
5. Check that both GitHub and Google OAuth are working independently

---

**Note:** The Google OAuth credentials provided above are already configured in your Google Cloud Console. Make sure they match exactly in all configuration files.
