"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Badge } from "../ui/badge"
import { Button } from "../ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { 
  TrendingUp, 
  Eye, 
  Heart, 
  Download, 
  Code2,
  ExternalLink,
  Flame,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface TrendingSnippet {
  id: string
  title: string
  description: string
  language: string
  author: {
    id: string
    username: string
    avatar?: string
  }
  metrics: {
    views: number
    likes: number
    downloads: number
    trendingScore: number
  }
  code: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

interface TrendingSnippetsProps {
  limit?: number
}

export default function TrendingSnippets({ limit = 5 }: TrendingSnippetsProps) {
  const [snippets, setSnippets] = useState<TrendingSnippet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTrendingSnippets()
  }, [limit])

  const fetchTrendingSnippets = async () => {
    try {
      setLoading(true)
      
      // Generate mock trending snippets data
      // In production, this would query your snippets table with trending algorithm
      const mockSnippets: TrendingSnippet[] = [
        {
          id: 'trending-1',
          title: 'React Custom Hook for API Calls',
          description: 'A reusable hook for handling API requests with loading states and error handling',
          language: 'TypeScript',
          author: {
            id: 'user-1',
            username: 'reactdev_mike',
            avatar: undefined
          },
          metrics: {
            views: 2847,
            likes: 156,
            downloads: 89,
            trendingScore: 95
          },
          code: `import { useState, useEffect } from 'react';

export function useApi<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}`,
          tags: ['react', 'hooks', 'typescript', 'api'],
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'trending-2',
          title: 'CSS Grid Auto-Fit Layout',
          description: 'Responsive grid layout that automatically adjusts based on content size',
          language: 'CSS',
          author: {
            id: 'user-2',
            username: 'css_wizard',
            avatar: undefined
          },
          metrics: {
            views: 1923,
            likes: 134,
            downloads: 67,
            trendingScore: 88
          },
          code: `.responsive-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 1rem;
}

.grid-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.grid-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}`,
          tags: ['css', 'grid', 'responsive', 'layout'],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'trending-3',
          title: 'Python Data Validator Class',
          description: 'A flexible data validation class with chainable methods for complex validation rules',
          language: 'Python',
          author: {
            id: 'user-3',
            username: 'pythonista_sarah',
            avatar: undefined
          },
          metrics: {
            views: 1654,
            likes: 98,
            downloads: 45,
            trendingScore: 82
          },
          code: `class DataValidator:
    def __init__(self, data):
        self.data = data
        self.errors = []
    
    def required(self, field):
        if field not in self.data or not self.data[field]:
            self.errors.append(f"{field} is required")
        return self
    
    def min_length(self, field, length):
        if field in self.data and len(str(self.data[field])) < length:
            self.errors.append(f"{field} must be at least {length} characters")
        return self
    
    def email(self, field):
        import re
        if field in self.data:
            pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
            if not re.match(pattern, self.data[field]):
                self.errors.append(f"{field} must be a valid email")
        return self
    
    def is_valid(self):
        return len(self.errors) == 0`,
          tags: ['python', 'validation', 'data', 'class'],
          createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'trending-4',
          title: 'JavaScript Debounce Function',
          description: 'Optimized debounce implementation for performance-critical applications',
          language: 'JavaScript',
          author: {
            id: 'user-4',
            username: 'js_performance',
            avatar: undefined
          },
          metrics: {
            views: 1432,
            likes: 87,
            downloads: 52,
            trendingScore: 79
          },
          code: `function debounce(func, wait, immediate = false) {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(this, args);
  };
}

// Usage example:
const debouncedSearch = debounce((query) => {
  // API call here
  console.log('Searching for:', query);
}, 300);

// Will only execute once after 300ms of no calls
debouncedSearch('react');
debouncedSearch('react hooks');
debouncedSearch('react hooks tutorial');`,
          tags: ['javascript', 'performance', 'debounce', 'optimization'],
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000)
        },
        {
          id: 'trending-5',
          title: 'Next.js API Route Middleware',
          description: 'Custom middleware for handling authentication and rate limiting in API routes',
          language: 'TypeScript',
          author: {
            id: 'user-5',
            username: 'nextjs_expert',
            avatar: undefined
          },
          metrics: {
            views: 1289,
            likes: 73,
            downloads: 38,
            trendingScore: 75
          },
          code: `import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends NextApiRequest {
  user?: { id: string; email: string };
}

export function withAuth(handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        return res.status(401).json({ error: 'No token provided' });
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      req.user = decoded;
      
      return handler(req, res);
    } catch (error) {
      return res.status(401).json({ error: 'Invalid token' });
    }
  };
}

// Usage:
export default withAuth(async (req, res) => {
  // Access req.user here
  res.json({ message: 'Authenticated route', user: req.user });
});`,
          tags: ['nextjs', 'middleware', 'authentication', 'api'],
          createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
        }
      ]

      setSnippets(mockSnippets.slice(0, limit))
    } catch (error) {
      console.error('Error fetching trending snippets:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      'JavaScript': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      'TypeScript': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      'Python': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'CSS': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      'HTML': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      'React': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300',
    }
    return colors[language] || 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
  }

  const truncateCode = (code: string, maxLength: number = 150) => {
    if (code.length <= maxLength) return code
    return code.substring(0, maxLength) + '...'
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span>Trending Snippets</span>
          </CardTitle>
          <CardDescription>Most popular snippets from the community this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: limit }, (_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-muted rounded-lg"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                    <div className="h-20 bg-muted rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="flex items-center space-x-2">
            <Flame className="h-5 w-5 text-orange-500" />
            <span>Trending Snippets</span>
          </CardTitle>
          <CardDescription>Most popular snippets from the community this week</CardDescription>
        </div>
        <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300">
          <TrendingUp className="w-3 h-3 mr-1" />
          Hot
        </Badge>
      </CardHeader>
      <CardContent>
        {snippets.length === 0 ? (
          <div className="text-center py-8">
            <Code2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No trending snippets available</p>
          </div>
        ) : (
          <div className="space-y-6">
            {snippets.map((snippet, index) => (
              <div key={snippet.id} className="group relative">
                <div className="flex items-start space-x-4">
                  {/* Trending Rank */}
                  <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold">
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Link href={`/snippet/${snippet.id}`}>
                          <h3 className="font-semibold text-lg hover:text-primary transition-colors cursor-pointer">
                            {snippet.title}
                          </h3>
                        </Link>
                        <p className="text-muted-foreground text-sm mt-1">
                          {snippet.description}
                        </p>
                      </div>
                      <Link href={`/snippet/${snippet.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>

                    {/* Author and Language */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={snippet.author.avatar} alt={snippet.author.username} />
                          <AvatarFallback className="text-xs">
                            {snippet.author.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <Link href={`/profile/${snippet.author.id}`}>
                          <span className="text-sm font-medium hover:text-primary transition-colors cursor-pointer">
                            {snippet.author.username}
                          </span>
                        </Link>
                      </div>
                      <Badge className={getLanguageColor(snippet.language)}>
                        {snippet.language}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDistanceToNow(snippet.createdAt, { addSuffix: true })}
                      </div>
                    </div>

                    {/* Code Preview */}
                    <div className="bg-muted/50 rounded-lg p-3 mb-3 border">
                      <pre className="text-xs text-muted-foreground font-mono overflow-hidden">
                        <code>{truncateCode(snippet.code)}</code>
                      </pre>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {snippet.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Metrics */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Eye className="h-4 w-4 mr-1" />
                          {snippet.metrics.views.toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <Heart className="h-4 w-4 mr-1" />
                          {snippet.metrics.likes}
                        </span>
                        <span className="flex items-center">
                          <Download className="h-4 w-4 mr-1" />
                          {snippet.metrics.downloads}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 bg-muted rounded-full h-2 mr-2">
                          <div 
                            className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" 
                            style={{ width: `${snippet.metrics.trendingScore}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium text-orange-600">
                          {snippet.metrics.trendingScore}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {index < snippets.length - 1 && (
                  <div className="border-b border-border mt-6"></div>
                )}
              </div>
            ))}
            
            <div className="pt-4 border-t">
              <Link href="/trending">
                <Button variant="outline" className="w-full">
                  View All Trending Snippets
                  <TrendingUp className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}