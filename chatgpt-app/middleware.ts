import { NextRequest, NextResponse } from 'next/server';

/**
 * CORS Middleware - Required for ChatGPT Apps SDK
 * Handles OPTIONS preflight requests for cross-origin RSC fetching
 */
export function middleware(request: NextRequest) {
  // Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': '*',
        'Access-Control-Max-Age': '86400',
      },
    });
  }

  // Add CORS headers to all responses
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', '*');

  return response;
}

export const config = {
  matcher: '/:path*',
};


