# Advanced Upload System

## Overview

The CodeIn platform now features an advanced code snippet upload system with two modes:

1. **Simple Upload Mode** - Traditional form-based upload with all the existing features
2. **Advanced Upload Mode** - Enhanced drag-and-drop uploader with intelligent code detection

## Features

### Advanced Upload Mode

#### 🎯 Drag & Drop Interface
- Drag and drop code files directly into the upload area
- Paste code directly using Ctrl+V
- Visual feedback during drag operations
- Support for multiple file types

#### 🤖 Intelligent Detection
- **Language Auto-Detection**: Automatically detects programming language from file extension
- **Framework Detection**: Identifies popular frameworks (React, Vue, Angular, Django, Flask, Express, Next.js)
- **Tag Extraction**: Automatically suggests tags by analyzing function names and class names in JavaScript/TypeScript

#### 🛡️ Built-in Validation
- Title length validation (3-100 characters)
- Code length validation (10 characters minimum, 500KB maximum)
- Description length validation (max 1000 characters)
- XSS prevention for web languages (HTML, JavaScript, TypeScript)
- File size limits (5MB per file)

#### 📝 Supported Languages

- JavaScript (.js, .jsx, .mjs)
- TypeScript (.ts, .tsx)
- Python (.py)
- Java (.java)
- C++ (.cpp, .cc, .cxx, .h, .hpp)
- C (.c, .h)
- C# (.cs)
- HTML (.html, .htm)
- CSS (.css, .scss, .sass, .less)
- SQL (.sql)
- JSON (.json)
- XML (.xml)
- Markdown (.md, .markdown)
- YAML (.yml, .yaml)
- Rust (.rs)
- Go (.go)
- PHP (.php)
- Ruby (.rb)
- Swift (.swift)
- Kotlin (.kt, .kts)
- Plain Text (.txt)

#### 🎨 Visibility Options
- **Public**: Visible to everyone
- **Private**: Only visible to you
- **Unlisted**: Accessible via direct link only

#### 🏷️ Tag Management
- Add up to 10 tags per snippet
- Auto-suggested tags from code analysis
- Easy tag removal with one click

## Usage

### Upload Mode Toggle

Users can switch between Simple and Advanced upload modes using the toggle at the top of the upload page.

### Advanced Upload Workflow

1. **Drop or Select File**
   - Drag and drop a code file onto the upload area
   - Or click "Browse Files" to select from your computer
   - Or paste code directly into the textarea

2. **Auto-Fill Detection**
   - The system automatically fills in:
     - Title (from filename)
     - Programming language
     - Framework (if detected)
     - Suggested tags

3. **Review & Edit**
   - Review auto-detected information
   - Edit title, description, and metadata
   - Add or remove tags
   - Set visibility preferences

4. **Upload**
   - Click "Upload Snippet" to publish
   - Receive confirmation and redirect to snippet page

## API Integration

The advanced uploader integrates with your existing Supabase backend:

### Snippet Helpers (`/app/lib/utils/snippetHelpers.ts`)

```typescript
// Get snippet with all relations
snippetHelpers.getSnippetWithDetails(snippetId)

// Search snippets with filters
snippetHelpers.searchSnippets(query, filters)

// Increment view count
snippetHelpers.incrementViewCount(snippetId)

// Increment download count
snippetHelpers.incrementDownloadCount(snippetId)
```

### Comment Helpers

```typescript
// Add comment
commentHelpers.addComment(snippetId, commentText)

// Delete comment
commentHelpers.deleteComment(commentId)
```

### Utility Functions

```typescript
// Detect language from filename
detectLanguage(filename)

// Auto-detect framework from code
detectFramework(code)

// Extract tags from code
extractTagsFromCode(code, language)

// Validate snippet before upload
validateSnippet(snippet)

// Upload large files to storage
uploadLargeCodeFile(file, snippetId)
```

## Components

### AdvancedUploader Component

Located at: `/app/components/upload/AdvancedUploader.tsx`

Props:
- `onSuccess?: (snippet: CodeSnippet) => void` - Callback on successful upload
- `onCancel?: () => void` - Callback on cancel action

Usage:
```tsx
<AdvancedUploader
  onSuccess={(snippet) => {
    console.log('Uploaded:', snippet)
    router.push(`/snippet/${snippet.id}`)
  }}
  onCancel={() => setUploadMode('simple')}
/>
```

## Security Features

### XSS Prevention
- Automatic detection of potentially dangerous patterns in HTML/JavaScript code
- Warns users about unsafe code before upload

### File Size Limits
- Individual file size limit: 5MB
- Total code size limit: 500KB

### Input Validation
- All inputs are validated before submission
- Clear error messages guide users to fix issues

## User Experience

### Visual Feedback
- Drag-over highlighting
- Upload progress indicators
- Success/error messages
- Real-time validation

### Auto-Complete
- Smart framework detection
- Automatic tag suggestions
- Pre-filled metadata

### Code Preview
- Live code preview with syntax indication
- Character and line count
- Copy-to-clipboard functionality

## Future Enhancements

Potential improvements for the upload system:

1. **Syntax Highlighting** in code preview
2. **Multiple File Upload** for related snippets
3. **Git Integration** to import from repositories
4. **AI-Powered** description generation
5. **Code Formatting** with Prettier/Black
6. **Snippet Templates** for common patterns
7. **Collaborative Editing** with real-time sync
8. **Version History** tracking
9. **Code Diff Viewer** for updates
10. **Bulk Upload** from ZIP files

## Technical Architecture

### File Structure
```
app/
├── components/
│   └── upload/
│       └── AdvancedUploader.tsx     # Main uploader component
├── lib/
│   └── utils/
│       └── snippetHelpers.ts        # Utility functions
└── upload/
    └── page.tsx                     # Upload page with mode toggle
```

### Data Flow
1. User drops/selects file
2. File is read and processed client-side
3. Auto-detection runs (language, framework, tags)
4. User reviews/edits metadata
5. Form is validated
6. Data is sent to `/api/snippets` endpoint
7. Snippet is stored in Supabase
8. User is redirected to snippet page

## Dependencies

- React 18
- Next.js 14
- Supabase JS Client
- Lucide React (icons)
- Radix UI components
- TailwindCSS

## Configuration

No additional configuration needed. The uploader uses your existing:
- Supabase configuration from `.env.local`
- Authentication context
- API routes

## Troubleshooting

### Upload Fails
- Check Supabase connection
- Verify user authentication
- Check file size limits
- Review browser console for errors

### Auto-Detection Not Working
- Ensure file has correct extension
- Check file content format
- Verify framework imports are standard

### Drag & Drop Not Working
- Check browser compatibility
- Ensure JavaScript is enabled
- Try clicking "Browse Files" instead

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Limited drag & drop support (use file picker)

## Accessibility

- Keyboard navigation supported
- Screen reader friendly
- ARIA labels on interactive elements
- Focus indicators visible

## Performance

- Client-side file processing (no server overhead)
- Optimized for files up to 5MB
- Lazy loading of heavy components
- Minimal re-renders with React hooks

---

For questions or issues, please refer to the main README.md or create an issue in the repository.
