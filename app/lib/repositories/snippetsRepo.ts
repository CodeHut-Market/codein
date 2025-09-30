import { CodeSnippet } from '@shared/api';
import { randomUUID } from 'crypto';
import { isSupabaseAdminEnabled, isSupabaseEnabled, supabase, supabaseAdmin } from '../supabaseClient';

// Memory fallback - only used when Supabase is not available
// Start with empty array to prioritize actual database data
let memorySnippets: CodeSnippet[] = [];

// Export function to get memory snippets info for debugging
export function getMemorySnippetsDebugInfo() {
  return {
    count: memorySnippets.length,
    ids: memorySnippets.map(s => s.id),
    titles: memorySnippets.map(s => s.title)
  };
}

// Demo snippets for fallback only (when no database connection)
const FALLBACK_DEMO_SNIPPETS: CodeSnippet[] = [
  {
    id: "demo-1",
    title: "React Custom Hook for API Calls",
    description: "A powerful React hook for handling API requests with loading states, error handling, and caching",
    code: `import { useState, useEffect } from 'react';

export function useAPI(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(url, options);
        if (!response.ok) throw new Error('API call failed');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
}`,
    price: 5,
    rating: 4.8,
    language: "TypeScript",
    framework: "React",
    tags: ["react", "hooks", "api", "typescript"],
    author: "ReactPro",
    authorId: "react-pro-123",
    downloads: 1234,
    visibility: 'public' as const,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    updatedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-2",
    title: "Python Data Validation Decorator",
    description: "Elegant decorator for validating function parameters with custom rules and error messages",
    code: `from functools import wraps
from typing import Any, Callable

def validate_params(**validators):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Get function parameter names
            import inspect
            sig = inspect.signature(func)
            bound_args = sig.bind(*args, **kwargs)
            bound_args.apply_defaults()
            
            # Validate each parameter
            for param_name, validator in validators.items():
                if param_name in bound_args.arguments:
                    value = bound_args.arguments[param_name]
                    if not validator(value):
                        raise ValueError(f"Invalid value for {param_name}: {value}")
            
            return func(*args, **kwargs)
        return wrapper
    return decorator

# Example usage:
@validate_params(
    age=lambda x: isinstance(x, int) and x >= 0,
    email=lambda x: '@' in str(x)
)
def create_user(name: str, age: int, email: str):
    return f"User {name} created successfully"`,
    price: 8,
    rating: 4.9,
    language: "Python",
    framework: "Django",
    tags: ["python", "validation", "decorator", "backend"],
    author: "PythonMaster",
    authorId: "python-master-456",
    downloads: 892,
    visibility: 'public' as const,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-3",
    title: "Vue 3 Composable for Local Storage",
    description: "Reactive Vue 3 composable for seamless localStorage integration with TypeScript support",
    code: `import { ref, watch, Ref } from 'vue';

export function useLocalStorage<T>(
  key: string,
  defaultValue: T
): [Ref<T>, (value: T) => void] {
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ? JSON.parse(storedValue) : defaultValue;
  
  const state = ref<T>(initial);
  
  const setValue = (value: T) => {
    try {
      state.value = value;
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Failed to save to localStorage:', error);
    }
  };
  
  // Watch for changes and save to localStorage
  watch(state, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue));
  }, { deep: true });
  
  return [state, setValue];
}

// Usage example:
// const [count, setCount] = useLocalStorage('counter', 0);`,
    price: 3,
    rating: 4.7,
    language: "TypeScript",
    framework: "Vue",
    tags: ["vue", "composable", "localstorage", "typescript"],
    author: "VueGuru",
    authorId: "vue-guru-789",
    downloads: 567,
    visibility: 'public' as const,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-4",
    title: "CSS Grid Layout Generator",
    description: "Utility classes for creating responsive CSS Grid layouts with automatic column sizing",
    code: `:root {
  --grid-gap: 1rem;
  --grid-min-column-width: 250px;
}

.grid-auto-fit {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(var(--grid-min-column-width), 1fr));
  gap: var(--grid-gap);
}

.grid-auto-fill {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--grid-min-column-width), 1fr));
  gap: var(--grid-gap);
}

.grid-responsive {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--grid-gap);
}

@media (min-width: 768px) {
  .grid-responsive {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .grid-responsive {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1280px) {
  .grid-responsive {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* Grid item utilities */
.grid-span-2 { grid-column: span 2; }
.grid-span-3 { grid-column: span 3; }
.grid-span-full { grid-column: 1 / -1; }`,
    price: 0,
    rating: 4.5,
    language: "CSS",
    framework: "None",
    tags: ["css", "grid", "responsive", "layout", "free"],
    author: "CSSArtist",
    authorId: "css-artist-101",
    downloads: 2345,
    visibility: 'public' as const,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-5",
    title: "Node.js JWT Authentication Middleware",
    description: "Secure JWT authentication middleware for Express applications with refresh token support",
    code: `const jwt = require('jsonwebtoken');
const { promisify } = require('util');

class JWTAuth {
  constructor(secretKey, refreshSecretKey) {
    this.secretKey = secretKey;
    this.refreshSecretKey = refreshSecretKey;
    this.tokenExpiry = '15m';
    this.refreshTokenExpiry = '7d';
  }

  generateTokens(payload) {
    const accessToken = jwt.sign(payload, this.secretKey, {
      expiresIn: this.tokenExpiry
    });
    
    const refreshToken = jwt.sign(payload, this.refreshSecretKey, {
      expiresIn: this.refreshTokenExpiry
    });
    
    return { accessToken, refreshToken };
  }

  authenticate() {
    return async (req, res, next) => {
      try {
        const token = req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
          return res.status(401).json({ error: 'No token provided' });
        }

        const decoded = await promisify(jwt.verify)(token, this.secretKey);
        req.user = decoded;
        next();
      } catch (error) {
        if (error.name === 'TokenExpiredError') {
          return res.status(401).json({ error: 'Token expired' });
        }
        return res.status(403).json({ error: 'Invalid token' });
      }
    };
  }

  refreshToken() {
    return async (req, res) => {
      try {
        const { refreshToken } = req.body;
        const decoded = await promisify(jwt.verify)(refreshToken, this.refreshSecretKey);
        const tokens = this.generateTokens({ userId: decoded.userId, email: decoded.email });
        res.json(tokens);
      } catch (error) {
        res.status(403).json({ error: 'Invalid refresh token' });
      }
    };
  }
}

module.exports = JWTAuth;`,
    price: 12,
    rating: 4.9,
    language: "JavaScript",
    framework: "Node.js",
    tags: ["nodejs", "jwt", "authentication", "middleware", "express"],
    author: "SecurityExpert",
    authorId: "security-expert-202",
    downloads: 1876,
    visibility: 'public' as const,
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-6",
    title: "Angular Reactive Form Validator",
    description: "Custom Angular validators for complex form validation scenarios with async support",
    code: `import { AbstractControl, ValidationErrors, ValidatorFn, AsyncValidatorFn } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

export class CustomValidators {
  
  // Synchronous validator for password strength
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;
      
      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[#?!@$%^&*-]/.test(value);
      const isValidLength = value.length >= 8;
      
      const passwordValid = hasNumber && hasUpper && hasLower && hasSpecial && isValidLength;
      
      return passwordValid ? null : {
        passwordStrength: {
          hasNumber,
          hasUpper,
          hasLower,
          hasSpecial,
          isValidLength
        }
      };
    };
  }
  
  // Async validator for email uniqueness
  static emailUnique(userService: any): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value) {
        return of(null);
      }
      
      return timer(300).pipe(
        switchMap(() => userService.checkEmailExists(control.value)),
        map(exists => exists ? { emailTaken: true } : null),
        catchError(() => of(null))
      );
    };
  }
  
  // Custom validator for matching fields
  static fieldMatch(fieldName: string, confirmFieldName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const field = formGroup.get(fieldName);
      const confirmField = formGroup.get(confirmFieldName);
      
      if (!field || !confirmField) return null;
      
      if (confirmField.errors && !confirmField.errors['fieldMismatch']) {
        return null;
      }
      
      if (field.value !== confirmField.value) {
        confirmField.setErrors({ fieldMismatch: true });
        return { fieldMismatch: true };
      } else {
        confirmField.setErrors(null);
        return null;
      }
    };
  }
}

// Usage example:
// this.userForm = this.fb.group({
//   email: ['', [Validators.required, Validators.email], [CustomValidators.emailUnique(this.userService)]],
//   password: ['', [Validators.required, CustomValidators.passwordStrength()]],
//   confirmPassword: ['', Validators.required]
// }, { validators: CustomValidators.fieldMatch('password', 'confirmPassword') });`,
    price: 15,
    rating: 4.6,
    language: "TypeScript",
    framework: "Angular",
    tags: ["angular", "forms", "validation", "typescript", "reactive"],
    author: "AngularPro",
    authorId: "angular-pro-303",
    downloads: 743,
    visibility: 'public' as const,
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-7",
    title: "Go HTTP Server with Middleware",
    description: "Lightweight HTTP server in Go with custom middleware for logging, CORS, and authentication",
    code: `package main

import (
    "encoding/json"
    "fmt"
    "log"
    "net/http"
    "time"
)

type Server struct {
    router *http.ServeMux
    middlewares []Middleware
}

type Middleware func(http.HandlerFunc) http.HandlerFunc

func NewServer() *Server {
    return &Server{
        router: http.NewServeMux(),
        middlewares: []Middleware{},
    }
}

func (s *Server) Use(middleware Middleware) {
    s.middlewares = append(s.middlewares, middleware)
}

func (s *Server) HandleFunc(pattern string, handler http.HandlerFunc) {
    finalHandler := handler
    
    // Apply middlewares in reverse order
    for i := len(s.middlewares) - 1; i >= 0; i-- {
        finalHandler = s.middlewares[i](finalHandler)
    }
    
    s.router.HandleFunc(pattern, finalHandler)
}

// Logging middleware
func LoggingMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        log.Printf("%s %s %v", r.Method, r.URL.Path, time.Since(start))
    })
}

// CORS middleware
func CorsMiddleware(next http.HandlerFunc) http.HandlerFunc {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
        
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next.ServeHTTP(w, r)
    })
}

// JSON response helper
func JSONResponse(w http.ResponseWriter, status int, data interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(status)
    json.NewEncoder(w).Encode(data)
}

func main() {
    server := NewServer()
    
    // Add middlewares
    server.Use(LoggingMiddleware)
    server.Use(CorsMiddleware)
    
    // Define routes
    server.HandleFunc("/api/health", func(w http.ResponseWriter, r *http.Request) {
        JSONResponse(w, http.StatusOK, map[string]string{"status": "healthy"})
    })
    
    server.HandleFunc("/api/users", func(w http.ResponseWriter, r *http.Request) {
        users := []map[string]string{
            {"id": "1", "name": "John Doe"},
            {"id": "2", "name": "Jane Smith"},
        }
        JSONResponse(w, http.StatusOK, users)
    })
    
    fmt.Println("Server starting on :8080")
    log.Fatal(http.ListenAndServe(":8080", server.router))
}`,
    price: 10,
    rating: 4.8,
    language: "Go",
    framework: "None",
    tags: ["go", "http", "server", "middleware", "api"],
    author: "GoExpert",
    authorId: "go-expert-404",
    downloads: 456,
    visibility: 'public' as const,
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-8",
    title: "Swift iOS Network Layer",
    description: "Complete networking solution for iOS apps with Combine framework and error handling",
    code: `import Foundation
import Combine

protocol NetworkServiceProtocol {
    func request<T: Codable>(_ endpoint: APIEndpoint, responseType: T.Type) -> AnyPublisher<T, NetworkError>
}

enum NetworkError: Error, LocalizedError {
    case invalidURL
    case noData
    case decodingError(Error)
    case httpError(Int)
    case networkError(Error)
    
    var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid URL"
        case .noData:
            return "No data received"
        case .decodingError(let error):
            return "Decoding error: \\(error.localizedDescription)"
        case .httpError(let code):
            return "HTTP error with status code: \\(code)"
        case .networkError(let error):
            return "Network error: \\(error.localizedDescription)"
        }
    }
}

struct APIEndpoint {
    let path: String
    let method: HTTPMethod
    let headers: [String: String]?
    let parameters: [String: Any]?
    
    enum HTTPMethod: String {
        case GET = "GET"
        case POST = "POST"
        case PUT = "PUT"
        case DELETE = "DELETE"
    }
}

class NetworkService: NetworkServiceProtocol {
    private let baseURL: String
    private let session: URLSession
    
    init(baseURL: String, session: URLSession = .shared) {
        self.baseURL = baseURL
        self.session = session
    }
    
    func request<T: Codable>(_ endpoint: APIEndpoint, responseType: T.Type) -> AnyPublisher<T, NetworkError> {
        guard let url = URL(string: baseURL + endpoint.path) else {
            return Fail(error: NetworkError.invalidURL)
                .eraseToAnyPublisher()
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue
        
        // Add headers
        endpoint.headers?.forEach { request.setValue($1, forHTTPHeaderField: $0) }
        
        // Add parameters for POST requests
        if let parameters = endpoint.parameters,
           endpoint.method == .POST || endpoint.method == .PUT {
            do {
                request.httpBody = try JSONSerialization.data(withJSONObject: parameters)
                request.setValue("application/json", forHTTPHeaderField: "Content-Type")
            } catch {
                return Fail(error: NetworkError.networkError(error))
                    .eraseToAnyPublisher()
            }
        }
        
        return session.dataTaskPublisher(for: request)
            .tryMap { data, response -> Data in
                guard let httpResponse = response as? HTTPURLResponse else {
                    throw NetworkError.networkError(URLError(.badServerResponse))
                }
                
                guard 200...299 ~= httpResponse.statusCode else {
                    throw NetworkError.httpError(httpResponse.statusCode)
                }
                
                return data
            }
            .decode(type: responseType, decoder: JSONDecoder())
            .mapError { error -> NetworkError in
                if error is DecodingError {
                    return NetworkError.decodingError(error)
                } else if let networkError = error as? NetworkError {
                    return networkError
                } else {
                    return NetworkError.networkError(error)
                }
            }
            .eraseToAnyPublisher()
    }
}

// Usage example:
// let networkService = NetworkService(baseURL: "https://api.example.com")
// let endpoint = APIEndpoint(path: "/users", method: .GET, headers: nil, parameters: nil)
// 
// networkService.request(endpoint, responseType: [User].self)
//     .sink(receiveCompletion: { completion in
//         // Handle completion
//     }, receiveValue: { users in
//         // Handle users
//     })
//     .store(in: &cancellables)`,
    price: 18,
    rating: 4.9,
    language: "Swift",
    framework: "iOS",
    tags: ["swift", "ios", "networking", "combine", "mobile"],
    author: "iOSDeveloper",
    authorId: "ios-dev-505",
    downloads: 321,
    visibility: 'public' as const,
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  }
];

