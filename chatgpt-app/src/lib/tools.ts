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
  try {
    const response = await fetchWithTimeout(
      `${NOTES_API}/api/notes`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(args),
      },
      5000
    );

    if (!response.ok) {
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`❌ Notes API error: ${response.status} ${errorText}`);
      throw new Error(`Failed to create note: ${response.status} ${errorText}`);
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
    
    // Add widget for visual display
    // Note: Widgets may cause 424 errors if ChatGPT can't fetch them
    // If you see 424 errors, widgets will be automatically skipped
    try {
      const baseUrl = getBaseUrl(request);
      // Only add widget for HTTPS URLs (ngrok or production)
      if (baseUrl && baseUrl.startsWith('https://') && !baseUrl.includes('localhost')) {
        const widgetUrl = createWidgetUrl(baseUrl, 'note-card', note);
        if (widgetUrl && widgetUrl.startsWith('https://')) {
          content.push({
            type: 'widget',
            url: widgetUrl,
          });
          console.log(`✅ Added widget URL: ${widgetUrl}`);
        }
      } else {
        console.log(`⚠️ Skipping widget - baseUrl: ${baseUrl}`);
      }
    } catch (error) {
      console.warn('⚠️ Could not create widget URL (continuing without widget):', error);
      // Continue without widget - operation still succeeds
    }

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
  const response = await fetchWithTimeout(`${NOTES_API}/api/notes`, {}, 5000);

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
  
  // Add widget for visual display
  try {
    const baseUrl = getBaseUrl(request);
    if (baseUrl && baseUrl.startsWith('https://') && !baseUrl.includes('localhost')) {
      const widgetUrl = createWidgetUrl(baseUrl, 'notes-list', notes);
      if (widgetUrl && widgetUrl.startsWith('https://')) {
        content.push({
          type: 'widget',
          url: widgetUrl,
        });
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not create widget URL:', error);
  }

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
  
  // Add widget for visual display
  try {
    const baseUrl = getBaseUrl(request);
    if (baseUrl && baseUrl.startsWith('https://') && !baseUrl.includes('localhost')) {
      const widgetUrl = createWidgetUrl(baseUrl, 'note-detail', note);
      if (widgetUrl && widgetUrl.startsWith('https://')) {
        content.push({
          type: 'widget',
          url: widgetUrl,
        });
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not create widget URL:', error);
  }

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
  
  // Add widget for visual display
  try {
    const baseUrl = getBaseUrl(request);
    if (baseUrl && baseUrl.startsWith('https://') && !baseUrl.includes('localhost')) {
      const widgetUrl = createWidgetUrl(baseUrl, 'notes-list', notes);
      if (widgetUrl && widgetUrl.startsWith('https://')) {
        content.push({
          type: 'widget',
          url: widgetUrl,
        });
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not create widget URL:', error);
  }

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
  
  // Add widget for visual display
  try {
    const baseUrl = getBaseUrl(request);
    if (baseUrl && baseUrl.startsWith('https://') && !baseUrl.includes('localhost')) {
      const widgetUrl = createWidgetUrl(baseUrl, 'note-card', note);
      if (widgetUrl && widgetUrl.startsWith('https://')) {
        content.push({
          type: 'widget',
          url: widgetUrl,
        });
      }
    }
  } catch (error) {
    console.warn('⚠️ Could not create widget URL:', error);
  }

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

