# ✅ Google OAuth Setup Checklist
2. Click on **Google** provider
3. Toggle **Enable Sign in with Google** to ON
4. Enter your credentials:
   - **Client ID (for OAuth):** Your Google OAuth Client ID
   - **Client Secret (for OAuth):** Your Google OAuth Client Secret
5. Click **Save**our Google OAuth Credentials
- **Client ID:** Get from Google Cloud Console
- **Client Secret:** Get from Google Cloud Console  
- **Project ID:** `nth-gasket-474207-s1`

## 🔧 Step-by-Step Configuration

### 1️⃣ Google Cloud Console Setup

**Visit:** https://console.cloud.google.com/apis/credentials?project=nth-gasket-474207-s1

#### Authorized JavaScript Origins:
```
http://localhost:3000
https://codehutcode.vercel.app
```

#### Authorized Redirect URIs (ADD ALL THREE):
```
https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
https://codehutcode.vercel.app/auth/callback
```

**⚠️ CRITICAL:** The first URL (`https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback`) is the **primary OAuth callback** that Supabase uses. This MUST be configured in Google Cloud Console.

---

### 2️⃣ Supabase Dashboard Setup

**Visit:** https://supabase.com/dashboard/project/lapgjnimnkyyxeltzcxw/auth/providers

1. Click on **Google** provider
2. Toggle **Enable Sign in with Google** to ON
3. Enter your credentials:
   - **Client ID (for OAuth):** Your Google OAuth Client ID (from Google Cloud Console)
   - **Client Secret (for OAuth):** Your Google OAuth Client Secret (from Google Cloud Console)
4. Click **Save**

---

### 3️⃣ Supabase URL Configuration

**Visit:** https://supabase.com/dashboard/project/lapgjnimnkyyxeltzcxw/auth/url-configuration

#### Site URL:
```
http://localhost:3000
```

#### Additional Redirect URLs (one per line):
```
http://localhost:3000/auth/callback
https://codehutcode.vercel.app/auth/callback
```

---

### 4️⃣ Local Environment Variables

Your `.env.local` file should contain:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://lapgjnimnkyyxeltzcxw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key-here

# Google OAuth (for local Supabase CLI only)
SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client-id-here
SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-google-client-secret-here

# Site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

✅ **Already configured in your project!**

---

## 🧪 Testing Steps

1. **Restart your dev server:**
   ```powershell
   pnpm dev
   ```

2. **Open login page:**
   ```
   http://localhost:3000/login
   ```

3. **Click "Continue with Google"**
   - You should be redirected to Google's login page
   - Google URL will look like: `https://accounts.google.com/o/oauth2/v2/auth...`

4. **Complete Google login**
   - After successful login with your Google account
   - You'll be redirected to: `https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback`
   - Then automatically redirected to: `http://localhost:3000/dashboard`

5. **Verify authentication:**
   - Check that you see your user profile in the dashboard
   - Open browser DevTools → Application → Local Storage → check for auth token

---

## 🚨 Common Issues & Quick Fixes

### Issue: "redirect_uri_mismatch" error

**Fix:** 
1. Go to Google Cloud Console
2. Make sure **ALL THREE** redirect URIs are added:
   - `https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback` ← **MOST IMPORTANT**
   - `http://localhost:3000/auth/callback`
   - `https://codehutcode.vercel.app/auth/callback`
3. Save and wait 1-2 minutes for Google to update

### Issue: "OAuth sign in not available without Supabase"

**Fix:**
1. Check that `.env.local` has `NEXT_PUBLIC_` prefix on Supabase variables
2. Restart dev server: `pnpm dev`
3. Hard refresh browser: `Ctrl + Shift + R`

### Issue: "Access restricted" or "This app isn't verified"

**Fix:**
1. Go to Google Cloud Console → OAuth consent screen
2. Add your email as a test user
3. OR publish the app (requires verification for production)

### Issue: Popup closes immediately

**Fix:**
1. Check browser console for errors
2. Disable popup blockers
3. Try in incognito mode
4. Clear browser cache and cookies

---

## 📋 Final Verification Checklist

- [ ] Google Cloud Console: Client ID and Secret created
- [ ] Google Cloud Console: All 3 redirect URIs added (especially Supabase callback)
- [ ] Google Cloud Console: JavaScript origins added (localhost + vercel)
- [ ] Supabase Dashboard: Google provider enabled
- [ ] Supabase Dashboard: Client ID and Secret configured
- [ ] Supabase Dashboard: Site URL set to localhost:3000
- [ ] Supabase Dashboard: Redirect URLs added
- [ ] Local `.env.local`: All variables configured with NEXT_PUBLIC_ prefix
- [ ] Dev server restarted after env changes
- [ ] Login page accessible at http://localhost:3000/login
- [ ] "Continue with Google" button visible and clickable
- [ ] Google OAuth flow completes successfully
- [ ] User redirected to dashboard after login

---

## 🎯 Quick Test Command

```powershell
# Stop any running server
# Then restart:
pnpm dev

# Open browser and test:
# http://localhost:3000/login
```

---

## 🔗 Important URLs

- **Google Cloud Console:** https://console.cloud.google.com/apis/credentials?project=nth-gasket-474207-s1
- **Supabase Dashboard:** https://supabase.com/dashboard/project/lapgjnimnkyyxeltzcxw
- **Supabase Auth Providers:** https://supabase.com/dashboard/project/lapgjnimnkyyxeltzcxw/auth/providers
- **Login Page:** http://localhost:3000/login

---

**Note:** The OAuth callback flow is: Google → Supabase (`/auth/v1/callback`) → Your App (`/auth/callback` or `/dashboard`)
