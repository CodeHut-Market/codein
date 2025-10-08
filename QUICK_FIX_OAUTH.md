# 🎯 Quick Fix: Google OAuth redirect_uri_mismatch

## The Problem
Google is rejecting the OAuth request because the redirect URI doesn't match.

## The Solution (2 Minutes)

### 1️⃣ Open Google Cloud Console

**Click this direct link:**
```
https://console.cloud.google.com/apis/credentials/oauthclient/your-google-client-id-here?project=nth-gasket-474207-s1
```

This will open your OAuth client directly.

### 2️⃣ Add the Supabase Callback URL

Scroll down to **"Authorized redirect URIs"** section.

Click **"+ ADD URI"** button and add these 3 URLs one by one:

```
https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
https://codehutcode.vercel.app/auth/callback
```

**CRITICAL:** The first URL must be EXACTLY:
- Start with `https://` (not http)
- End with `/callback` (not `/callback/`)
- Path must be `/auth/v1/callback` (not `/auth/callback`)

### 3️⃣ Save

1. Scroll to bottom
2. Click **"SAVE"** button
3. Wait 1 minute for Google to update

### 4️⃣ Test

1. Open **NEW INCOGNITO WINDOW**
2. Go to: `http://localhost:3000/login`
3. Click "Continue with Google"
4. Should work now! ✅

---

## ✅ After Adding URLs, Your Config Should Show:

**Authorized JavaScript origins:**
- `http://localhost:3000`
- `https://codehutcode.vercel.app`

**Authorized redirect URIs:**
- `https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback` ← **MOST IMPORTANT**
- `http://localhost:3000/auth/callback`
- `https://codehutcode.vercel.app/auth/callback`

---

## 🚨 Common Mistakes to Avoid

❌ **WRONG:**
```
http://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback  (http instead of https)
https://lapgjnimnkyyxeltzcxw.supabase.co/auth/callback    (missing /v1)
https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback/ (trailing slash)
```

✅ **CORRECT:**
```
https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback
```

---

## 📱 Alternative: Manual Navigation

If the direct link doesn't work:

1. Go to https://console.cloud.google.com
2. Select project: **nth-gasket-474207-s1**
3. Click menu → **APIs & Services** → **Credentials**
4. Under **OAuth 2.0 Client IDs**, click on your web client
5. Add the redirect URIs as shown above
6. Save

---

## Need Help?

If still not working:
1. Make sure you clicked SAVE in Google Console
2. Wait 1-2 minutes after saving
3. Use incognito/private browser window
4. Check `FIX_GOOGLE_OAUTH_ERROR.md` for detailed troubleshooting

---

**TL;DR:** Add `https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback` to Google Cloud Console OAuth client redirect URIs!
