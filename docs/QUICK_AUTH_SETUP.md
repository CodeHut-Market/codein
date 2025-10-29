## ⚡ Quick Setup Instructions

Based on your current Supabase dashboard screenshot, here's what you need to do **right now** to get authentication working:

### 1. 🛠️ Environment Setup (5 minutes)

1. **Copy the template file:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Get your Supabase keys:**
   - Your project URL: `https://lapgjnimnkyyxeltzcxw.supabase.co`
   - Go to Settings → API in your Supabase dashboard
   - Copy the `anon public` key and `service_role` key

3. **Update `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://lapgjnimnkyyxeltzcxw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

### 2. 🌐 Fix Supabase URLs (2 minutes)

**Current Issues in Your Dashboard:**
- ❌ Site URL shows `localhost:3000` (should be `http://localhost:3000`)
- ❌ Some redirect URLs are incomplete

**What to Fix:**

1. **Site URL** (change this):
   ```
   http://localhost:3000
   ```

2. **Redirect URLs** (replace all with these):
   ```
   http://localhost:3000/auth/callback
   http://localhost:3000/auth/callback?next=/dashboard
   http://10.20.38.218:3000/auth/callback
   https://4af482d17f59.ngrok-free.app/auth/callback
   ```

3. **Remove the problematic URL:**
   - Delete: `http://localhost:3000/auth/callback?code=c9f8e1bc-7c53-4846-8d6c-63e9886e15a0`

### 3. 🔧 GitHub OAuth Setup (3 minutes)

1. **Create GitHub OAuth App:**
   - Go to https://github.com/settings/developers
   - Click "New OAuth App"
   - Fill in:
     ```
     Application name: CodeHut
     Homepage URL: http://localhost:3000
     Authorization callback URL: https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback
     ```

2. **Configure in Supabase:**
   - Go to Authentication → Providers → GitHub
   - Enable GitHub
   - Enter your Client ID and Client Secret
   - Save

### 4. 🚀 Test Everything (1 minute)

1. Start your server:
   ```bash
   pnpm dev
   ```

2. Test authentication:
   - Go to `http://localhost:3000/login`
   - Try GitHub sign-in
   - Should redirect back to your app successfully

---

## 🎯 Expected Results

After following these steps:
- ✅ GitHub OAuth will work
- ✅ Users can sign up/sign in
- ✅ Sessions will persist
- ✅ Authentication works on mobile/ngrok
- ✅ No more "Invalid redirect URL" errors

---

## 🚨 Common Issues & Quick Fixes

**Error: "Invalid redirect URL"**
- Check that the URLs in Supabase exactly match your callback URLs
- Make sure there are no typos or extra spaces

**Error: "Supabase not initialized"**
- Check your `.env.local` file has the correct keys
- Restart your development server: `pnpm dev`

**GitHub OAuth not working:**
- Verify the callback URL in GitHub OAuth app is exactly: `https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback`
- Check that GitHub provider is enabled in Supabase

---

## 🏁 You're Done!

Once you complete these 4 quick steps, your authentication should work perfectly. The login and signup pages are already built and ready to use.

**Next Steps:**
1. Configure password policies in Supabase (optional)
2. Customize email templates (optional)
3. Add production URLs when deploying (later)