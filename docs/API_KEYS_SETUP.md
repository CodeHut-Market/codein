# 🔑 API Keys Setup Guide

## Current Status

Your plagiarism detection is **working** but using the basic fallback algorithm because the AI API keys are invalid.

### What's Working ✅
- ✅ Local database search (4 snippets found)
- ✅ Basic similarity detection (68% similarity detected)
- ✅ Graceful error handling
- ✅ Results returned successfully

### What's Not Working ❌
- ❌ **Tavily Internet Search** (401 error - invalid API key)
- ❌ **OpenRouter AI Analysis** (401 error - user not found)

---

## How to Fix

### Option 1: Get Valid API Keys (Recommended)

#### 1. Tavily API Key (for Internet Search)

**Get Your Key:**
1. Visit: https://tavily.com
2. Sign up for free account
3. Go to dashboard → API Keys
4. Copy your API key (format: `tvly-xxxxxxxxxxxxx`)

**Update `.env.local`:**
```bash
LANGSEARCH_API_KEY="tvly-your-actual-key-here"
# OR
TAVILY_API_KEY="tvly-your-actual-key-here"
```

**Free Tier:**
- 1,000 searches per month
- Perfect for testing

---

#### 2. OpenRouter API Key (for AI Analysis)

**Get Your Key:**
1. Visit: https://openrouter.ai
2. Sign up and verify email
3. Add credits ($5 minimum, goes a long way)
4. Go to Keys → Create New Key
5. Copy your API key (format: `sk-or-v1-xxxxxxxxxxxxx`)

**Update `.env.local`:**
```bash
OPENROUTER_API_KEY="sk-or-v1-your-actual-key-here"
```

**Pricing:**
- Claude 3.5 Sonnet: ~$0.003 per plagiarism check
- $5 = ~1,600 checks

---

### Option 2: Keep Using Basic Detection (Free)

The system already falls back to basic Jaccard similarity when AI is unavailable.

**Current Behavior:**
```
[AI Plagiarism] Falling back to basic similarity detection
[AI Plagiarism] Fallback result: { status: 'REVIEW', similarity: 0.688 }
```

**Pros:**
- ✅ Free
- ✅ Fast
- ✅ Works offline

**Cons:**
- ❌ Less accurate than AI
- ❌ No internet search
- ❌ Can miss semantic similarities

---

## Testing After Setup

### 1. Restart Development Server
```bash
# Stop current server (Ctrl+C)
pnpm dev
```

### 2. Upload Test Code

**Test with common algorithm:**
```python
def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)
```

### 3. Check Logs

**With Valid Keys:**
```
[Tavily] Starting internet search...
[Tavily] Search completed, results: 5
[AI Plagiarism] Internet search found: 5 matches
[AI Plagiarism] Calling callOpenRouter...
[AI Plagiarism] OpenRouter response received
[Plagiarism] Detection complete: {
  status: 'FAIL',
  similarity: 0.92,
  aiPowered: true,
  internetSearched: true,
  internetMatches: 3
}
```

**Without Valid Keys (Current):**
```
[Tavily] Search failed: Error: Request failed with status code 401
[AI Plagiarism] ERROR occurred: Error: Invalid OpenRouter API key
[AI Plagiarism] Falling back to basic similarity detection
[Plagiarism] Detection complete: {
  status: 'REVIEW',
  similarity: 0.688,
  aiPowered: false,
  internetSearched: false
}
```

---

## Vercel Deployment

After getting valid API keys, add them to Vercel:

1. Go to: https://vercel.com/your-project/settings/environment-variables
2. Add:
   ```
   TAVILY_API_KEY = tvly-your-key-here
   OPENROUTER_API_KEY = sk-or-v1-your-key-here
   ```
3. Redeploy the app

---

## Security Best Practices

### ✅ DO:
- Keep `.env.local` in `.gitignore` (already done)
- Use environment-specific keys (dev vs prod)
- Rotate keys if accidentally exposed
- Monitor API usage and set limits

### ❌ DON'T:
- Commit API keys to GitHub
- Share keys in screenshots/docs
- Use production keys in development
- Hardcode keys in source code

---

## Current API Keys Status

### Your `.env.local`:
```bash
OPENROUTER_API_KEY="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"
# Status: ❌ Invalid (User not found - error 401)
# Action: Get new key from https://openrouter.ai

LANGSEARCH_API_KEY="sk-fc4ef81a8575419a94dd6d5ff6e33608"
# Status: ❌ Invalid (Wrong format, should start with 'tvly-')
# Action: Get real Tavily key from https://tavily.com
```

---

## Alternative: Disable Internet Search

If you don't want to use internet search, you can disable it:

### Edit `aiPlagiarismService.ts`:
```typescript
// Comment out internet search
// const internetResults = await searchInternetForCode(submittedCode, language);

// Use empty results instead
const internetResults = {
  found: false,
  matches: [],
  totalResults: 0,
  searchQuery: ''
};
```

This will only check against your local database.

---

## Summary

**Current State:** ✅ **Working** (using basic fallback)
- Checks against local database ✅
- Returns similarity scores ✅  
- No internet search ❌
- No AI analysis ❌

**To Enable Full Features:**
1. Get valid Tavily API key → Internet search
2. Get valid OpenRouter API key → AI analysis
3. Update `.env.local`
4. Restart server

**Cost:** ~$0.003 per check with AI (very affordable!)

---

**Questions?** Check the logs or ask for help! 🚀
