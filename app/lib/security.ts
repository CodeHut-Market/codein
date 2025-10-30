import { createClient, User } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

// Rate limiting store (in production, use Redis or similar)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Security configuration
const SECURITY_CONFIG = {
  // Rate limiting
  MAX_REQUESTS_PER_MINUTE: 60,
  MAX_AUTH_REQUESTS_PER_HOUR: 10,
  RATE_LIMIT_WINDOW_MS: 60 * 1000, // 1 minute
  AUTH_RATE_LIMIT_WINDOW_MS: 60 * 60 * 1000, // 1 hour
  
  // Input validation
  MAX_INPUT_LENGTH: 10000,
  MAX_ARRAY_LENGTH: 100,
  
  // API restrictions
  ALLOWED_ORIGINS: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] // Replace with actual domain
    : ['http://localhost:3000', 'http://localhost:8080'],
    
  // Sensitive endpoints
  PROTECTED_ENDPOINTS: [
    '/api/admin',
    '/api/analytics',
    '/api/users',
    '/api/payments'
  ],
  
  // Public endpoints that don't require authentication
  PUBLIC_ENDPOINTS: [
    '/api/snippets',
    '/api/ping',
    '/api/health'
  ]
};

// Create admin Supabase client for server-side operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// Rate limiting function
export function checkRateLimit(identifier: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;
  
  // Clean up old entries
  for (const [key, value] of rateLimitStore.entries()) {
    if (value.resetTime < windowStart) {
      rateLimitStore.delete(key);
    }
  }
  
  const entry = rateLimitStore.get(identifier);
  
  if (!entry) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.resetTime < now) {
    rateLimitStore.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (entry.count >= maxRequests) {
    return false;
  }
  
  entry.count += 1;
  return true;
}

// Input validation and sanitization
export function validateAndSanitizeInput(data: unknown): { isValid: boolean; errors: string[]; sanitized?: unknown } {
  const errors: string[] = [];
  
  if (!data) {
    return { isValid: true, errors: [], sanitized: data };
  }
  
  // Deep clone to avoid mutating original data
  let sanitized: unknown;
  
  try {
    sanitized = JSON.parse(JSON.stringify(data));
  } catch (error) {
    errors.push('Invalid JSON data');
    return { isValid: false, errors };
  }
  
  // Recursive validation and sanitization
  function sanitizeRecursive(obj: unknown, path: string = '', depth: number = 0): unknown {
    // Prevent infinite recursion
    if (depth > 10) {
      errors.push(`Data too deeply nested at path: ${path}`);
      return obj;
    }
    
    if (typeof obj === 'string') {
      // Check string length
      if (obj.length > SECURITY_CONFIG.MAX_INPUT_LENGTH) {
        errors.push(`String too long at path: ${path} (max ${SECURITY_CONFIG.MAX_INPUT_LENGTH} characters)`);
        return obj.substring(0, SECURITY_CONFIG.MAX_INPUT_LENGTH);
      }
      
      // Basic XSS prevention - remove potentially dangerous characters
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    
    if (Array.isArray(obj)) {
      if (obj.length > SECURITY_CONFIG.MAX_ARRAY_LENGTH) {
        errors.push(`Array too long at path: ${path} (max ${SECURITY_CONFIG.MAX_ARRAY_LENGTH} items)`);
        return obj.slice(0, SECURITY_CONFIG.MAX_ARRAY_LENGTH);
      }
      
      return obj.map((item, index) => 
        sanitizeRecursive(item, `${path}[${index}]`, depth + 1)
      );
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const sanitizedObj: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        // Sanitize object keys
        const sanitizedKey = key.replace(/[^\w\-_]/g, '').substring(0, 100);
        if (sanitizedKey !== key) {
          errors.push(`Invalid characters in object key: ${key}`);
        }
        
        sanitizedObj[sanitizedKey] = sanitizeRecursive(
          value, 
          path ? `${path}.${sanitizedKey}` : sanitizedKey, 
          depth + 1
        );
      }
      return sanitizedObj;
    }
    
    return obj;
  }
  
  const sanitizedData = sanitizeRecursive(sanitized);
  
  return {
    isValid: errors.length === 0,
    errors,
    sanitized: sanitizedData
  };
}

// CORS validation
export function validateCORS(request: NextRequest): boolean {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // Allow same-origin requests
  if (!origin && !referer) return true;
  
  // Check allowed origins
  if (origin && SECURITY_CONFIG.ALLOWED_ORIGINS.includes(origin)) {
    return true;
  }
  
  if (referer) {
    const refererUrl = new URL(referer);
    const refererOrigin = `${refererUrl.protocol}//${refererUrl.host}`;
    if (SECURITY_CONFIG.ALLOWED_ORIGINS.includes(refererOrigin)) {
      return true;
    }
  }
  
  return false;
}

// Authentication validation
export async function validateAuthentication(request: NextRequest): Promise<{
  isValid: boolean;
  user: User | null;
  error?: string;
}> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return { isValid: false, user: null, error: 'Missing or invalid authorization header' };
    }
    
    const token = authHeader.substring(7);
    
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    
    if (error || !user) {
      return { isValid: false, user: null, error: 'Invalid token' };
    }
    
    return { isValid: true, user };
  } catch (error) {
    return { isValid: false, user: null, error: 'Authentication error' };
  }
}

