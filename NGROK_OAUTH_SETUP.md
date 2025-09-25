# Ngrok Setup for Mobile GitHub OAuth Testing

## 🌍 **Public Access Setup Complete!**

Your application is now accessible worldwide via ngrok:
- **Ngrok URL**: `https://4af482d17f59.ngrok-free.app`
- **Local URL**: `http://localhost:3000`
- **Network URL**: `http://10.20.38.218:3000`

## 📱 **Required Supabase Configuration**

To make GitHub OAuth work with your ngrok URL, you **MUST** add these redirect URLs in your Supabase dashboard:

### Step 1: Access Supabase Dashboard
1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Select your project: `lapgjnimnkyyxeltzcxw`
3. Navigate to **Authentication** → **Settings**

### Step 2: Add Redirect URLs
In the **"Redirect URLs"** section, add all these URLs (one per line):

```
http://localhost:3000/auth/callback
http://10.20.38.218:3000/auth/callback  
https://4af482d17f59.ngrok-free.app/auth/callback
```

### Step 3: Update Site URL (Optional)
You can set the **Site URL** to your ngrok URL:
```
https://4af482d17f59.ngrok-free.app
```

## 🧪 **Testing OAuth on Different Platforms**

### Desktop Testing:
```
http://localhost:3000/login
```

### Mobile on Same Network:
```
http://10.20.38.218:3000/login
```

### Mobile from Anywhere (via ngrok):
```
https://4af482d17f59.ngrok-free.app/login
```

### Public Sharing:
```
https://4af482d17f59.ngrok-free.app
```

## ⚙️ **How It Works**

1. **Environment Detection**: The app automatically detects which URL to use:
   - `NEXT_PUBLIC_SITE_URL` (ngrok) takes priority
   - Falls back to `localhost:3000` for local development
   - Uses `window.location.origin` as final fallback

2. **Dynamic Redirects**: OAuth callbacks automatically redirect to the correct URL based on how you accessed the app

3. **PKCE Flow**: Using secure PKCE authentication flow for mobile-safe OAuth

## 🔒 **Security Notes**

- **ngrok Free Plan**: URLs are temporary and change when you restart ngrok
- **Public Access**: Your dev server is now accessible to anyone with the URL
- **Development Only**: Use this setup only for development/testing

## 🚨 **Important: Update URLs When ngrok Changes**

If you restart ngrok and get a new URL:

1. **Update the environment variable** in `.env.local`:
   ```bash
   NEXT_PUBLIC_SITE_URL="https://YOUR-NEW-NGROK-URL.ngrok-free.app"
   ```

2. **Update Supabase redirect URLs** with the new ngrok URL

3. **Restart your development server**:
   ```bash
   npm run dev
   ```

## 🎯 **Ready to Test!**

Your GitHub OAuth should now work on:
- ✅ Desktop browsers
- ✅ Mobile devices on same network  
- ✅ Mobile devices anywhere in the world
- ✅ Shared with others for testing

Try logging in with GitHub at: `https://4af482d17f59.ngrok-free.app/login`