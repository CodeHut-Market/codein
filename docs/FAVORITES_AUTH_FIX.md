# 🔧 Favorites Authentication Fix

## Problem Description

Users were seeing the "Sign in to view favorites" dialog even after successfully signing in with Google/GitHub OAuth. The favorites page was not recognizing authenticated users.

## Root Cause Analysis

### 1. **Token Storage Mismatch**
- Supabase stores the session in `localStorage` with key `sb-auth-token`
- API was looking for cookie named `sb-access-token`
- The session token was never being sent from client to server

### 2. **No Authorization Header**
- The favorites page was making API calls with `credentials: 'include'` but not sending the actual access token
- Server couldn't verify user authentication

### 3. **No Auth State Listener**
- Page didn't listen for auth state changes
- User would sign in but page wouldn't automatically refresh

## Solutions Implemented

### ✅ 1. Updated API Routes (`app/api/favorites/route.ts`)

**Changes Made:**
- Created `createServerSupabaseClient()` helper function
- Updated authentication logic to check multiple sources:
  - Authorization header (`Bearer token`)
  - Multiple cookie names (`sb-access-token`, `sb-auth-token`, `supabase-auth-token`)
  - Supabase session via `getSession()`
- Changed from regular Supabase client to `supabaseAdmin` (service role) for database operations
- Added `authenticated: true/false` flag in responses

**Code Pattern:**
```typescript
// Get auth header or cookie
const authHeader = request.headers.get('Authorization');
const cookieStore = cookies();

const possibleTokens = [
  cookieStore.get('sb-access-token'),
  cookieStore.get('sb-auth-token'),
  cookieStore.get('supabase-auth-token')
].filter(Boolean);

let token = authHeader?.replace('Bearer ', '');

if (!token && possibleTokens.length > 0) {
  token = possibleTokens[0]?.value;
}

if (!token) {
  const supabase = createServerSupabaseClient(request);
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    token = session.access_token;
  }
}

// Verify user with admin client
const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
```

### ✅ 2. Updated Favorites Page (`app/favorites/page.tsx`)

**Changes Made:**
- Import Supabase client dynamically
- Check for active session before making API calls
- Send `Authorization: Bearer {token}` header with requests
- Add auth state change listener
- Auto-reload favorites when user signs in
- Clear favorites when user signs out

**Before:**
```typescript
const response = await fetch('/api/favorites', {
  credentials: 'include'
})
```

**After:**
```typescript
const { supabase } = await import('@/lib/supabaseClient')
const { data: { session } } = await supabase.auth.getSession()

if (!session) {
  setShowSignInDialog(true)
  return
}

const response = await fetch('/api/favorites', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json',
  },
  credentials: 'include'
})
```

### ✅ 3. Added Real-time Auth Listener

**Changes Made:**
- Subscribe to Supabase auth state changes
- Reload favorites on `SIGNED_IN` event
- Show sign-in dialog on `SIGNED_OUT` event

**Code:**
```typescript
useEffect(() => {
  loadFavorites()

  const setupAuthListener = async () => {
    const { supabase } = await import('@/lib/supabaseClient')
    if (!supabase) return

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in, reloading favorites')
        loadFavorites()
      } else if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        setShowSignInDialog(true)
        setFavorites([])
      }
    })

    return () => subscription.unsubscribe()
  }

  setupAuthListener()
}, [])
```

## Files Modified

### 1. `app/api/favorites/route.ts`
- ✅ GET method - Fetch favorites
- ✅ POST method - Add to favorites  
- ✅ DELETE method - Remove from favorites

### 2. `app/favorites/page.tsx`
- ✅ `loadFavorites()` function - Added session check and auth header
- ✅ `useEffect()` hook - Added auth state listener

## Testing Checklist

### ✅ Authentication Flow
- [x] Sign in with Google OAuth → Favorites page loads correctly
- [x] Sign in with GitHub OAuth → Favorites page loads correctly
- [x] Sign in with Email/Password → Favorites page loads correctly
- [x] Sign out → Shows sign-in dialog
- [x] Direct navigation to /favorites when signed in → Shows favorites
- [x] Direct navigation to /favorites when not signed in → Shows dialog

### ✅ API Endpoints
- [x] GET /api/favorites - Returns favorites for authenticated user
- [x] GET /api/favorites - Returns 401 for unauthenticated user
- [x] POST /api/favorites - Adds snippet to favorites
- [x] DELETE /api/favorites - Removes snippet from favorites

### ✅ Real-time Updates
- [x] Sign in on different tab → Favorites refresh automatically
- [x] Sign out on different tab → Shows sign-in dialog
- [x] Add favorite → Updates immediately

## Security Improvements

1. **Multiple Token Sources**: API checks Authorization header, cookies, and session
2. **Service Role Key**: Uses `supabaseAdmin` for database operations (bypasses RLS issues)
3. **Token Validation**: Verifies token with `getUser()` before allowing access
4. **Proper Error Handling**: Returns 401 for auth failures with clear messages

## User Experience Improvements

1. **Seamless Login**: Page automatically loads favorites after sign-in
2. **Clear Feedback**: Shows loading state, error messages, empty states
3. **No Page Refresh**: Auth state changes handled without page reload
4. **Beautiful Dialog**: Opaque, accessible sign-in dialog with clear CTAs

## Environment Requirements

Make sure these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## How to Test

1. **Start Development Server**:
   ```bash
   pnpm dev
   ```

2. **Test Anonymous User**:
   - Open http://localhost:3000/favorites
   - Should see "Sign in to view favorites" dialog
   - Click "Sign In Now" → Redirects to /login

3. **Test Authenticated User**:
   - Sign in with Google/GitHub/Email
   - Navigate to /favorites
   - Should see your favorites (or empty state if none)
   - No sign-in dialog should appear

4. **Test API Directly**:
   ```bash
   # Without auth - should get 401
   curl http://localhost:3000/api/favorites
   
   # With auth token
   curl -H "Authorization: Bearer YOUR_TOKEN" http://localhost:3000/api/favorites
   ```

## Success Metrics

✅ **Before Fix**:
- Users see sign-in dialog even when authenticated
- API returns 401 because token not found
- No auto-refresh on auth state change

✅ **After Fix**:
- Authenticated users see their favorites immediately
- API successfully validates tokens from multiple sources
- Page auto-refreshes when user signs in/out

## Future Enhancements

- [ ] Add middleware for global auth handling
- [ ] Implement token refresh logic
- [ ] Add rate limiting to favorites API
- [ ] Cache favorites in localStorage for offline access
- [ ] Add optimistic updates when adding/removing favorites

## Related Documentation

- [Google OAuth Setup](./GOOGLE_OAUTH_SETUP.md)
- [Favorites System Guide](./FAVORITES_SYSTEM_GUIDE.md)
- [Authentication Status](./AUTH_STATUS.md)

---

**Issue Resolved**: Users can now access favorites page after signing in ✅  
**Tested On**: Local development (localhost:3000)  
**Date**: 2025-01-09  
**Status**: ✅ FIXED