// Initialize memory snippets - prioritize actual data over demo data
function initializeMemorySnippets() {
  // Only use demo data if explicitly requested or no real data exists
  const shouldUseDemoData = process.env.NODE_ENV === 'development' && 
    process.env.USE_DEMO_DATA === 'true' && 
    !isSupabaseEnabled();
  
  if (shouldUseDemoData) {
    memorySnippets = [...FALLBACK_DEMO_SNIPPETS];
    console.log('Using demo data for development');
  } else {
    memorySnippets = [];
    console.log('Using actual data - demo data disabled');
  }
}

// Initialize on module load
initializeMemorySnippets();

export interface CreateSnippetInput {
  title: string; 
  code: string; 
  description?: string; 
  language: string; 
  price?: number; 
  tags?: string[]; 
  framework?: string;
  category?: string;
  visibility?: 'public' | 'private' | 'unlisted';
  allowComments?: boolean;
  authorId: string; 
  author: string;
}

export async function createSnippet(input: CreateSnippetInput): Promise<CodeSnippet>{
  const now = new Date().toISOString();
  const snippet: CodeSnippet = {
    id: randomUUID(),
    title: input.title,
    code: input.code,
    description: input.description || '',
    price: input.price || 0,
    rating: 0,
    author: input.author,
    authorId: input.authorId,
    tags: input.tags || [],
    language: input.language,
    framework: input.framework,
    category: input.category,
    visibility: input.visibility || 'public',
    allowComments: input.allowComments !== false,
    downloads: 0,
    createdAt: now,
    updatedAt: now
  };
  
  console.log('createSnippet - Creating snippet with ID:', snippet.id);
  console.log('createSnippet - Snippet title:', snippet.title);
  console.log('createSnippet - Supabase enabled:', isSupabaseEnabled());
  
  // ALWAYS store in memory as primary storage for development
  memorySnippets.unshift(snippet);
  console.log('createSnippet - Added to memory. Total memory snippets:', memorySnippets.length);
  console.log('createSnippet - Memory snippet IDs:', memorySnippets.map(s => s.id).slice(0, 5));
  
  if(isSupabaseAdminEnabled()){
    try {
      console.log('createSnippet - Also attempting to store in Supabase using admin client');
      // Map camelCase to snake_case for database
      const dbSnippet = {
        id: snippet.id,
        title: snippet.title,
        code: snippet.code,
        description: snippet.description,
        price: snippet.price,
        rating: snippet.rating,
        author: snippet.author,
        author_id: snippet.authorId, // Map authorId to author_id
        tags: snippet.tags,
        language: snippet.language,
        framework: snippet.framework,
        category: snippet.category,
        visibility: snippet.visibility,
        allow_comments: snippet.allowComments,
        downloads: snippet.downloads,
        created_at: snippet.createdAt, // Map createdAt to created_at
        updated_at: snippet.updatedAt  // Map updatedAt to updated_at
      };
      
      console.log('createSnippet - Database snippet object:', JSON.stringify(dbSnippet, null, 2));
      const { data: insertResult, error } = await supabaseAdmin!.from('snippets').insert(dbSnippet).select();
      if(error) {
        console.error('createSnippet - Supabase insert error:', JSON.stringify(error, null, 2));
        console.error('createSnippet - Error code:', error.code);
        console.error('createSnippet - Error message:', error.message);
        console.error('createSnippet - Error details:', error.details);
        console.log('createSnippet - Fallback to memory storage is already done');
      } else {
        console.log('createSnippet - Successfully stored in Supabase!');
        console.log('createSnippet - Insert result:', insertResult);
        console.log('createSnippet - Successfully stored in both memory and Supabase');
      }
    } catch (err) {
      console.error('createSnippet - Exception during Supabase insert:', err);
      console.log('createSnippet - Fallback to memory storage is already done');
    }
  } else {
    console.log('createSnippet - Stored only in memory (Supabase admin not enabled)');
  }
  
  return snippet;
}

