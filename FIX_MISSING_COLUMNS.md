# 🔧 Fix: Missing Database Columns

## Problem
Your app is looking for columns that don't exist in your Supabase database:
- `category` ❌
- `visibility` ❌
- `allow_comments` ❌
- `featured` ❌

## Quick Fix (2 minutes)

### Option 1: Automatic (Preferred)

**Run this command:**
```bash
node run-migration.js
```

This will automatically add all missing columns to your database.

### Option 2: Manual (If automatic fails)

1. **Go to Supabase Dashboard:**
   - Visit https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New Query"

3. **Copy & Paste:**
   - Open `add-missing-columns.sql` (in this folder)
   - Copy all the SQL code
   - Paste into the SQL Editor

4. **Run:**
   - Click "Run" button
   - Wait for success message ✅

## What Gets Added

```sql
-- New columns:
category          TEXT              (nullable, for categorizing snippets)
visibility        TEXT              (default: 'public', for access control)
allow_comments    BOOLEAN           (default: true, for comment settings)
featured          BOOLEAN           (default: false, for highlighting snippets)

-- New indexes (for performance):
idx_snippets_category
idx_snippets_visibility
idx_snippets_featured
```

## After Migration

**Restart your dev server:**
```bash
# Stop the current server (Ctrl+C)
pnpm dev
```

The errors should be gone! ✅

## Verify It Worked

Run this test:
```bash
node test-upload-simple.js
```

You should see all tests pass without any column errors.

## What If It Still Fails?

Check the error in your terminal. If you see:
- `column does not exist` → Migration didn't run, try Option 2 (manual)
- `RPC not available` → Use Option 2 (manual SQL editor)
- Something else → Share the error message

## Full Schema After Migration

Your `snippets` table will have:
```
id               uuid
title            text
code             text
description      text
language         text
framework        text
tags             text[]
price            numeric
rating           int
author           text
author_id        text
downloads        int
created_at       timestamptz
updated_at       timestamptz
category         text          ← NEW
visibility       text          ← NEW
allow_comments   boolean       ← NEW
featured         boolean       ← NEW
```

---

**Need Help?** Check the error messages and try the manual option.
