/**
 * Utility functions for MCP server
 */

import { NextRequest } from 'next/server';

/**
 * Get base URL for widget routes
 * Handles localhost, ngrok, and production environments
 */
export function getBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host');
  
  // Local development
  if (host?.includes('localhost') || host?.includes('127.0.0.1')) {
    return `http://${host}`;
  }
  
  // ngrok or production
  if (host) {
    return `https://${host}`;
  }
  
  // Fallback
  return process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3001';
}

/**
 * Fetch with timeout
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 5000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`Request timeout: ${url}`);
    }
    throw error;
  }
}

/**
 * Create widget URL
 */
export function createWidgetUrl(
  baseUrl: string,
  widgetName: string,
  data: unknown
): string {
  const encodedData = encodeURIComponent(JSON.stringify(data));
  return `${baseUrl}/widgets/${widgetName}?data=${encodedData}`;
}