export interface ListSnippetsOptions {
  query?: string;
  language?: string;
  category?: string;
  sortBy?: string;
  featured?: boolean;
  limit?: number;
  userId?: string;
  publicOnly?: boolean;
}

export async function listSnippets(options?: ListSnippetsOptions | string): Promise<CodeSnippet[]>{
  // Handle legacy string parameter for backward compatibility
  const opts: ListSnippetsOptions = typeof options === 'string' ? { query: options } : (options || {});
  
  // PRIORITIZE SUPABASE DATA - Always try database first
  if(isSupabaseEnabled()){
    try {
      let q = supabase!.from('snippets').select('*');
      
      // Apply filters
      if(opts.query){
        q = q.or(`title.ilike.%${opts.query}%,description.ilike.%${opts.query}%`);
      }
      
      if(opts.language && opts.language !== 'all'){
        q = q.eq('language', opts.language);
      }
      
      if(opts.category && opts.category !== 'all'){
        q = q.eq('category', opts.category);
      }
      
      if(opts.userId){
        q = q.eq('author_id', opts.userId);
      }
      
      if(opts.publicOnly){
        q = q.eq('visibility', 'public');
      }
      
      if(opts.featured){
        q = q.eq('featured', true);
      }
      
      // Handle sorting - prioritize actual database data sorting
      switch(opts.sortBy) {
        case 'popular':
          q = q.order('downloads', { ascending: false });
          break;
        case 'views':
          q = q.order('downloads', { ascending: false }); // Using downloads as proxy for views
          break;
        case 'trending':
          // For trending, use a combination of recent + popular
          q = q.order('downloads', { ascending: false });
          break;
        case 'recent':
        default:
          try {
            q = q.order('created_at', { ascending: false });
          } catch (e) {
            try {
              q = q.order('createdAt', { ascending: false });
            } catch (e2) {
              console.warn('Neither created_at nor createdAt column exists');
            }
          }
          break;
      }
      
      // Apply limit
      if(opts.limit){
        q = q.limit(opts.limit);
      }
      
      const { data, error } = await q;
      
      if(error){
        console.error('Supabase query error:', error);
        // Fall back to demo data if database fails
        console.log('Falling back to demo data due to database error');
        return getFallbackSnippets(opts);
      }
      
      let results = (data || []).map(mapRowToSnippet) as CodeSnippet[];
      
      // For featured snippets, return most popular ones
      if(opts.featured){
        results = results
          .sort((a, b) => (b.downloads || 0) - (a.downloads || 0))
          .slice(0, 3);
      }
      
      console.log(`Retrieved ${results.length} snippets from Supabase`);
      return results;
      
    } catch (error) {
      console.error('Database connection error:', error);
      // Fall back to demo data if there's a connection issue
      console.log('Falling back to demo data due to connection error');
      return getFallbackSnippets(opts);
    }
  }
  
  // MEMORY FALLBACK - Only when Supabase is not available
  console.warn('Supabase not enabled - using demo data');
  return getFallbackSnippets(opts);
}

