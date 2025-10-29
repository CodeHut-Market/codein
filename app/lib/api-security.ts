// API Route Security Wrapper
// Usage: Wrap your API routes with this function to apply security middleware

import { NextRequest, NextResponse } from 'next/server';
import { securityMiddleware } from './security';

export type APIHandler = (req: NextRequest) => Promise<NextResponse>;

// Wrapper function to apply security middleware to API routes
export function withSecurity(handler: APIHandler): APIHandler {
  return async (request: NextRequest): Promise<NextResponse> => {
    return await securityMiddleware(request, handler);
  };
}

// Example usage in API routes:
/*
// app/api/snippets/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withSecurity } from '@/lib/api-security';

async function GET(request: NextRequest) {
  // Your API logic here
  return NextResponse.json({ message: 'Success' });
}

export { withSecurity(GET) as GET };
*/

// Utility for common API responses
export const ApiResponse = {
  success: <T>(data: T, status: number = 200) => {
    return NextResponse.json({ success: true, data }, { status });
  },
  
  error: (message: string, status: number = 400, details?: Record<string, unknown>) => {
    return NextResponse.json({ 
      success: false, 
      error: message,
      ...(details && { details })
    }, { status });
  },
  
  unauthorized: (message: string = 'Unauthorized') => {
    return NextResponse.json({ 
      success: false, 
      error: message 
    }, { status: 401 });
  },
  
  forbidden: (message: string = 'Forbidden') => {
    return NextResponse.json({ 
      success: false, 
      error: message 
    }, { status: 403 });
  },
  
  notFound: (message: string = 'Not found') => {
    return NextResponse.json({ 
      success: false, 
      error: message 
    }, { status: 404 });
  },
  
  serverError: (message: string = 'Internal server error') => {
    return NextResponse.json({ 
      success: false, 
      error: message 
    }, { status: 500 });
  }
};