// Main security middleware function
export async function securityMiddleware(
  request: NextRequest,
  handler: (req: NextRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const { pathname } = request.nextUrl;
  const clientIP = request.ip || request.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request.headers.get('user-agent') || '';
  
  // Security headers
  const securityHeaders = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  };
  
  try {
    // 1. CORS validation
    if (!validateCORS(request)) {
      return new NextResponse('CORS policy violation', {
        status: 403,
        headers: securityHeaders
      });
    }
    
    // 2. Rate limiting
    const isAuthEndpoint = pathname.includes('/auth/') || pathname.includes('/login') || pathname.includes('/signup');
    const rateLimitKey = `${clientIP}:${isAuthEndpoint ? 'auth' : 'api'}`;
    
    const rateLimitPassed = isAuthEndpoint
      ? checkRateLimit(rateLimitKey, SECURITY_CONFIG.MAX_AUTH_REQUESTS_PER_HOUR, SECURITY_CONFIG.AUTH_RATE_LIMIT_WINDOW_MS)
      : checkRateLimit(rateLimitKey, SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE, SECURITY_CONFIG.RATE_LIMIT_WINDOW_MS);
    
    if (!rateLimitPassed) {
      return new NextResponse('Rate limit exceeded', {
        status: 429,
        headers: {
          ...securityHeaders,
          'Retry-After': isAuthEndpoint ? '3600' : '60',
          'X-RateLimit-Limit': isAuthEndpoint 
            ? SECURITY_CONFIG.MAX_AUTH_REQUESTS_PER_HOUR.toString()
            : SECURITY_CONFIG.MAX_REQUESTS_PER_MINUTE.toString(),
          'X-RateLimit-Remaining': '0'
        }
      });
    }
    
    // 3. Authentication check for protected endpoints
    const isProtectedEndpoint = SECURITY_CONFIG.PROTECTED_ENDPOINTS.some(endpoint => 
      pathname.startsWith(endpoint)
    );
    
    const isPublicEndpoint = SECURITY_CONFIG.PUBLIC_ENDPOINTS.some(endpoint => 
      pathname.startsWith(endpoint)
    );
    
    if (isProtectedEndpoint || (!isPublicEndpoint && pathname.startsWith('/api/'))) {
      const auth = await validateAuthentication(request);
      if (!auth.isValid) {
        return new NextResponse('Unauthorized', {
          status: 401,
          headers: securityHeaders
        });
      }
      
      // Add user to request context (if needed by the handler)
      // Note: In Next.js, this would typically be done through middleware context
    }
    
    // 4. Input validation for POST/PUT requests
    if (request.method === 'POST' || request.method === 'PUT') {
      try {
        const rawBody = await request.text();
        if (rawBody) {
          const data = JSON.parse(rawBody);
          const validation = validateAndSanitizeInput(data);
          
          if (!validation.isValid) {
            return NextResponse.json(
              { 
                error: 'Invalid input data',
                details: validation.errors.slice(0, 5) // Limit error details
              },
              { 
                status: 400,
                headers: securityHeaders
              }
            );
          }
          
          // Create new request with sanitized data
          const sanitizedRequest = new NextRequest(request.url, {
            method: request.method,
            headers: request.headers,
            body: JSON.stringify(validation.sanitized)
          });
          
          // Call the actual handler with sanitized request
          const response = await handler(sanitizedRequest);
          
          // Add security headers to response
          Object.entries(securityHeaders).forEach(([key, value]) => {
            response.headers.set(key, value);
          });
          
          return response;
        }
      } catch (error) {
        return new NextResponse('Invalid JSON', {
          status: 400,
          headers: securityHeaders
        });
      }
    }
    
    // Call the actual handler
    const response = await handler(request);
    
    // Add security headers to response
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
    
  } catch (error) {
    console.error('Security middleware error:', error);
    
    return new NextResponse('Internal server error', {
      status: 500,
      headers: securityHeaders
    });
  }
}

// Utility functions for specific security checks
export const securityUtils = {
  // Check if request is from a suspicious IP
  isSuspiciousIP: (ip: string): boolean => {
    // Placeholder for IP reputation checking
    // In production, you would integrate with IP reputation services
    return false;
  },
  
  // Log security events
  logSecurityEvent: (event: string, details: Record<string, unknown>) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SECURITY] ${event}:`, details);
    }
    // In production, send to your logging service
  },
  
  // Generate secure tokens
  generateSecureToken: (): string => {
    return crypto.randomUUID();
  },
  
  // Hash sensitive data (placeholder)
  hashSensitiveData: (data: string): string => {
    // In production, use proper hashing with salt
    return btoa(data); // Base64 encoding as placeholder
  }
};

// Export types
export type SecurityMiddlewareConfig = typeof SECURITY_CONFIG;
export type ValidationResult = ReturnType<typeof validateAndSanitizeInput>;
export type AuthResult = Awaited<ReturnType<typeof validateAuthentication>>;