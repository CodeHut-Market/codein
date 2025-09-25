# Mobile Authentication Setup Guide

## Current Issue
When you try to login with GitHub on your mobile device, you get an "access denied" error because your phone cannot access `localhost:3000`.

## What I've Fixed in the Code
1. ✅ Updated the authentication flow to use dynamic redirect URLs
2. ✅ Added proper OAuth callback handling with `/auth/callback` route
3. ✅ Modified the dev server to be accessible from mobile devices
4. ✅ Added error handling for failed authentication attempts

## What You Need to Configure in Supabase Dashboard

### Step 1: Access Your Supabase Project
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Sign in and select your project

### Step 2: Update Authentication Settings
1. Navigate to **Authentication** > **Settings** in the sidebar
2. Scroll down to **Site URL** section
3. Add these URLs to **Redirect URLs** (one per line):

```
http://localhost:3000/auth/callback
http://10.20.38.218:3000/auth/callback
```

### Step 3: Update Site URL (if needed)
In the **Site URL** field, you can keep it as `http://localhost:3000` or change it to your IP address if you prefer.

## How to Test Mobile Authentication

### Step 1: Start the Server
```bash
npm run dev
```

The server will now be accessible from mobile devices on your network.

### Step 2: Access from Mobile
On your mobile device, open your browser and go to:
```
http://10.20.38.218:3000/login
```

### Step 3: Test GitHub OAuth
Click "Continue with GitHub" on your mobile device. It should now work properly!

## Troubleshooting

### If you still get "access denied":
1. Double-check that you added both redirect URLs in Supabase
2. Make sure your mobile device is on the same WiFi network as your computer
3. Try clearing your browser cache on mobile
4. Check that Windows Firewall isn't blocking port 3000

### If your IP address changes:
Your computer's IP address might change. If so, run this command to get the new IP:
```bash
ipconfig | findstr IPv4
```

Then update the Supabase redirect URLs with the new IP address.

## Production Deployment
When you deploy to production (Netlify, Vercel, etc.), the authentication will automatically use the production domain instead of IP addresses.

## Network Security Note
The server is now accessible from your local network. This is safe for development, but make sure you're on a trusted network.