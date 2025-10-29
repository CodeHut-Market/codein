# 🔐 Authentication Setup Guide

This guide will help you set up authentication properly for your CodeHut application using Supabase.

## 📋 Prerequisites

1. **Supabase Project**: You need a Supabase project (which you already have based on the screenshot)
2. **GitHub OAuth App**: For GitHub authentication
3. **Environment Variables**: Proper configuration

## 🛠️ Step 1: Configure Environment Variables

1. **Copy the environment template:**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Get your Supabase credentials:**
   - Go to [Supabase Dashboard](https://app.supabase.com)
   - Select your project: `lapgjnimnkyyxeltzcxw`
   - Navigate to **Settings** → **API**
   - Copy the following values:

3. **Update your `.env.local` file:**
   ```env
   # Required Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=https://lapgjnimnkyyxeltzcxw.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_from_supabase_dashboard
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_from_supabase_dashboard

   # Site Configuration
   NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Change to your production URL when deploying
   NODE_ENV=development
   ```

## 🌐 Step 2: Configure Supabase URLs (Based on Your Screenshot)

You need to update the URLs in your Supabase dashboard:

### **Current Configuration Issues:**
- ❌ Site URL is set to `localhost:3000` (needs to be full URL)
- ❌ Missing production URLs in redirect URLs
- ❌ Some URLs don't have proper callback paths

### **Recommended Configuration:**

#### **Site URL:**
```
http://localhost:3000
```

#### **Redirect URLs** (add all of these):
```
http://localhost:3000/auth/callback
http://localhost:3000/auth/callback?next=/dashboard
http://10.20.38.218:3000/auth/callback
https://your-production-domain.com/auth/callback
https://your-netlify-subdomain.netlify.app/auth/callback
```

### **How to Update:**
1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Scroll to **URL Configuration**
3. Update the **Site URL** field
4. In **Redirect URLs**, add each URL on a separate line
5. Click **Save**

## 🔧 Step 3: Set Up GitHub OAuth

1. **Go to GitHub Developer Settings:**
   - Visit: https://github.com/settings/developers
   - Click "New OAuth App"

2. **Configure OAuth App:**
   ```
   Application name: CodeHut
   Homepage URL: http://localhost:3000 (or your production domain)
   Authorization callback URL: https://lapgjnimnkyyxeltzcxw.supabase.co/auth/v1/callback
   ```

3. **Get Credentials:**
   - Copy the **Client ID** and **Client Secret**

4. **Configure in Supabase:**
   - Go to **Supabase Dashboard** → **Authentication** → **Providers**
   - Enable **GitHub**
   - Enter your Client ID and Client Secret
   - Save

## � Step 4: Set Up Google OAuth

1. **Create a Google Cloud OAuth Client:**
   - Visit the [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
   - Choose **OAuth client ID** → **Web application**
   - Add the following Authorized redirect URIs:
     - `http://localhost:3000/auth/callback`
     - `https://codehutcode.vercel.app/auth/callback`
     - `https://<your-supabase-project>.supabase.co/auth/v1/callback` (replace with your Supabase URL)
   - Add the following Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://codehutcode.vercel.app`

2. **Configure Supabase Provider:**
   - Go to **Supabase Dashboard** → **Authentication** → **Providers** → **Google**
   - Enable the provider and paste the Client ID and Client Secret
   - For local CLI usage, the same credentials can be set via environment variables:
     ```env
     SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client-id-here
     SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-google-client-secret-here
     ```
   - Save the provider configuration

3. **Update `.env.local`:**
   ```env
   SUPABASE_AUTH_EXTERNAL_GOOGLE_CLIENT_ID=your-google-client-id-here
   SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET=your-google-client-secret-here
   ```
   Restart the dev server after updating environment variables.

4. **Verify redirect URLs:**
   - In Supabase, under **Authentication → URL Configuration**, ensure the site URL and redirect URLs from Step 2 are present
   - In Google Cloud Console, ensure the same URLs are whitelisted

## �🚀 Step 5: Test Authentication

1. **Start your development server:**
   ```bash
   pnpm dev
   ```

2. **Test the authentication flow:**
   - Go to `http://localhost:3000/login`
   - Try GitHub authentication
   - Try email/password authentication (if users are registered)

## 🏗️ Step 6: Create a Signup Page

Let me create a proper signup page for your application.

## 🔐 Step 7: Configure Authentication Security

Based on our security implementation, you should also configure:

1. **Password Policies** (in Supabase Dashboard):
   - Minimum length: 8-12 characters
   - Require mixed case, numbers, and special characters
   
2. **Email Confirmation**:
   - Enable email confirmation for new signups
   
3. **Rate Limiting**:
   - Configure rate limits for auth endpoints

## 📝 Step 8: Update Email Templates

1. Go to **Supabase Dashboard** → **Authentication** → **Email Templates**
2. Customize the confirmation and reset password emails
3. Make sure the redirect URLs in emails point to your correct domains

## 🌍 Step 9: Production Deployment

When deploying to production:

1. **Update environment variables:**
   ```env
   NEXT_PUBLIC_SITE_URL=https://your-production-domain.com
   NODE_ENV=production
   ```

2. **Update Supabase redirect URLs:**
   - Add your production domain to the redirect URLs list
   - Update the Site URL to your production URL

3. **Update GitHub OAuth App:**
   - Update the Homepage URL to your production domain
   - The callback URL stays the same (Supabase handles this)

## 🚨 Common Issues & Solutions

### **Issue 1: "Invalid redirect URL" error**
- **Solution**: Make sure the redirect URL is exactly listed in your Supabase configuration
- Check for typos, missing `http://` or `https://`, trailing slashes

### **Issue 2: OAuth popup closed without completing**
- **Solution**: Check browser popup blockers
- Ensure the OAuth app is properly configured in GitHub

### **Issue 3: "Access denied" after OAuth**
- **Solution**: Verify the OAuth callback URL matches Supabase's expected format
- Check that the OAuth provider is enabled in Supabase

### **Issue 4: Environment variables not working**
- **Solution**: Restart your development server after changing `.env.local`
- Make sure variable names start with `NEXT_PUBLIC_` for client-side access

## ✅ Final Checklist

Before going to production, ensure:

- [ ] Environment variables are set correctly
- [ ] Supabase URLs are configured properly
- [ ] GitHub OAuth is working
- [ ] Email confirmation is enabled
- [ ] Password policies are configured
- [ ] Production URLs are added to redirect URLs
- [ ] Email templates are customized
- [ ] Authentication flow works end-to-end
- [ ] Sign out functionality works
- [ ] Error handling is implemented

## 🆘 Getting Help

If you encounter issues:
1. Check the browser console for errors
2. Check Supabase Dashboard → Logs for authentication errors  
3. Verify all URLs exactly match between GitHub, Supabase, and your application
4. Test in an incognito window to avoid cookie/session conflicts

---

**Note**: The login page has been updated to properly handle email/password authentication. Make sure to test both OAuth and email/password flows after configuration.
