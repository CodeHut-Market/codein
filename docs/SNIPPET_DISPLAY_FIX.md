# Snippet Display Issue Fix

## Problem
Uploaded snippets were displaying incorrect information:
- Author showing as "Anonymous" instead of actual username
- Date showing as "Invalid Date"
- Visibility showing as "Private" incorrectly

## Root Causes Identified

### 1. Missing Database Join for Author Username
**Issue**: Supabase queries were not joining with the `profiles` table to fetch usernames.

**Location**: `server/lib/supabaseClient.ts` - `buildSearchQuery()` function

**Fix**: Updated all Supabase queries to join with profiles table:
```typescript
.select(`
  *,
  profiles:author_id (
    username
  )
`)
```

**Files Modified**:
- `server/lib/supabaseClient.ts` - Added profiles join to buildSearchQuery
- `server/routes/snippets.ts` - Updated getSnippetById and getPopularSnippets to include profiles join

### 2. Incorrect Author Mapping
**Issue**: The `mapSupabaseSnippetToAPI()` function was using `snippet.author` directly instead of the joined username from profiles.

**Location**: `server/lib/supabaseClient.ts` - Line 100

**Before**:
```typescript
author: snippet.author,
```

**After**:
```typescript
author: snippet.profiles?.username || snippet.author || 'Anonymous',
```

### 3. PostgreSQL Mapping Bug
**Issue**: The `mapDbRowToSnippet()` function had a typo where it was checking the same field twice.

**Location**: `server/routes/snippets.ts` - Line 1273

**Before**:
```typescript
author: row.author_username || row.author_username,
```

**After**:
```typescript
author: row.author_username || row.author || 'Anonymous',
```

### 4. TypeScript Interface Update
**Issue**: The SupabaseSnippet interface didn't include the optional profiles field.

**Location**: `server/lib/supabaseClient.ts`

**Added**:
```typescript
export interface SupabaseSnippet {
  // ... existing fields
  profiles?: {
    username: string;
  } | null;
}
```

## Changes Summary

### Files Modified:

1. **`server/lib/supabaseClient.ts`**
   - Updated `SupabaseSnippet` interface to include optional `profiles` field
   - Modified `mapSupabaseSnippetToAPI()` to use `profiles.username` with fallback
   - Updated `buildSearchQuery()` to join with profiles table

2. **`server/routes/snippets.ts`**
   - Fixed `mapDbRowToSnippet()` author field mapping bug
   - Updated `getSnippetById()` to include profiles join in Supabase query
   - Updated `getPopularSnippets()` to include profiles join in Supabase query

3. **`app/lib/repositories/snippetsRepo.ts`** ⭐ **CRITICAL FIX**
   - Updated `listSnippets()` to include profiles join in Supabase query
   - Modified `mapRowToSnippet()` to use `profiles.username` with fallback to 'Anonymous'
   - Updated `getSnippetById()` to include profiles join
   - Updated `listPopular()` to include profiles join

## Testing Checklist

- [x] Server starts without errors
- [ ] Browse snippets page shows correct author names
- [ ] Snippet cards display valid dates
- [ ] Price displays correctly (not showing "Private" for public snippets)
- [ ] Author profile links work correctly
- [ ] Search and filters still function properly

## Date Display Issue

The "Invalid Date" issue should be investigated separately:
- Check if `createdAt` field contains valid ISO date strings
- Verify `new Date(snippet.createdAt).toLocaleDateString()` in SnippetCard.tsx
- Confirm database columns store dates as timestamptz

## Visibility/"Private" Issue

The "Private" text might be:
1. A visibility badge being shown when it shouldn't be
2. The price field not loading, showing undefined/null which might render as "Private"
3. An actual snippet with visibility='private' setting

**Next Steps**:
1. Test the application and verify snippets display correctly
2. Check browser console for any API errors
3. Inspect network requests to confirm author data is being returned
4. Verify dates are in correct format from API

## Related Files
- `client/components/SnippetCard.tsx` - Component that displays snippet info
- `supabase/migrations/0002_security_fixes.sql` - Profiles table schema
- `shared/api.ts` - CodeSnippet interface definition
