# 🧪 Testing Advanced Upload System

## Overview

This document explains how to test the Advanced Upload functionality to ensure it properly uploads to and stores data in Supabase.

## Prerequisites

Before testing, ensure you have:

1. ✅ **Supabase Project** set up
2. ✅ **Environment Variables** configured in `.env.local`
3. ✅ **Database Tables** created (snippets, profiles)
4. ✅ **User Account** for authentication

## Environment Setup

### 1. Create `.env.local` file

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 2. Configure Supabase Credentials

Edit `.env.local` and add your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Where to find these:**
- Go to https://supabase.com/dashboard
- Select your project
- Go to Settings → API
- Copy the URL and keys

### 3. Verify Database Schema

Ensure your `snippets` table has these columns:

```sql
-- Check if table exists and view structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'snippets';
```

Required columns:
- `id` (uuid, primary key)
- `title` (text)
- `description` or `message` (text)
- `code` (text)
- `language` (text)
- `framework` (text, nullable)
- `tags` (text[] or jsonb)
- `price` (numeric)
- `author` (text)
- `author_id` (uuid)
- `visibility` (text)
- `allow_comments` (boolean)
- `downloads` (integer)
- `views` (integer)
- `rating` (numeric)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Automated Testing

### Option 1: Run Test Script

If environment variables are configured, run the automated test:

```bash
node test-advanced-upload.js
```

**Expected Output:**
```
🧪 Testing Advanced Upload System
============================================================

1️⃣  Testing Supabase Connection...
✅ Supabase connected successfully

2️⃣  Creating test snippet...
✅ Snippet created successfully
   ID: test-1234567890
   Title: Advanced Upload Test Snippet
   Language: javascript
   Framework: React
   Tags: [ 'test', 'advanced-upload', 'automation' ]

3️⃣  Retrieving snippet from database...
✅ Snippet retrieved successfully
   Data matches: true

... (more tests)

🎉 All Tests Completed!
✨ Advanced Upload System is working correctly!
```

## Manual Testing

### Step 1: Start Development Server

```bash
pnpm dev
# or
npm run dev
```

Navigate to: http://localhost:3000

### Step 2: Sign In

1. Go to http://localhost:3000/login
2. Sign in with your credentials
3. Verify you're authenticated (check user menu/profile)

### Step 3: Navigate to Upload Page

Go to: http://localhost:3000/upload

You should see two upload modes:
- **Simple Upload** (traditional form)
- **Advanced Upload** (new drag-and-drop)

### Step 4: Test Advanced Upload Mode

Click "**Advanced Upload**" button

#### Test A: Drag & Drop Upload

1. Create a test file `test.js`:
   ```javascript
   import React from 'react';
   
   function TestComponent() {
     return <div>Hello World</div>;
   }
   
   export default TestComponent;
   ```

2. Drag and drop `test.js` into the upload area
3. **Verify Auto-Detection**:
   - ✅ Title should be "test" (or "Test")
   - ✅ Language should be "javascript"
   - ✅ Framework should be "React"
   - ✅ Tags should include "TestComponent"

4. Edit any fields if needed
5. Click "**Upload Snippet**"
6. **Verify Success**:
   - ✅ See success message
   - ✅ Redirected to snippet page
   - ✅ Snippet displays correctly

#### Test B: Paste Upload

1. Copy this code:
   ```python
   from flask import Flask
   
   app = Flask(__name__)
   
   @app.route('/')
   def hello():
       return 'Hello World'
   ```

2. Click in the drag area
3. Press `Ctrl+V` (or `Cmd+V` on Mac)
4. **Verify**:
   - ✅ Code appears in the form
   - ✅ Can manually select language (Python)
   - ✅ Can select framework (Flask)

5. Fill in title and description
6. Click "Upload Snippet"

#### Test C: File Picker Upload

1. Click "**Browse Files**" button
2. Select a code file (`.ts`, `.py`, `.java`, etc.)
3. **Verify Auto-Detection** works
4. Complete upload

### Step 5: Verify Data in Supabase

#### Option A: Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Select your project
3. Click "Table Editor"
4. Select "snippets" table
5. **Verify**:
   - ✅ Your uploaded snippet appears
   - ✅ All fields are populated correctly
   - ✅ `author_id` matches your user ID
   - ✅ Timestamps are set

#### Option B: SQL Query

Run this query in Supabase SQL Editor:

```sql
SELECT 
  id,
  title,
  language,
  framework,
  tags,
  author,
  author_id,
  visibility,
  created_at
FROM snippets
ORDER BY created_at DESC
LIMIT 5;
```

**Expected Result:**
```
id                  | title              | language   | framework | tags
--------------------|--------------------|-----------|-----------|---------
uuid-here          | Test               | javascript | React     | {test}
...
```

### Step 6: Test Retrieval

1. Go to http://localhost:3000/explore
2. **Verify** your uploaded snippet appears in the list
3. Click on the snippet
4. **Verify**:
   - ✅ Snippet details display
   - ✅ Code is rendered correctly
   - ✅ Metadata is accurate
   - ✅ Author information shows

### Step 7: Test Advanced Features

#### Language Detection
Upload files with different extensions:
- `app.ts` → Should detect TypeScript
- `script.py` → Should detect Python
- `Main.java` → Should detect Java

