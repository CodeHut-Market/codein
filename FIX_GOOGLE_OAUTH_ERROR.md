# 🔧 Fix Google OAuth Error 400: redirect_uri_mismatch

## ❌ Current Error
**Error 400: redirect_uri_mismatch**
- This means the redirect URI that Supabase is sending to Google doesn't match what's configured in your Google Cloud Console.

## ✅ The Solution

You need to add the **exact** Supabase callback URL to your Google Cloud Console.

---

## 🚀 Step-by-Step Fix

### Step 1: Open Google Cloud Console

**Direct Link to Your OAuth Client:**
```
https://console.cloud.google.com/apis/credentials/oauthclient/your-google-client-id-here?project=nth-gasket-474207-s1
```

Or manually:
1. Go to https://console.cloud.google.com/apis/credentials
2. Select project: **nth-gasket-474207-s1**
3. Find your OAuth 2.0 Client ID: **Web client 1** (or similar name)
4. Click the edit icon (pencil) ✏️

---

### Step 2: Add Authorized Redirect URIs

In the **Authorized redirect URIs** section, you MUST add these **exact** URLs:

```
https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
https://codehutcode.vercel.app/auth/callback
```

**⚠️ CRITICAL NOTES:**
- ✅ The **first URL** is the most important: `https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback`
- ✅ Make sure there are **NO trailing slashes**
- ✅ Make sure it's `https://` NOT `http://` for Supabase
- ✅ Make sure it's `/auth/v1/callback` NOT `/auth/callback`

---

### Step 3: Add Authorized JavaScript Origins

In the **Authorized JavaScript origins** section, add:

```
http://localhost:3000
https://codehutcode.vercel.app
```

---

### Step 4: Save and Wait

1. Click **"SAVE"** button at the bottom
2. Wait **1-2 minutes** for Google to propagate the changes
3. Clear your browser cache or use incognito mode

---

## 🧪 Test Again

1. **Restart your dev server** (if not already running):
   ```powershell
   pnpm dev
   ```

2. **Open login page in INCOGNITO/PRIVATE mode:**
   ```
   http://localhost:3000/login
   ```

3. **Click "Continue with Google"**
   - You should now see the Google account picker
   - Select your account
   - You'll be redirected back to your app successfully

---

## 📸 What Your Google Console Should Look Like

### Authorized Redirect URIs:
```
✅ https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback
✅ http://localhost:3000/auth/callback
✅ https://codehutcode.vercel.app/auth/callback
```

### Authorized JavaScript Origins:
```
✅ http://localhost:3000
✅ https://codehutcode.vercel.app
```

---

## 🔍 How to Verify Configuration

### Before Testing:

1. **Check Google Console:**
   - Open: https://console.cloud.google.com/apis/credentials?project=nth-gasket-474207-s1
   - Click on your OAuth client
   - Scroll down to **Authorized redirect URIs**
   - Verify all 3 URLs are listed EXACTLY as shown above

2. **Check Supabase Dashboard:**
   - Go to: https://supabase.com/dashboard/project/lapgjnimnkyyxeltzcxw/auth/providers
   - Verify Google is **ENABLED** (toggle should be ON)
   - Verify Client ID and Secret are filled in

---

## 🚨 Still Getting Error?

### Double-Check These:

1. **Exact URL Match:**
   ```
   ❌ WRONG: https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback/
   ✅ RIGHT: https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback
   
   ❌ WRONG: http://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback
   ✅ RIGHT: https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback
   ```

2. **Wait Time:**
   - After saving in Google Console, wait 1-2 minutes
   - Google needs time to propagate changes

3. **Browser Cache:**
   - Clear browser cache
   - Or use Incognito/Private mode
   - Or try different browser

4. **Supabase Configuration:**
   - Make sure Google provider is ENABLED in Supabase
   - Client ID matches: `your-google-client-id-here`
   - Client Secret matches: `your-google-client-secret-here`

---

## 📋 Quick Checklist

- [ ] Open Google Cloud Console OAuth client settings
- [ ] Add `https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback` to redirect URIs
- [ ] Add `http://localhost:3000/auth/callback` to redirect URIs
- [ ] Add `https://codehutcode.vercel.app/auth/callback` to redirect URIs
- [ ] Add JavaScript origins (localhost and vercel)
- [ ] Click SAVE in Google Console
- [ ] Wait 1-2 minutes
- [ ] Enable Google provider in Supabase Dashboard
- [ ] Clear browser cache or use incognito
- [ ] Test again at http://localhost:3000/login

---

## 🎯 Expected Flow After Fix

1. Click "Continue with Google"
2. Redirected to: `https://accounts.google.com/o/oauth2/v2/auth...`
3. Select Google account
4. Redirected to: `https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback?code=...`
5. Supabase processes authentication
6. Redirected to: `http://localhost:3000/dashboard`
7. ✅ Successfully logged in!

---

## 📞 Need More Help?

If the error persists:
1. Take a screenshot of your Google Cloud Console OAuth client configuration
2. Take a screenshot of Supabase Auth Providers page
3. Check browser console (F12) for any additional errors
4. Check Supabase Auth logs: https://supabase.com/dashboard/project/lapgjnimnkyyxeltzcxw/logs/auth-logs

---

**The key fix:** Add `https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback` to Google Cloud Console → OAuth client → Authorized redirect URIs!
