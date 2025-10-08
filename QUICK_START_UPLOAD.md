# 🚀 Quick Start Guide - Advanced Upload System

## For Users

### How to Upload a Code Snippet

#### Option 1: Advanced Upload (Recommended)
1. Navigate to `/upload` page
2. Click **"Advanced Upload"** button
3. **Drag & drop** your code file OR click **"Browse Files"**
4. Review auto-filled information (language, framework, tags)
5. Edit title, description, or metadata as needed
6. Click **"Upload Snippet"**
7. Done! You'll be redirected to your snippet page

#### Option 2: Simple Upload (Traditional)
1. Navigate to `/upload` page
2. Keep **"Simple Upload"** mode selected
3. Fill in all fields manually
4. Use tabs to navigate (Basic Info → Code & Preview → Settings)
5. Click **"Upload Snippet"**

### Pro Tips 💡

**Best Results:**
- Use descriptive filenames (becomes your title)
- Include framework imports at the top
- Add comments to your code
- Use standard file extensions

**Quick Paste:**
- Press `Ctrl+V` (or `Cmd+V` on Mac) directly in the drag area to paste code

**Tags:**
- System auto-suggests tags from your function/class names
- You can add up to 10 tags
- Use relevant, searchable keywords

---

## For Developers

### Quick Integration

```tsx
import AdvancedUploader from '../components/upload/AdvancedUploader';

function MyUploadPage() {
  return (
    <AdvancedUploader
      onSuccess={(snippet) => {
        console.log('Uploaded:', snippet);
        // Handle success
      }}
      onCancel={() => {
        // Handle cancel
      }}
    />
  );
}
```

### Helper Functions

```typescript
import { 
  detectLanguage, 
  detectFramework,
  validateSnippet 
} from '@/app/lib/utils/snippetHelpers';

// Detect language from filename
const lang = detectLanguage('app.tsx'); // 'typescript'

// Detect framework from code
const fw = detectFramework(codeString); // 'React' | null

// Validate before upload
const errors = validateSnippet({
  title: 'My Snippet',
  code: 'console.log("hello")',
  language: 'javascript'
});
```

### API Endpoint

```typescript
POST /api/snippets

Headers:
{
  'Content-Type': 'application/json',
  'x-user-data': JSON.stringify({
    id: userId,
    username: username,
    email: email
  })
}

Body:
{
  title: string,
  code: string,
  description: string,
  language: string,
  price: number,
  tags: string[],
  framework?: string,
  visibility: 'public' | 'private' | 'unlisted',
  allowComments: boolean
}
```

### Supported File Extensions

```
.js, .jsx, .mjs      → JavaScript
.ts, .tsx            → TypeScript
.py                  → Python
.java                → Java
.cpp, .cc, .cxx      → C++
.c, .h               → C
.cs                  → C#
.go                  → Go
.rs                  → Rust
.php                 → PHP
.rb                  → Ruby
.swift               → Swift
.kt, .kts            → Kotlin
.html, .htm          → HTML
.css, .scss, .less   → CSS
.sql                 → SQL
.json                → JSON
.xml                 → XML
.md                  → Markdown
.yml, .yaml          → YAML
.txt                 → Plain Text
```

---

## Testing

### Manual Test Checklist

```bash
# 1. Test drag & drop
✓ Drag a .js file into upload area
✓ Verify language = 'javascript'
✓ Verify title is auto-filled

# 2. Test paste
✓ Click in drag area
✓ Press Ctrl+V to paste code
✓ Verify code appears in form

# 3. Test framework detection
✓ Upload React component
✓ Verify framework = 'React'

# 4. Test validation
✓ Try uploading with empty title (should fail)
✓ Try uploading code < 10 chars (should fail)
✓ Try uploading file > 5MB (should fail)

# 5. Test upload flow
✓ Complete all fields
✓ Click "Upload Snippet"
✓ Verify redirect to snippet page
```

### Automated Testing (Future)

```typescript
// Example test with Jest/Vitest
describe('AdvancedUploader', () => {
  it('detects JavaScript files', () => {
    expect(detectLanguage('app.js')).toBe('javascript');
  });
  
  it('validates snippets correctly', () => {
    const errors = validateSnippet({
      title: 'ab', // too short
      code: 'test',
      language: 'javascript'
    });
    expect(errors.title).toBeDefined();
  });
});
```

---

## Environment Setup

### Required Environment Variables

```bash
# .env.local
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
```

### Supabase Schema

Ensure your `snippets` table has these columns:
- `id` (uuid, primary key)
- `title` (text)
- `code` (text)
- `description` (text)
- `language` (text)
- `framework` (text, nullable)
- `tags` (text[])
- `visibility` (text, default 'public')
- `allow_comments` (boolean, default true)
- `price` (numeric, default 0)
- `user_id` (uuid, foreign key)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `views` (integer, default 0)
- `downloads` (integer, default 0)

---

## Common Issues & Solutions

### Issue: Upload button disabled
**Solution:** Fill in all required fields (title, code, description)

### Issue: Language not detected
**Solution:** Use standard file extensions or manually select language

### Issue: Drag & drop not working
**Solution:** Use "Browse Files" button or check browser compatibility

### Issue: File too large error
**Solution:** File must be under 5MB, or code under 500KB

### Issue: XSS warning
**Solution:** Review code for `<script>` tags or `javascript:` URLs

---

## Performance Tips

1. **Client-Side Processing**: All file reading happens in browser
2. **No Server Load**: Only final submit hits the server
3. **Optimized Queries**: Supabase queries fetch only needed data
4. **Caching**: Recent snippets are cached for performance

---

## Browser Support

| Browser | Support Level |
|---------|--------------|
| Chrome 90+ | ✅ Full |
| Firefox 88+ | ✅ Full |
| Safari 14+ | ✅ Full |
| Edge 90+ | ✅ Full |
| Mobile Chrome | ⚠️ Limited drag & drop |
| Mobile Safari | ⚠️ Limited drag & drop |

---

## File Structure

```
app/
├── components/
│   └── upload/
│       └── AdvancedUploader.tsx       # Main component
├── lib/
│   ├── supabaseClient.ts              # Supabase config
│   └── utils/
│       └── snippetHelpers.ts          # Helper functions
└── upload/
    └── page.tsx                       # Upload page

shared/
└── api.ts                             # Type definitions
```

---

## Next Steps

1. **Test the Upload**: Try uploading a snippet in both modes
2. **Customize**: Adjust styling in `AdvancedUploader.tsx`
3. **Add Features**: Implement syntax highlighting, templates, etc.
4. **Monitor**: Check Supabase dashboard for uploads

---

## Resources

- 📖 [Full Documentation](./UPLOAD_FEATURES.md)
- 📊 [Implementation Summary](./ADVANCED_UPLOAD_SUMMARY.md)
- 🔗 [Supabase Docs](https://supabase.com/docs)
- 🎨 [shadcn/ui Components](https://ui.shadcn.com)

---

**Questions?** Check the detailed documentation in `UPLOAD_FEATURES.md` or review the code in `app/components/upload/AdvancedUploader.tsx`.

Happy coding! 🎉