#### Framework Detection
Upload code with framework imports:
- Code with `import Vue` → Should detect Vue
- Code with `@angular/core` → Should detect Angular
- Code with `from django` → Should detect Django

#### Tag Extraction (JavaScript/TypeScript only)
Upload JS/TS code with functions:
```javascript
function calculateTotal() {}
const formatDate = () => {};
class UserManager {}
```
Should extract tags: `calculateTotal`, `formatDate`, `UserManager`

## Verification Checklist

### ✅ **Upload Flow**
- [ ] Simple mode works
- [ ] Advanced mode toggle works
- [ ] Drag & drop accepts files
- [ ] Paste (Ctrl+V) works
- [ ] Browse files button works
- [ ] Upload button submits data

### ✅ **Auto-Detection**
- [ ] Language detected from file extension
- [ ] Framework detected from code content
- [ ] Tags extracted from function/class names
- [ ] Title generated from filename

### ✅ **Validation**
- [ ] Title required (3-100 chars)
- [ ] Code required (10+ chars)
- [ ] File size limit enforced (5MB)
- [ ] XSS warnings for dangerous code
- [ ] Error messages display

### ✅ **Supabase Storage**
- [ ] Data saved to `snippets` table
- [ ] All fields populated correctly
- [ ] Timestamps set automatically
- [ ] User ID linked correctly
- [ ] Data retrievable via SQL

### ✅ **UI/UX**
- [ ] Success message displays
- [ ] Error messages display
- [ ] Loading states work
- [ ] Redirect after upload
- [ ] Form resets after upload

## Troubleshooting

### Issue: "Supabase not initialized"

**Solution:**
1. Check `.env.local` exists
2. Verify credentials are correct
3. Restart dev server after changing `.env.local`

```bash
# Stop server (Ctrl+C)
pnpm dev
```

### Issue: "Authentication required"

**Solution:**
1. Make sure you're logged in
2. Check browser console for auth errors
3. Verify `x-user-data` header is being sent
4. Check Supabase auth configuration

### Issue: "Column does not exist"

**Solution:**
Run migration to add missing columns:

```sql
-- Add missing columns to snippets table
ALTER TABLE snippets 
ADD COLUMN IF NOT EXISTS framework TEXT,
ADD COLUMN IF NOT EXISTS visibility TEXT DEFAULT 'public',
ADD COLUMN IF NOT EXISTS allow_comments BOOLEAN DEFAULT true;
```

### Issue: Upload succeeds but data not in Supabase

**Check:**
1. Supabase Row Level Security (RLS) policies
2. Service role key vs anon key usage
3. Browser console for errors
4. Network tab for failed requests

**Fix RLS policies:**
```sql
-- Allow authenticated users to insert
CREATE POLICY "Users can insert snippets"
ON snippets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = author_id);

-- Allow anyone to read public snippets
CREATE POLICY "Public snippets are viewable"
ON snippets FOR SELECT
USING (visibility = 'public' OR auth.uid() = author_id);
```

### Issue: Auto-detection not working

**Verify:**
1. File has correct extension
2. Framework imports are at top of file
3. Code is well-formatted
4. Check browser console for JS errors

## Performance Testing

Test with different file sizes:

```bash
# Small file (< 1KB)
✓ Should upload instantly

# Medium file (100KB)
✓ Should upload in 1-2 seconds

# Large file (1MB)
✓ Should upload in 3-5 seconds

# Very large file (> 5MB)
✗ Should be rejected with error
```

## Security Testing

Test XSS prevention:

```html
<!-- This should trigger a warning -->
<script>alert('XSS')</script>
```

```javascript
// This should trigger a warning
eval('malicious code');
onclick="alert('XSS')"
```

## API Testing

Use curl to test the API directly:

```bash
# Test POST endpoint
curl -X POST http://localhost:3000/api/snippets \
  -H "Content-Type: application/json" \
  -H "x-user-data: {\"id\":\"test-user\",\"username\":\"testuser\",\"email\":\"test@example.com\"}" \
  -d '{
    "title": "API Test Snippet",
    "code": "console.log(\"test\");",
    "description": "Testing API",
    "language": "javascript",
    "tags": ["test"],
    "visibility": "public"
  }'
```

**Expected Response:**
```json
{
  "snippet": {
    "id": "...",
    "title": "API Test Snippet",
    "code": "console.log(\"test\");",
    "language": "javascript",
    ...
  },
  "message": "Snippet created successfully"
}
```

## Conclusion

If all tests pass:
- ✅ Advanced Upload is working correctly
- ✅ Supabase integration is functional
- ✅ Data is being stored and retrieved properly
- ✅ Auto-detection features are operational

**Status**: 🎉 Production Ready!

---

## Quick Test Summary

**Fastest way to verify:**

1. Start dev server: `pnpm dev`
2. Login at http://localhost:3000/login
3. Go to http://localhost:3000/upload
4. Click "Advanced Upload"
5. Drag a `.js` file into the area
6. Verify auto-detection filled fields
7. Click "Upload Snippet"
8. Check Supabase dashboard for the new row

**Time Required**: ~2 minutes

If this works, the system is fully operational! 🚀