// Fallback function that provides demo data when database fails
function getFallbackSnippets(opts: ListSnippetsOptions): CodeSnippet[] {
  // Start with demo data if memory is empty
  if (memorySnippets.length === 0) {
    memorySnippets = [...FALLBACK_DEMO_SNIPPETS];
  }
  
  let results = [...memorySnippets];
  
  // Apply same filtering logic to fallback data
  if(opts.query) {
    const ql = opts.query.toLowerCase();
    results = results.filter(s=>
      s.title.toLowerCase().includes(ql) ||
      s.language.toLowerCase().includes(ql) ||
      s.description.toLowerCase().includes(ql) ||
      (s.tags && s.tags.some(tag => tag.toLowerCase().includes(ql)))
    );
  }
  
  if(opts.language && opts.language !== 'all') {
    results = results.filter(s => s.language.toLowerCase() === opts.language!.toLowerCase());
  }
  
  if(opts.category && opts.category !== 'all') {
    results = results.filter(s => s.category?.toLowerCase() === opts.category!.toLowerCase());
  }
  
  if(opts.userId) {
    results = results.filter(s => s.authorId === opts.userId);
  }
  
  if(opts.publicOnly) {
    results = results.filter(s => (s.visibility || 'public') === 'public');
  }
  
  // Sort results
  switch(opts.sortBy) {
    case 'popular':
      results.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      break;
    case 'views':
      results.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      break;
    case 'trending':
      // Trending = recent + popular combined
      results.sort((a, b) => {
        const aScore = (b.downloads || 0) * 0.7 + (new Date(b.createdAt).getTime() / 1000000) * 0.3;
        const bScore = (a.downloads || 0) * 0.7 + (new Date(a.createdAt).getTime() / 1000000) * 0.3;
        return aScore - bScore;
      });
      break;
    case 'recent':
    default:
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }
  
  if(opts.featured){
    results = results.slice(0, 3);
  } else if(opts.limit){
    results = results.slice(0, opts.limit);
  }
  
  return results;
  
  // Apply same filtering logic to memory data
  if(opts.query) {
    const ql = opts.query.toLowerCase();
    results = results.filter(s=>
      s.title.toLowerCase().includes(ql) ||
      s.language.toLowerCase().includes(ql) ||
      s.description.toLowerCase().includes(ql)
    );
  }
  
  if(opts.language && opts.language !== 'all') {
    results = results.filter(s => s.language.toLowerCase() === opts.language!.toLowerCase());
  }
  
  if(opts.userId) {
    results = results.filter(s => s.authorId === opts.userId);
  }
  
  // Sort results
  switch(opts.sortBy) {
    case 'popular':
      results.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      break;
    case 'views':
      results.sort((a, b) => (b.downloads || 0) - (a.downloads || 0));
      break;
    case 'trending':
      // Trending = recent + popular combined
      results.sort((a, b) => {
        const aScore = (b.downloads || 0) * 0.7 + (new Date(b.createdAt).getTime() / 1000000) * 0.3;
        const bScore = (a.downloads || 0) * 0.7 + (new Date(a.createdAt).getTime() / 1000000) * 0.3;
        return aScore - bScore;
      });
      break;
    case 'recent':
    default:
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }
  
  if(opts.featured){
    results = results.slice(0, 3);
  }
  
  if(opts.limit){
    results = results.slice(0, opts.limit);
  }
  return results;
}

