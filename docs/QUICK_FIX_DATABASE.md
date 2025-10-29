# 🚨 URGENT: Fix Database Schema

## Current Issue

Your app is crashing because these columns are missing from your `snippets` table:
- ❌ `category`
- ❌ `visibility`
- ❌ `allow_comments`
- ❌ `featured`

## Quick Fix (Copy & Paste into Supabase)

### Step 1: Open Supabase SQL Editor

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click **"SQL Editor"** in the sidebar
4. Click **"New Query"**

### Step 2: Run This SQL

**Copy and paste this entire block:**

```sql
-- Add missing columns to snippets table
ALTER TABLE public.snippets 
  ADD COLUMN IF NOT EXISTS category TEXT,
  ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public' NOT NULL,
  ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true NOT NULL,
  ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false NOT NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_snippets_category ON public.snippets(category);
CREATE INDEX IF NOT EXISTS idx_snippets_visibility ON public.snippets(visibility);
CREATE INDEX IF NOT EXISTS idx_snippets_featured ON public.snippets(featured);

-- Update any existing rows
UPDATE public.snippets 
SET 
  visibility = COALESCE(visibility, 'public'),
  allow_comments = COALESCE(allow_comments, true),
  featured = COALESCE(featured, false)
WHERE visibility IS NULL OR allow_comments IS NULL OR featured IS NULL;
```

### Step 3: Click "Run"

You should see: **"Success. No rows returned"** ✅

### Step 4: Restart Your Dev Server

Stop the current server (Ctrl+C in terminal) and restart:

```bash
pnpm dev
```

## ✅ Verification

The errors should be **gone**! You should see:
```
✓ Ready in 3.3s
✓ Compiled successfully
```

Instead of:
```
❌ column snippets.category does not exist
```

## What This Does

- ✅ Adds `category` column (for organizing snippets by type)
- ✅ Adds `visibility` column (public/private/unlisted)
- ✅ Adds `allow_comments` column (enable/disable comments)
- ✅ Adds `featured` column (highlight popular snippets)
- ✅ Creates indexes (makes queries faster)
- ✅ Sets default values for existing data

## After This Fix

Your upload system will work perfectly:
1. Advanced upload will store all data ✅
2. Explore page will load without errors ✅
3. API endpoints will work correctly ✅
4. No more "column does not exist" errors ✅

---

**Takes 30 seconds** • Safe to run multiple times • No data loss
