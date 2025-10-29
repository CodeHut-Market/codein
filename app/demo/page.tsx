"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeHighlighter } from "@/components/ui/syntax-highlighter"
import {
  ArrowRight,
  Code,
  Copy,
  Download,
  Eye,
  Filter,
  Globe,
  Heart,
  Play,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Zap
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

// Enhanced demo data with modern examples
interface DemoSnippet {
  id: number;
  title: string;
  description: string;
  language: string;
  author: string;
  avatar: string;
  views: number;
  likes: number;
  downloads: number;
  rating: number;
  tags: string[];
  category: string;
  featured: boolean;
  code: string;
}

const demoSnippets: DemoSnippet[] = [
  {
    id: 1,
    title: "React Authentication Hook",
    description: "Complete authentication system with JWT tokens, automatic refresh, and persistent sessions",
    language: "TypeScript",
    author: "DevExpert",
    avatar: "https://github.com/shadcn.png",
    views: 12847,
    likes: 892,
    downloads: 456,
    rating: 4.9,
    tags: ["react", "authentication", "jwt", "hooks"],
    category: "Authentication",
    featured: true,
    code: `import { useState, useEffect, useContext, createContext } from 'react'

interface User {
  id: string
  email: string
  name: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    if (token) {
      validateToken(token)
    } else {
      setLoading(false)
    }
  }, [])

  const validateToken = async (token: string) => {
    try {
      const response = await fetch('/api/auth/validate', {
        headers: { Authorization: \`Bearer \${token}\` }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        localStorage.removeItem('authToken')
      }
    } catch (error) {
      console.error('Token validation failed:', error)
      localStorage.removeItem('authToken')
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    if (response.ok) {
      const data = await response.json()
      localStorage.setItem('authToken', data.token)
      setUser(data.user)
    } else {
      throw new Error('Login failed')
    }
  }

  const logout = () => {
    localStorage.removeItem('authToken')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}`
  },
  {
    id: 2,
    title: "Advanced Python Data Validator",
    description: "Comprehensive validation library with custom rules, nested object support, and detailed error reporting",
    language: "Python",
    author: "PythonMaster",
    avatar: "https://github.com/shadcn.png",
    views: 8934,
    likes: 567,
    downloads: 234,
    rating: 4.7,
    tags: ["python", "validation", "data", "forms"],
    category: "Utilities",
    featured: true,
    code: `from typing import Any, Dict, List, Optional, Union, Callable
import re
from datetime import datetime

class ValidationError(Exception):
    def __init__(self, field: str, message: str):
        self.field = field
        self.message = message
        super().__init__(f"{field}: {message}")

class DataValidator:
    def __init__(self):
        self.rules: Dict[str, List[Callable]] = {}
        self.messages: Dict[str, str] = {}
    
    def add_rule(self, field: str, rule: Callable[[Any], bool], message: str):
        """Add a validation rule for a specific field."""
        if field not in self.rules:
            self.rules[field] = []
        self.rules[field].append(rule)
        self.messages[f"{field}_{len(self.rules[field])}"] = message
    
    def required(self, field: str, message: str = "This field is required"):
        """Mark a field as required."""
        self.add_rule(field, lambda x: x is not None and x != "", message)
    
    def min_length(self, field: str, length: int):
        """Validate minimum string length."""
        message = f"Must be at least {length} characters long"
        self.add_rule(field, lambda x: len(str(x)) >= length, message)
    
    def max_length(self, field: str, length: int):
        """Validate maximum string length."""
        message = f"Must be no more than {length} characters long"
        self.add_rule(field, lambda x: len(str(x)) <= length, message)
    
    def email(self, field: str):
        """Validate email format."""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        message = "Please enter a valid email address"
        self.add_rule(field, lambda x: re.match(pattern, str(x)) is not None, message)
    
    def numeric(self, field: str):
        """Validate numeric values."""
        message = "This field must be a number"
        self.add_rule(field, lambda x: isinstance(x, (int, float)) or str(x).isdigit(), message)
    
    def date_format(self, field: str, format_str: str = "%Y-%m-%d"):
        """Validate date format."""
        message = f"Date must be in {format_str} format"
        def validate_date(value):
            try:
                datetime.strptime(str(value), format_str)
                return True
            except ValueError:
                return False
        self.add_rule(field, validate_date, message)
    
    def validate(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Validate data against all defined rules."""
        errors: Dict[str, List[str]] = {}
        
        for field, rules in self.rules.items():
            field_errors = []
            value = data.get(field)
            
            for i, rule in enumerate(rules):
                if not rule(value):
                    message_key = f"{field}_{i+1}"
                    field_errors.append(self.messages[message_key])
            
            if field_errors:
                errors[field] = field_errors
        
        return {
            "valid": len(errors) == 0,
            "errors": errors,
            "data": data if len(errors) == 0 else None
        }

# Usage Example
def create_user_validator():
    validator = DataValidator()
    
    validator.required("name")
    validator.min_length("name", 2)
    validator.max_length("name", 50)
    
    validator.required("email")
    validator.email("email")
    
    validator.required("password")
    validator.min_length("password", 8)
    
    validator.numeric("age")
    
    return validator

# Example usage
validator = create_user_validator()
user_data = {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123",
    "age": 25
}

result = validator.validate(user_data)
print(f"Valid: {result['valid']}")
if not result['valid']:
    print(f"Errors: {result['errors']}")`
  },
  {
    id: 3,
    title: "Modern CSS Grid Layout System",
    description: "Flexible, responsive grid system with utility classes and advanced layout patterns",
    language: "CSS",
    author: "CSSWizard",
    avatar: "https://github.com/shadcn.png",
    views: 15632,
    likes: 1243,
    downloads: 789,
    rating: 4.8,
    tags: ["css", "grid", "responsive", "layout"],
    category: "UI/UX",
    featured: true,
    code: `/* Modern CSS Grid System */
:root {
  --grid-gap: 1rem;
  --grid-columns: 12;
  --container-max-width: 1200px;
  --breakpoint-sm: 576px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 992px;
  --breakpoint-xl: 1200px;
}

/* Base Container */
.container {
  width: 100%;
  max-width: var(--container-max-width);
  margin: 0 auto;
  padding: 0 var(--grid-gap);
}

/* Grid System */
.grid {
  display: grid;
  grid-template-columns: repeat(var(--grid-columns), 1fr);
  gap: var(--grid-gap);
  width: 100%;
}

/* Auto-fit responsive columns */
.grid-auto-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--grid-gap);
}

.grid-auto-fill {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--grid-gap);
}

/* Column span utilities */
.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-6 { grid-column: span 6; }
.col-8 { grid-column: span 8; }
.col-12 { grid-column: span 12; }

/* Row span utilities */
.row-1 { grid-row: span 1; }
.row-2 { grid-row: span 2; }
.row-3 { grid-row: span 3; }

/* Area placement */
.area-header { grid-area: header; }
.area-sidebar { grid-area: sidebar; }
.area-main { grid-area: main; }
.area-footer { grid-area: footer; }

/* Layout templates */
.layout-sidebar {
  display: grid;
  grid-template-areas: 
    "header header"
    "sidebar main"
    "footer footer";
  grid-template-columns: 250px 1fr;
  grid-template-rows: auto 1fr auto;
  gap: var(--grid-gap);
  min-height: 100vh;
}

.layout-three-column {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main aside"
    "footer footer footer";
  grid-template-columns: 200px 1fr 200px;
  grid-template-rows: auto 1fr auto;
  gap: var(--grid-gap);
  min-height: 100vh;
}

/* Responsive breakpoints */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .col-sm-12 { grid-column: span 12; }
  .col-sm-6 { grid-column: span 6; }
  .col-sm-4 { grid-column: span 4; }
  
  .layout-sidebar {
    grid-template-areas: 
      "header"
      "main"
      "sidebar"
      "footer";
    grid-template-columns: 1fr;
  }
  
  .layout-three-column {
    grid-template-areas:
      "header"
      "main"
      "sidebar"
      "aside"
      "footer";
    grid-template-columns: 1fr;
  }
}

/* Grid alignment utilities */
.justify-start { justify-content: start; }
.justify-center { justify-content: center; }
.justify-end { justify-content: end; }
.justify-between { justify-content: space-between; }

.align-start { align-content: start; }
.align-center { align-content: center; }
.align-end { align-content: end; }

/* Item alignment */
.justify-self-start { justify-self: start; }
.justify-self-center { justify-self: center; }
.justify-self-end { justify-self: end; }

.align-self-start { align-self: start; }
.align-self-center { align-self: center; }
.align-self-end { align-self: end; }

/* Gap utilities */
.gap-0 { gap: 0; }
.gap-1 { gap: 0.5rem; }
.gap-2 { gap: 1rem; }
.gap-3 { gap: 1.5rem; }
.gap-4 { gap: 2rem; }

/* Example card grid */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}`
  },
  {
    id: 4,
    title: "Advanced JavaScript Debounce & Throttle",
    description: "Performance optimization utilities with cancellation, immediate execution, and advanced options",
    language: "JavaScript",
    author: "JSNinja",
    avatar: "https://github.com/shadcn.png",
    views: 11205,
    likes: 678,
    downloads: 445,
    rating: 4.6,
    tags: ["javascript", "performance", "debounce", "throttle"],
    category: "Utilities",
    featured: false,
    code: `/**
 * Advanced debounce function with cancellation and immediate execution
 */
function debounce(func, delay, options = {}) {
  const { immediate = false, maxWait = 0 } = options
  let timeoutId
  let maxTimeoutId
  let lastCallTime
  let lastInvokeTime = 0
  let leading = false
  let maxing = maxWait > 0

  function invokeFunc(time) {
    const args = lastArgs
    const thisArg = lastThis

    lastArgs = lastThis = undefined
    lastInvokeTime = time
    return func.apply(thisArg, args)
  }

  function shouldInvoke(time) {
    const timeSinceLastCall = time - lastCallTime
    const timeSinceLastInvoke = time - lastInvokeTime

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= delay ||
      timeSinceLastCall < 0 ||
      (maxing && timeSinceLastInvoke >= maxWait)
    )
  }

  function timerExpired() {
    const time = Date.now()
    if (shouldInvoke(time)) {
      return trailingEdge(time)
    }
    // Restart the timer
    timeoutId = setTimeout(timerExpired, remainingWait(time))
  }

  function trailingEdge(time) {
    timeoutId = undefined
    if (trailing && lastArgs) {
      return invokeFunc(time)
    }
    lastArgs = lastThis = undefined
    return result
  }

  function cancel() {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId)
    }
    if (maxTimeoutId !== undefined) {
      clearTimeout(maxTimeoutId)
    }
    lastInvokeTime = 0
    lastArgs = lastCallTime = lastThis = timeoutId = maxTimeoutId = undefined
  }

  function flush() {
    return timeoutId === undefined ? result : trailingEdge(Date.now())
  }

  function debounced(...args) {
    const time = Date.now()
    const isInvoking = shouldInvoke(time)

    lastArgs = args
    lastThis = this
    lastCallTime = time

    if (isInvoking) {
      if (timeoutId === undefined) {
        return leadingEdge(lastCallTime)
      }
      if (maxing) {
        // Handle invocations in a tight loop
        clearTimeout(timeoutId)
        timeoutId = setTimeout(timerExpired, delay)
        return invokeFunc(lastCallTime)
      }
    }
    if (timeoutId === undefined) {
      timeoutId = setTimeout(timerExpired, delay)
    }
    return result
  }

  debounced.cancel = cancel
  debounced.flush = flush
  return debounced
}

/**
 * Advanced throttle function
 */
function throttle(func, delay, options = {}) {
  const { leading = true, trailing = true } = options
  return debounce(func, delay, {
    leading,
    trailing,
    maxWait: delay
  })
}

/**
 * Utility for rate limiting API calls
 */
class RateLimiter {
  constructor(maxCalls = 10, timeWindow = 1000) {
    this.maxCalls = maxCalls
    this.timeWindow = timeWindow
    this.calls = []
  }

  async execute(func, ...args) {
    const now = Date.now()
    
    // Remove old calls outside the time window
    this.calls = this.calls.filter(time => now - time < this.timeWindow)
    
    if (this.calls.length >= this.maxCalls) {
      const oldestCall = this.calls[0]
      const waitTime = this.timeWindow - (now - oldestCall)
      
      await new Promise(resolve => setTimeout(resolve, waitTime))
      return this.execute(func, ...args)
    }
    
    this.calls.push(now)
    return func.apply(this, args)
  }
}

// Usage Examples
const debouncedSearch = debounce(
  async (query) => {
    const results = await fetch(\`/api/search?q=\${query}\`)
    return results.json()
  },
  300,
  { maxWait: 1000 }
)

const throttledScroll = throttle(
  () => {
    console.log('Scroll position:', window.scrollY)
  },
  100
)

// Rate limiter for API calls
const apiLimiter = new RateLimiter(5, 1000) // 5 calls per second

async function makeApiCall(endpoint) {
  return apiLimiter.execute(async () => {
    const response = await fetch(endpoint)
    return response.json()
  })
}

// Event listeners
document.getElementById('search').addEventListener('input', (e) => {
  debouncedSearch(e.target.value)
})

window.addEventListener('scroll', throttledScroll)

// Advanced usage with cancellation
const searchDebounced = debouncedSearch('react hooks')
// Cancel the pending call
searchDebounced.cancel()

// Flush immediately
const result = searchDebounced.flush()`
  }
]

const categories = [
  { name: "All", count: demoSnippets.length },
  { name: "Authentication", count: 1 },
  { name: "Utilities", count: 2 },
  { name: "UI/UX", count: 1 }
]

export default function DemoPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedSnippet, setSelectedSnippet] = useState(demoSnippets[0])
  const [viewMode, setViewMode] = useState<"preview" | "code">("preview")
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const filteredSnippets = demoSnippets.filter(snippet => {
    const matchesSearch = !searchQuery || 
      snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      snippet.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = selectedCategory === "All" || snippet.category === selectedCategory
    
    return matchesSearch && matchesCategory
  })

  const handleCopyCode = async (snippetId: number, code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedId(snippetId)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error('Failed to copy code:', err)
    }
  }

  const runCode = (snippet: DemoSnippet) => {
    // In a real app, this would execute the code in a sandbox
    console.log('Running code for:', snippet.title)
    alert(`Code execution demo for: ${snippet.title}\n\nIn a real environment, this would run in a secure sandbox.`)
  }

  const handleDownloadSnippet = (snippet: DemoSnippet) => {
    // Create a downloadable file
    const element = document.createElement('a')
    const fileType = snippet.language.toLowerCase() === 'typescript' ? 'ts' : 
                     snippet.language.toLowerCase() === 'javascript' ? 'js' :
                     snippet.language.toLowerCase() === 'python' ? 'py' :
                     snippet.language.toLowerCase() === 'css' ? 'css' : 'txt'
    
    const file = new Blob([snippet.code], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${snippet.title.replace(/\s+/g, '_').toLowerCase()}.${fileType}`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleAddToFavorites = (snippet: DemoSnippet) => {
    // In a real app, this would make an API call to add to favorites
    // For demo purposes, we'll redirect to the favorites page
    alert(`Added "${snippet.title}" to favorites!\n\nRedirecting to favorites page...`)
    setTimeout(() => {
      router.push('/favorites')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="text-center space-y-8 max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <Play className="w-4 h-4 mr-2" />
              Interactive Demo Experience
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              Try Our
              <span className="block bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text text-transparent">
                Platform
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Experience the power of our code snippet platform. Browse, preview, 
              and interact with real code examples from our community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/explore">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto w-full sm:w-auto">
                  <Play className="w-5 h-5 mr-2" />
                  Start Exploring
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/docs">
                <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto backdrop-blur-sm w-full sm:w-auto">
                  <Globe className="w-5 h-5 mr-2" />
                  View Documentation
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-yellow-400/20 rounded-full backdrop-blur-sm animate-pulse"></div>
        <div className="absolute top-1/2 right-20 w-12 h-12 bg-pink-400/20 rounded-full backdrop-blur-sm animate-pulse"></div>
      </section>

      <div className="container mx-auto px-6 py-16 space-y-12">
        {/* Platform Features */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: Code,
              title: "Live Code Preview",
              description: "See syntax highlighting and code structure instantly",
              color: "text-blue-500"
            },
            {
              icon: Zap,
              title: "Instant Download", 
              description: "Get code snippets with one click - no signup required",
              color: "text-purple-500"
            },
            {
              icon: Search,
              title: "Smart Search",
              description: "Find exactly what you need with advanced filtering",
              color: "text-green-500"
            }
          ].map((feature, index) => (
            <Card key={index} className="text-center group hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-0 shadow-lg">
              <CardContent className="p-8">
                <div className="mb-6">
                  <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </section>

        {/* Interactive Demo */}
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Interactive Code Explorer
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Browse our curated collection of code snippets. Click, copy, and experiment with real code.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Sidebar - Snippet List */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search and Filter */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Explore Snippets
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      placeholder="Search snippets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category.name}
                          variant={selectedCategory === category.name ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.name)}
                          className="text-xs"
                        >
                          {category.name} ({category.count})
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Snippet List */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {filteredSnippets.map((snippet) => (
                  <Card 
                    key={snippet.id}
                    className={`cursor-pointer transition-all duration-200 border-0 shadow-md hover:shadow-lg ${
                      selectedSnippet.id === snippet.id 
                        ? 'ring-2 ring-purple-500 bg-purple-50' 
                        : 'hover:-translate-y-1'
                    }`}
                    onClick={() => setSelectedSnippet(snippet)}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-sm line-clamp-2">{snippet.title}</h3>
                          {snippet.featured && (
                            <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {snippet.description}
                        </p>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <Badge variant="secondary">{snippet.language}</Badge>
                          <div className="flex items-center gap-3">
                            <span className="flex items-center">
                              <Eye className="w-3 h-3 mr-1" />
                              {snippet.views.toLocaleString()}
                            </span>
                            <span className="flex items-center">
                              <Heart className="w-3 h-3 mr-1" />
                              {snippet.likes}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Main Content - Code Viewer */}
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-xl">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">{selectedSnippet.title}</CardTitle>
                      <CardDescription className="text-base mt-2">
                        {selectedSnippet.description}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant={viewMode === "preview" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("preview")}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Preview
                      </Button>
                      <Button
                        variant={viewMode === "code" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setViewMode("code")}
                      >
                        <Code className="w-4 h-4 mr-2" />
                        Code
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  {/* Snippet Metadata */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-lg">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Eye className="w-5 h-5 text-blue-500" />
                      </div>
                      <div className="text-lg font-bold">{selectedSnippet.views.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Heart className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="text-lg font-bold">{selectedSnippet.likes}</div>
                      <div className="text-xs text-muted-foreground">Likes</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Download className="w-5 h-5 text-green-500" />
                      </div>
                      <div className="text-lg font-bold">{selectedSnippet.downloads}</div>
                      <div className="text-xs text-muted-foreground">Downloads</div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Star className="w-5 h-5 text-yellow-500" />
                      </div>
                      <div className="text-lg font-bold">{selectedSnippet.rating}</div>
                      <div className="text-xs text-muted-foreground">Rating</div>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {selectedSnippet.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="hover:bg-primary hover:text-primary-foreground cursor-pointer">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Code Content */}
                  <Tabs value={viewMode} onValueChange={(value: "preview" | "code") => setViewMode(value)}>
                    <TabsContent value="preview" className="space-y-4">
                      <div className="relative">
                        <div className="absolute top-4 right-4 z-10 flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleCopyCode(selectedSnippet.id, selectedSnippet.code)}
                            className="bg-white/90 text-gray-700 hover:bg-white border shadow-sm"
                          >
                            <Copy className="w-4 h-4 mr-2" />
                            {copiedId === selectedSnippet.id ? 'Copied!' : 'Copy'}
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => runCode(selectedSnippet)}
                            className="bg-green-500 hover:bg-green-600 text-white border-0 shadow-sm"
                          >
                            <Play className="w-4 h-4 mr-2" />
                            Run
                          </Button>
                        </div>
                        <CodeHighlighter 
                          code={selectedSnippet.code} 
                          language={selectedSnippet.language.toLowerCase()} 
                        />
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="code">
                      <div className="bg-gray-900 rounded-lg p-6 text-white font-mono text-sm overflow-x-auto">
                        <pre><code>{selectedSnippet.code}</code></pre>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
                    <Button 
                      onClick={() => handleDownloadSnippet(selectedSnippet)}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download Snippet
                    </Button>
                    <Button 
                      onClick={() => handleAddToFavorites(selectedSnippet)}
                      variant="outline" 
                      className="flex-1"
                    >
                      <Heart className="w-4 h-4 mr-2" />
                      Add to Favorites
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden">
          <Card className="border-0 bg-gradient-to-br from-purple-600 via-blue-600 to-teal-600 text-white shadow-2xl">
            <CardContent className="relative p-12 text-center space-y-8">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative space-y-6">
                <h2 className="text-4xl md:text-5xl font-bold">
                  Ready to Get Started?
                </h2>
                <p className="text-xl text-blue-100 max-w-2xl mx-auto">
                  Join thousands of developers who trust our platform for their code snippet needs. 
                  Start building amazing projects today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link href="/signup">
                    <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-4 h-auto w-full sm:w-auto">
                      <Sparkles className="w-5 h-5 mr-2" />
                      Create Account
                    </Button>
                  </Link>
                  <Link href="/pricing">
                    <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 h-auto backdrop-blur-sm w-full sm:w-auto">
                      <TrendingUp className="w-5 h-5 mr-2" />
                      View Pricing
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  )
}