export async function getSnippetById(id: string): Promise<CodeSnippet | null>{
  console.log('getSnippetById - Looking for snippet with ID:', id);
  console.log('getSnippetById - Memory snippets count:', memorySnippets.length);
  console.log('getSnippetById - Memory snippets IDs:', memorySnippets.map(s => s.id));
  
  // Check memory first for quick access
  const memoryResult = memorySnippets.find(s=> s.id === id);
  if (memoryResult) {
    console.log('getSnippetById - Found in memory:', memoryResult.title);
    console.log('getSnippetById - Memory snippet code preview:', memoryResult.code.slice(0, 50) + '...');
    return memoryResult;
  }
  
  console.log('getSnippetById - NOT found in memory');
  console.log('getSnippetById - Supabase enabled:', isSupabaseEnabled());
  
  // Try Supabase database (primary storage since memory doesn't persist in serverless)
  if(isSupabaseEnabled()){
    try {
      console.log('getSnippetById - Querying Supabase database');
      const { data, error } = await supabase!.from('snippets').select('*').eq('id', id).maybeSingle();
      if(error){ 
        console.error('getSnippetById - Supabase get error:', error);
        return null;
      }
      if(!data) {
        console.log('getSnippetById - No data returned from Supabase');
        return null;
      }
      console.log('getSnippetById - Found in Supabase:', data.title);
      console.log('getSnippetById - Supabase data preview:', JSON.stringify(data, null, 2).slice(0, 200) + '...');
      const snippet = mapRowToSnippet(data as any);
      // Add to memory for faster future access in this request
      memorySnippets.unshift(snippet);
      console.log('getSnippetById - Added to memory cache for this request');
      return snippet;
    } catch (err) {
      console.error('getSnippetById - Exception during Supabase query:', err);
      return null;
    }
  }
  
  console.log('getSnippetById - Snippet not found anywhere!');
  return null;
}

