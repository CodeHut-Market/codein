# Langsearch.com Web Search Integration

This document explains how to use the Langsearch.com web search API integration in CodeHut for plagiarism detection and web search functionality.

## Overview

CodeHut integrates with [Langsearch.com](https://langsearch.com) to provide:
- **Web Search**: General web search capabilities
- **Plagiarism Detection**: Check code snippets and content for potential plagiarism
- **Content Verification**: Verify originality of user-submitted content

## Configuration

### Environment Variables

```bash
# Required - Your Langsearch.com API key
LANGSEARCH_API_KEY="sk-fc4ef81a8575419a94dd6d5ff6e33608"

# Optional - API base URL (defaults to https://api.langsearch.com/v1)
LANGSEARCH_BASE_URL="https://api.langsearch.com/v1"

# Legacy support
WEB_SEARCH_API_KEY="sk-fc4ef81a8575419a94dd6d5ff6e33608"
WEB_SEARCH_ENABLED=true
WEB_SEARCH_PROVIDER=langsearch
```

### Getting API Key

1. Visit [Langsearch.com](https://langsearch.com)
2. Sign up for an account
3. Navigate to API settings
4. Generate an API key
5. Add it to your environment variables

## API Endpoints

### 1. Web Search

**POST** `/api/websearch`

Perform web search using Langsearch API.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "query": "React hooks tutorial",
  "num_results": 10,
  "language": "en",
  "search_type": "web"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "results": [
      {
        "title": "Complete Guide to React Hooks",
        "url": "https://example.com/react-hooks",
        "snippet": "Learn how to use React hooks effectively...",
        "published_date": "2024-01-15",
        "domain": "example.com"
      }
    ],
    "total_results": 156789,
    "search_time": 234,
    "query": "React hooks tutorial"
  },
  "meta": {
    "timestamp": "2024-03-15T10:30:00Z",
    "service": "langsearch.com"
  }
}
```

### 2. Plagiarism Check

**POST** `/api/plagiarism/check`

Check content for potential plagiarism.

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "content": "function fibonacci(n) { if (n <= 1) return n; return fibonacci(n-1) + fibonacci(n-2); }",
  "language": "en",
  "threshold": 0.5
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "is_plagiarized": false,
    "confidence_score": 0.23,
    "matched_sources": [],
    "original_score": 0.77
  },
  "meta": {
    "timestamp": "2024-03-15T10:30:00Z",
    "service": "langsearch.com",
    "content_length": 98,
    "threshold_used": 0.5
  }
}
```

### 3. Service Health Check

**GET** `/api/websearch/health`

Check if the Langsearch service is available.

**Response:**
```json
{
  "status": "ok",
  "response_time": 145,
  "service": "langsearch.com",
  "configured": true,
  "timestamp": "2024-03-15T10:30:00Z"
}
```

## Usage Examples

### Frontend Integration

```typescript
import { WebSearchRequest, PlagiarismCheckRequest } from '@shared/api';

// Web search
async function searchWeb(query: string) {
  const request: WebSearchRequest = {
    query,
    num_results: 10,
    language: 'en'
  };

  const response = await fetch('/api/websearch', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });

  return response.json();
}

// Plagiarism check
async function checkPlagiarism(content: string) {
  const request: PlagiarismCheckRequest = {
    content,
    threshold: 0.5
  };

  const response = await fetch('/api/plagiarism/check', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(request)
  });

  return response.json();
}
```

### Server-Side Integration

```typescript
import { createLangsearchService } from '../services/langsearch.service';

const langsearchService = createLangsearchService();

if (langsearchService) {
  // Perform search
  const results = await langsearchService.search({
    query: 'machine learning python',
    num_results: 5
  });

  // Check plagiarism
  const plagiarismResult = await langsearchService.checkPlagiarism({
    content: 'Your content here...',
    threshold: 0.6
  });
}
```

## Features

### Plagiarism Detection Algorithm

1. **Content Analysis**: Extracts meaningful phrases from the content
2. **Web Search**: Searches for similar content using extracted phrases
3. **Similarity Scoring**: Calculates similarity between content and search results
4. **Threshold Checking**: Determines if content exceeds plagiarism threshold
5. **Source Matching**: Identifies specific sources that match the content

### Search Capabilities

- **Multiple Search Types**: Web, news, images, videos
- **Language Support**: Multi-language search capabilities
- **Result Filtering**: Filter results by relevance, date, domain
- **Fast Response**: Optimized for quick search results

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request**: Invalid input parameters
- **401 Unauthorized**: Missing or invalid authentication
- **503 Service Unavailable**: Langsearch service not configured
- **500 Internal Server Error**: Service errors or API failures

## Rate Limiting

Please be mindful of API rate limits:
- Check your Langsearch.com plan limits
- Implement proper error handling for rate limit responses
- Consider caching results for frequently searched content

## Security Considerations

- API keys are stored securely in environment variables
- All requests require authentication
- Content is not permanently stored by the service
- Search results are logged for debugging but not persisted

## Troubleshooting

### Service Not Available
If you see "Web search service is not configured":
1. Verify `LANGSEARCH_API_KEY` is set in environment variables
2. Check that the API key is valid
3. Ensure the service is properly imported in server routes

### API Errors
For API-related errors:
1. Check the Langsearch.com service status
2. Verify your API key has sufficient credits
3. Ensure your content meets minimum/maximum length requirements
4. Check network connectivity and firewall settings

## Support

For issues with the Langsearch.com integration:
1. Check the [Langsearch.com documentation](https://docs.langsearch.com)
2. Contact Langsearch.com support for API-specific issues
3. Check CodeHut logs for detailed error messages