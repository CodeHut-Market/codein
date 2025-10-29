# CodeHut Marketplace API Documentation

## Overview

The CodeHut backend provides a comprehensive REST API for managing code snippets, users, purchases, search functionality, and marketplace statistics. Built with Express.js and TypeScript, it features an in-memory database for demonstration purposes.

## Base URL

```
http://localhost:8080/api
```

## API Endpoints

### 🧩 Code Snippets API

#### Get All Snippets

```http
GET /api/snippets
```

**Query Parameters:**

- `query` (string): Search term for title, description, author, or tags
- `tags` (array): Filter by tags
- `language` (string): Filter by programming language
- `framework` (string): Filter by framework
- `minPrice` (number): Minimum price filter
- `maxPrice` (number): Maximum price filter
- `sortBy` (string): Sort field (`createdAt`, `rating`, `price`, `downloads`)
- `sortOrder` (string): Sort order (`asc`, `desc`)
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 12)

**Example:**

```bash
curl "http://localhost:8080/api/snippets?query=react&sortBy=rating&sortOrder=desc&limit=6"
```

#### Get Popular Snippets

```http
GET /api/snippets/popular
```

**Query Parameters:**

- `limit` (number): Number of snippets to return (default: 6)

#### Get Snippet by ID

```http
GET /api/snippets/:id
```

#### Get Snippets by Author

```http
GET /api/snippets/author/:authorId
```

#### Create New Snippet

```http
POST /api/snippets
```

**Request Body:**

```json
{
  "title": "React Login Form",
  "description": "Simple and responsive login component",
  "code": "import React from 'react'...",
  "price": 5,
  "tags": ["React", "Form", "Authentication"],
  "language": "JavaScript",
  "framework": "React"
}
```

### 👥 Users API

#### Get All Users

```http
GET /api/users
```

#### Get User by ID

```http
GET /api/users/:id
```

#### Get User by Username

```http
GET /api/users/username/:username
```

#### Get Top Authors

```http
GET /api/users/top-authors
```

### 💰 Purchases API

#### Purchase a Snippet

```http
POST /api/purchases
```

**Request Body:**

```json
{
  "userId": "user-1",
  "snippetId": "snippet-1"
}
```

#### Get User Purchases

```http
GET /api/purchases/user/:userId
```

#### Get Snippet Purchase Stats

```http
GET /api/purchases/snippet/:snippetId
```

#### Check Purchase Status

```http
GET /api/purchases/check/:userId/:snippetId
```

### 🔍 Search API

#### Global Search

```http
GET /api/search
```

**Query Parameters:**

- `q` (string, required): Search query
- `type` (string): Search type (`all`, `snippets`, `users`)
- `limit` (number): Results limit (default: 20)

**Example:**

```bash
curl "http://localhost:8080/api/search?q=react&type=snippets"
```

#### Get Search Suggestions

```http
GET /api/search/suggestions
```

**Query Parameters:**

- `q` (string, required): Partial search query
- `limit` (number): Suggestions limit (default: 10)

#### Get Search Filters

```http
GET /api/search/filters
```

Returns available filter options (languages, frameworks, tags, price ranges).

### 📊 Statistics API

#### Get Marketplace Stats

```http
GET /api/stats
```

**Response includes:**

- Overview statistics (total snippets, users, purchases, revenue)
- Distribution data (languages, frameworks, price ranges)
- Recent activity
- Popular snippets

#### Get Trending Data

```http
GET /api/stats/trending
```

**Query Parameters:**

- `days` (number): Time period in days (default: 7)

## Data Models

### CodeSnippet

```typescript
interface CodeSnippet {
  id: string;
  title: string;
  description: string;
  code: string;
  price: number;
  rating: number;
  author: string;
  authorId: string;
  tags: string[];
  language: string;
  framework?: string;
  downloads: number;
  createdAt: string;
  updatedAt: string;
}
```

### User

```typescript
interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  avatar?: string;
  totalSnippets: number;
  totalDownloads: number;
  rating: number;
  createdAt: string;
}
```

### Purchase

```typescript
interface Purchase {
  id: string;
  userId: string;
  snippetId: string;
  price: number;
  purchaseDate: string;
}
```

## Error Handling

All endpoints return consistent error responses:

```typescript
interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
```

**HTTP Status Codes:**

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Sample Data

The backend includes sample data with:

- 6 diverse code snippets (React, Vue, Node.js, CSS, JavaScript)
- 6 user profiles with different specializations
- 2 sample purchases
- Rich metadata (tags, ratings, download counts)

## Database Structure

Currently uses an in-memory database for demonstration. For production, consider:

- PostgreSQL with Prisma ORM
- MongoDB with Mongoose
- MySQL with Sequelize

## Authentication

The current implementation includes basic structures for authentication but uses a default author for new snippets. For production, implement:

- JWT token authentication
- User registration/login
- Role-based access control
- OAuth integration

## Rate Limiting

Consider implementing rate limiting for production:

```javascript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use("/api", limiter);
```

## Example Usage

### Frontend Integration

```javascript
// Fetch popular snippets
const response = await fetch("/api/snippets/popular?limit=6");
const data = await response.json();
setSnippets(data.snippets);

// Create new snippet
const newSnippet = await fetch("/api/snippets", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(snippetData),
});

// Search functionality
const searchResults = await fetch(`/api/search?q=${query}&type=snippets`);
const results = await searchResults.json();
```

### Testing with curl

```bash
# Get all snippets
curl "http://localhost:8080/api/snippets"

# Search for React snippets
curl "http://localhost:8080/api/search?q=react"

# Get marketplace statistics
curl "http://localhost:8080/api/stats"

# Create a new snippet
curl -X POST "http://localhost:8080/api/snippets" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Snippet","description":"Test","code":"console.log(\"hello\")","price":5,"language":"JavaScript","tags":["test"]}'
```

## Development Setup

1. The server runs on port 8080 by default
2. CORS is enabled for all origins
3. JSON parsing middleware is configured
4. All routes are prefixed with `/api`

## Production Considerations

1. **Database**: Replace in-memory storage with persistent database
2. **Authentication**: Implement proper user authentication
3. **Validation**: Add request validation with Joi or Zod
4. **Rate Limiting**: Implement API rate limiting
5. **Logging**: Add comprehensive logging with Winston
6. **Monitoring**: Add health checks and metrics
7. **Security**: Implement HTTPS, CORS policies, input sanitization
8. **Caching**: Add Redis for caching popular queries
9. **File Storage**: Implement file upload for code attachments
10. **Payment Integration**: Add Stripe/PayPal for actual purchases