export async function listPopular(limit = 6): Promise<CodeSnippet[]>{
  if(isSupabaseEnabled()){
    // Try ordering by downloads; if column missing fallback to createdAt
    let { data, error } = await supabase!.from('snippets').select('*').order('downloads', { ascending: false }).limit(limit);
    if(error){
      // 42703 = undefined column
      if((error as any).code === '42703'){
        let retry = await supabase!.from('snippets').select('*').order('createdAt', { ascending: false }).limit(limit);
        if(retry.error && (retry.error as any).code === '42703') {
          retry = await supabase!.from('snippets').select('*').order('created_at', { ascending: false }).limit(limit);
        }
        if(retry.error){ console.error('Supabase popular fallback error', retry.error); return memorySnippets.slice(0, limit); }
        return (retry.data || []).map(mapRowToSnippet) as CodeSnippet[];
      }
      console.error('Supabase popular error', error); return memorySnippets.slice(0, limit);
    }
    return (data || []).map(mapRowToSnippet) as CodeSnippet[];
  }
  return memorySnippets.slice(0, limit);
}

// Defensive helper for missing table situations reused by list/create if extended later
function handleTableMissing(err: any){
  if(!err) return;
  if(err.code === 'PGRST205'){
    // Table not in schema cache – likely not migrated yet. Silent fallback.
    return true; // signal to fallback
  }
  return false;
}

