# Fixing Supabase Real-Time Migration Errors

## Problem
The error `ERROR: 42P01: relation "snippet_likes" does not exist` occurred because the migration file `0005_realtime_functions.sql` was trying to enable RLS and create policies on tables that didn't exist yet.

## Solution

I've created three files to fix this issue:

### 1. **`0004_create_additional_tables.sql`** (Migration #4)
Creates the missing tables:
- `snippet_likes` - Tracks user likes on snippets
- `snippet_comments` - Stores comments on snippets  
- `follows` - Manages user follow relationships

Also adds missing columns to `snippets`:
- `views` (BIGINT)
- `likes` (BIGINT)
- `user_id` (UUID)
- `is_public` (BOOLEAN)

### 2. **`0005_realtime_functions.sql`** (Migration #5 - Updated)
Updated to safely handle cases where tables might not exist:
- Uses `DO $$ ... END $$` blocks with existence checks
- Creates functions for incrementing views, likes, downloads
- Enables RLS only if tables exist
- Creates policies conditionally

### 3. **`COMPLETE_SUPABASE_MIGRATION.sql`** (All-in-One)
This is the **recommended file to use**. It contains everything in the correct order:
- Creates all tables with `IF NOT EXISTS`
- Adds columns conditionally
- Creates indexes
- Updates existing data
- Creates functions
- Enables RLS
- Creates policies
- Grants permissions

## How to Apply the Fix

### Option A: Use the Complete Migration (Recommended)

1. Open Supabase Dashboard
2. Go to SQL Editor
3. Copy and paste the entire contents of `COMPLETE_SUPABASE_MIGRATION.sql`
4. Click "Run"

This script is **idempotent** - safe to run multiple times.

### Option B: Run Migrations in Order

If you prefer to run migrations individually:

1. Run `0004_create_additional_tables.sql` first
2. Then run the updated `0005_realtime_functions.sql`

## What Each Table Does

**`snippet_likes`**
- Links users to snippets they've liked
- Prevents duplicate likes with UNIQUE constraint
- Auto-deletes when snippet is deleted (CASCADE)

**`snippet_comments`**
- Stores user comments on snippets
- Supports nested comments (parent_comment_id)
- Tracks creation and update times

**`follows`**
- Manages follower/following relationships
- Prevents self-follows with CHECK constraint
- Prevents duplicate follows with UNIQUE constraint

## Verification

After running the migration, verify with these queries:

```sql
-- Check tables were created
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- Check snippets columns
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'snippets';

-- Check snippet_likes columns
SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'snippet_likes';

-- Check RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public';
```

## Key Features

✅ **Safe** - Uses `IF NOT EXISTS` and `IF EXISTS` checks  
✅ **Idempotent** - Can run multiple times without errors  
✅ **Complete** - Creates all tables, columns, indexes, functions, and policies  
✅ **Secure** - Enables Row Level Security with proper policies  
✅ **Optimized** - Includes indexes for better query performance  

## Next Steps

After applying the migration:

1. ✅ Verify tables exist
2. ✅ Test snippet uploads
3. ✅ Test real-time features (likes, comments, follows)
4. ✅ Monitor performance

The application should now work correctly with all real-time features! 🚀
