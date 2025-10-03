# 🚀 Quick Reference Card - New Features

## 1️⃣ CURL Upload Command

**Upload a code snippet from terminal:**

```bash
curl -X POST http://localhost:3000/api/snippets/upload-curl \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Awesome Function",
    "code": "function hello() { console.log(\"Hello!\"); }",
    "description": "A simple greeting function",
    "language": "JavaScript",
    "author": "John Doe",
    "authorId": "john-123",
    "price": 0,
    "tags": ["javascript", "function"],
    "framework": "Node.js"
  }'
```

**Quick Test:**
```bash
# Windows
test-curl-upload.bat

# Check if it was saved
node test-supabase.js
```

---

## 2️⃣ Plagiarism Detection API

**Check code for plagiarism:**

```bash
curl -X POST http://localhost:3000/api/snippets/detect-plagiarism \
  -H "Content-Type: application/json" \
  -d '{
    "code": "YOUR_CODE_HERE",
    "language": "JavaScript",
    "authorId": "optional-exclude-own-code"
  }'
```

**Response:**
```json
{
  "success": true,
  "isPlagiarized": false,
  "similarity": 0.23,
  "status": "PASS",
  "message": "Code appears original (23.0% max similarity)",
  "matchedSnippets": []
}
```

**Thresholds:**
- 🔴 **≥85%** = BLOCK (plagiarism)
- 🟡 **65-85%** = REVIEW (warning)
- 🟢 **<65%** = PASS (original)

---

## 3️⃣ Loading Components

**Import:**
```tsx
import {
  Spinner,
  DotsLoader,
  LoadingText,
  LoadingOverlay,
} from '@/components/ui/loading';
```

**Usage:**

```tsx
// Simple spinner
<Spinner size="md" className="text-blue-600" />

// Bouncing dots
<DotsLoader size="lg" className="text-purple-600" />

// Loading text
<LoadingText text="Processing your request..." />

// Full-screen overlay
{isUploading && <LoadingOverlay message="Uploading code..." />}

// In a button
<Button disabled={loading}>
  {loading ? (
    <>
      <Spinner size="sm" className="mr-2" />
      Uploading...
    </>
  ) : (
    'Upload Code'
  )}
</Button>
```

**See all components:**
👉 Visit: `http://localhost:3000/loading-demo`

---

## 4️⃣ Upload with Plagiarism Check

**What happens when you upload:**

1. User fills form at `/upload`
2. Clicks "Upload Code" button
3. 🔍 **Plagiarism check runs automatically**
4. Shows loading spinner: "Checking Plagiarism..."
5. Displays result:
   - 🟢 Green = Original code, proceed
   - 🟡 Yellow = Similar code, user confirms
   - 🔴 Red = Plagiarized, upload blocked
6. If passed, uploads to Supabase

**No action needed - it's automatic!**

---

## 📍 Quick Links

| Feature | URL |
|---------|-----|
| Upload Page | `http://localhost:3000/upload` |
| Loading Demo | `http://localhost:3000/loading-demo` |
| Explore Snippets | `http://localhost:3000/explore` |
| API Docs | See `TESTING_GUIDE.md` |

---

## 🔧 Troubleshooting

**Curl not working?**
- Server running? Check `pnpm dev`
- Use `127.0.0.1` instead of `localhost`
- Try PowerShell: `Invoke-WebRequest`

**Plagiarism check failing?**
- Check Supabase connection
- Verify environment variables
- Run `node test-supabase.js`

**Loading components not showing?**
- Check import path
- Verify CSS animations loaded
- Visit `/loading-demo` to test

---

## 💡 Pro Tips

1. **Test curl upload first** with `test-curl-upload.bat`
2. **Check Supabase** with `node test-supabase.js`
3. **Demo all features** at `/loading-demo`
4. **Read full guide** in `TESTING_GUIDE.md`

---

**All features working! 🎉**