// Map DB row (supports snake_case) to CodeSnippet shape expected by app
function mapRowToSnippet(row: any): CodeSnippet {
  return {
    id: row.id,
    title: row.title,
    code: row.code,
    description: row.description || '',
    price: Number(row.price || 0),
    rating: Number(row.rating || 0),
    author: row.author,
    authorId: row.authorid || row.authorId || row.author_id || 'unknown',
    tags: Array.isArray(row.tags) ? row.tags : [],
    language: row.language,
    framework: row.framework || undefined,
    category: row.category || undefined,
    visibility: row.visibility || 'public',
    allowComments: row.allow_comments !== false,
    downloads: Number(row.downloads || 0),
    createdAt: row.createdAt ?? row.created_at ?? new Date().toISOString(),
    updatedAt: row.updatedAt ?? row.updated_at ?? row.createdAt ?? row.created_at ?? new Date().toISOString(),
  };
}

// Semantic search function for code snippets
export async function semanticSearchSnippets(query: string, limit: number = 10): Promise<CodeSnippet[]> {
  console.log(`semanticSearchSnippets - Query: "${query}", Limit: ${limit}`);
  console.log('semanticSearchSnippets - Supabase enabled:', isSupabaseEnabled());
  
  if (isSupabaseEnabled()) {
    try {
      // First try semantic search using vector database
      console.log('semanticSearchSnippets - Attempting vector search...');
      
      // For now, let's try a simple hybrid approach:
      // 1. Do a text search first
      // 2. Later we can enhance with actual vector embeddings
      
      let results: CodeSnippet[] = [];
      
      // Try text-based search first (fallback that should work)
      const textSearchQuery = supabase!
        .from('snippets')
        .select('*')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%,code.ilike.%${query}%`)
        .limit(limit);
        
      const { data: textData, error: textError } = await textSearchQuery;
      
      if (textError) {
        console.error('semanticSearchSnippets - Text search error:', textError);
      } else {
        results = (textData || []).map(mapRowToSnippet);
        console.log(`semanticSearchSnippets - Found ${results.length} results via text search`);
      }
      
      // If we have vector search available, we could enhance results here
      // For now, return text search results
      return results;
      
    } catch (error) {
      console.error('semanticSearchSnippets - Database error:', error);
      // Fall back to memory search
    }
  }
  
  // Fallback to memory/demo data search
  console.log('semanticSearchSnippets - Using fallback memory search');
  return searchMemorySnippets(query, limit);
}

// Helper function for memory-based search
function searchMemorySnippets(query: string, limit: number): CodeSnippet[] {
  if (memorySnippets.length === 0) {
    // Use demo data if no real snippets exist
    memorySnippets.push(...FALLBACK_DEMO_SNIPPETS);
  }
  
  const queryLower = query.toLowerCase();
  const results = memorySnippets.filter(snippet => 
    snippet.title.toLowerCase().includes(queryLower) ||
    snippet.description.toLowerCase().includes(queryLower) ||
    snippet.code.toLowerCase().includes(queryLower) ||
    snippet.tags.some(tag => tag.toLowerCase().includes(queryLower)) ||
    snippet.language.toLowerCase().includes(queryLower)
  );
  
  return results.slice(0, limit);
}
