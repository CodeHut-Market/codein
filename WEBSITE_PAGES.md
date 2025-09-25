# Website Structure

## Pages Available

### Public Pages
- **`/`** - Landing page with "Build. Share. Ship." marketing content
- **`/login`** - Login page with GitHub/Google OAuth (now with your custom background)
- **`/signup`** - User registration
- **`/pricing`** - Pricing information
- **`/docs`** - Documentation
- **`/community`** - Community page

### User Pages (likely need auth)
- **`/explore`** - Browse/discover content
- **`/favorites`** - User's favorited items
- **`/upload`** - Upload new content
- **`/snippet/[id]`** - Individual snippet/content view

### Special Routes
- **`/auth/`** - Authentication callback routes (for OAuth)
- **`/api/`** - API endpoints

## Current Status
✅ **Root `/`** now shows the landing page (no longer login)  
✅ **`/login`** has your custom background image  
✅ **GitHub/Google OAuth** buttons are wired to Supabase  

## Next Steps
Most of these pages probably need:
1. Session-aware navigation (show user avatar when logged in)
2. Route guards (redirect to login if not authenticated)
3. Integration with your Supabase data

## To Test Your Site
1. Visit `http://localhost:3000/` - Should show landing page
2. Click "Get Started" → Goes to `/login`
3. Try other routes like `/explore`, `/upload`, `/pricing`

Let me know which pages you want me to enhance or if any are missing!