/**
 * MCP Tool Handlers
 * Handles all tool calls and returns appropriate responses
 */

import { NextRequest, NextResponse } from 'next/server';
import { fetchWithTimeout, getBaseUrl, createWidgetUrl } from './utils';
import type { Note, NotesAPIResponse } from './types';

const NOTES_API = process.env.NOTES_API_URL || 'http://localhost:3000';

/**
 * Handle create_note tool
 */
export async function handleCreateNote(
  args: { title: string; content: string; tags?: string[] },
  request: NextRequest
): Promise<NextResponse> {
  // Check if NOTES_API is configured (only check in production/Vercel)
  // In local development, localhost:3000 is fine
  if (process.env.NODE_ENV === 'production' && (!NOTES_API || NOTES_API.includes('localhost'))) {
    const errorMsg = 'Notes API not configured. Please set NOTES_API_URL environment variable in Vercel to your ngrok URL for port 3000.';
    console.error(`❌ ${errorMsg}`);
    throw new Error(errorMsg);
  }

  try {
    console.log(`📡 Calling Notes API: ${NOTES_API}/api/notes`);
    console.log(`📡 Request body:`, JSON.stringify(args));
    
    const response = await fetchWithTimeout(
      `${NOTES_API}/api/notes`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      },
      15000 // Increased timeout for Vercel + ngrok
    );

    console.log(`📡 Response status: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`❌ Notes API error: ${response.status} ${errorText}`);
      console.error(`❌ Notes API URL was: ${NOTES_API}/api/notes`);
      throw new Error(`Failed to create note: ${response.status} ${errorText}. API URL: ${NOTES_API}`);
    }

    const result: NotesAPIResponse = await response.json();
    const note = result.data as Note;
    
    // Build response content
    const content: Array<{ type: string; text?: string; url?: string }> = [
      {
        type: 'text',
        text: `✓ Created note: "${note.title}"${note.tags.length > 0 ? ` (${note.tags.join(', ')})` : ''}`,
      },
    ];
    
    // Widgets disabled: ChatGPT Apps SDK has issues fetching widgets via ngrok (424 errors)
    // Widgets work better when deployed to Vercel
    // To re-enable: Uncomment the code below after deploying to Vercel
    // try {
    //   const baseUrl = getBaseUrl(request);
    //   if (baseUrl && baseUrl.startsWith('https://') && !baseUrl.includes('localhost')) {
    //     const widgetUrl = createWidgetUrl(baseUrl, 'note-card', note);
    //     if (widgetUrl && widgetUrl.startsWith('https://')) {
    //       content.push({
    //         type: 'widget',
    //         url: widgetUrl,
    //       });
    //     }
    //   }
    // } catch (error) {
    //   console.warn('⚠️ Could not create widget URL:', error);
    // }

    return NextResponse.json({
      jsonrpc: '2.0',
      id: 1,
      result: {
        content,
      },
    });
  } catch (error) {
    console.error('❌ Error in handleCreateNote:', error);
    throw error;
  }
}

/**
 * Handle list_notes tool
 */
export async function handleListNotes(
  request: NextRequest
): Promise<NextResponse> {
  // Check if NOTES_API is configured (only check in production/Vercel)
  if (process.env.NODE_ENV === 'production' && (!NOTES_API || NOTES_API.includes('localhost'))) {
    throw new Error('Notes API not configured. Please set NOTES_API_URL environment variable in Vercel to your ngrok URL for port 3000.');
  }

  const response = await fetchWithTimeout(`${NOTES_API}/api/notes`, {}, 10000);

  if (!response.ok) {
    throw new Error(`Failed to list notes: ${response.statusText}`);
  }

  const result: NotesAPIResponse = await response.json();
  const notes = result.data as Note[];
  
  // Build response content
  const content: Array<{ type: string; text?: string; url?: string }> = [];
  
  if (notes.length === 0) {
    content.push({
      type: 'text',
      text: '📭 No notes yet. Create your first note!',
    });
  } else {
    content.push({
      type: 'text',
      text: `📚 Found ${notes.length} note${notes.length !== 1 ? 's' : ''}`,
    });
  }
  
  // Widgets disabled: ChatGPT Apps SDK has issues fetching widgets via ngrok (424 errors)
  // TODO: Re-enable widgets after deploying to Vercel

  return NextResponse.json({
    jsonrpc: '2.0',
    id: 1,
    result: {
      content,
    },
  });
}

/**
 * Handle get_note tool
 */
export async function handleGetNote(
  id: string,
  request: NextRequest
): Promise<NextResponse> {
  const response = await fetchWithTimeout(`${NOTES_API}/api/notes/${id}`, {}, 5000);

  if (!response.ok) {
    if (response.status === 404) {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32001,
          message: 'Note not found',
        },
      });
    }
    throw new Error(`Failed to get note: ${response.statusText}`);
  }

  const result: NotesAPIResponse = await response.json();
  const note = result.data as Note;
  
  const content: Array<{ type: string; text?: string; url?: string }> = [
    {
      type: 'text',
      text: `📝 Note: "${note.title}"`,
    },
  ];
  
  // Widgets disabled: ChatGPT Apps SDK has issues fetching widgets via ngrok (424 errors)
  // TODO: Re-enable widgets after deploying to Vercel

  return NextResponse.json({
    jsonrpc: '2.0',
    id: 1,
    result: {
      content,
    },
  });
}

/**
 * Handle search_notes tool
 */
export async function handleSearchNotes(
  args: { query: string; tags?: string[] },
  request: NextRequest
): Promise<NextResponse> {
  const response = await fetchWithTimeout(
    `${NOTES_API}/api/notes/search`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    },
    5000
  );

  if (!response.ok) {
    throw new Error(`Failed to search notes: ${response.statusText}`);
  }

  const result: NotesAPIResponse = await response.json();
  const notes = result.data as Note[];
  
  const content: Array<{ type: string; text?: string; url?: string }> = [];
  
  if (notes.length === 0) {
    content.push({
      type: 'text',
      text: `🔍 No results found for "${args.query}"`,
    });
  } else {
    content.push({
      type: 'text',
      text: `🔍 Found ${notes.length} result${notes.length !== 1 ? 's' : ''} for "${args.query}"`,
    });
  }
  
  // Widgets disabled: ChatGPT Apps SDK has issues fetching widgets via ngrok (424 errors)
  // TODO: Re-enable widgets after deploying to Vercel

  return NextResponse.json({
    jsonrpc: '2.0',
    id: 1,
    result: {
      content,
    },
  });
}

/**
 * Handle update_note tool
 */
export async function handleUpdateNote(
  id: string,
  updates: Partial<Note>,
  request: NextRequest
): Promise<NextResponse> {
  const response = await fetchWithTimeout(
    `${NOTES_API}/api/notes/${id}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    },
    5000
  );

  if (!response.ok) {
    if (response.status === 404) {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32001,
          message: 'Note not found',
        },
      });
    }
    throw new Error(`Failed to update note: ${response.statusText}`);
  }

  const result: NotesAPIResponse = await response.json();
  const note = result.data as Note;
  
  const content: Array<{ type: string; text?: string; url?: string }> = [
    {
      type: 'text',
      text: `✓ Updated note: "${note.title}"`,
    },
  ];
  
  // Widgets disabled: ChatGPT Apps SDK has issues fetching widgets via ngrok (424 errors)
  // TODO: Re-enable widgets after deploying to Vercel

  return NextResponse.json({
    jsonrpc: '2.0',
    id: 1,
    result: {
      content,
    },
  });
}

/**
 * Handle delete_note tool
 */
export async function handleDeleteNote(id: string): Promise<NextResponse> {
  const response = await fetchWithTimeout(
    `${NOTES_API}/api/notes/${id}`,
    {
      method: 'DELETE',
    },
    5000
  );

  if (!response.ok) {
    if (response.status === 404) {
      return NextResponse.json({
        jsonrpc: '2.0',
        id: 1,
        error: {
          code: -32001,
          message: 'Note not found',
        },
      });
    }
    throw new Error(`Failed to delete note: ${response.statusText}`);
  }

  return NextResponse.json({
    jsonrpc: '2.0',
    id: 1,
    result: {
      content: [
        {
          type: 'text',
          text: '✓ Note deleted successfully',
        },
      ],
    },
  });
}

