import { NextRequest, NextResponse } from 'next/server';

const NOTES_API = process.env.NOTES_API_URL || 'http://localhost:3000';

// Helper function to fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000) {
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
 * MCP Server Route - Official ChatGPT Apps SDK Pattern
 * Based on: https://github.com/vercel-labs/chatgpt-apps-sdk-nextjs-starter
 */

export async function POST(request: NextRequest) {
  // Set a timeout for the entire request
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), 8000);
  });

  try {
    // Race between the actual request and timeout
    await Promise.race([
      (async () => {
        // Log request headers for debugging
        const headers: Record<string, string> = {};
        request.headers.forEach((value, key) => {
          headers[key] = value;
        });
        console.log('📨 Request headers:', headers);

        let body;
        try {
          body = await request.json();
        } catch (parseError) {
          console.error('❌ Failed to parse JSON:', parseError);
          return NextResponse.json(
            {
              jsonrpc: '2.0',
              id: null,
              error: {
                code: -32700,
                message: 'Parse error: Invalid JSON',
              },
            },
            { status: 400 }
          );
        }

        const { method, params, jsonrpc, id } = body;

        console.log('📨 MCP Request:', { method, params, jsonrpc, id });
        console.log('📨 Full body:', JSON.stringify(body, null, 2));

    // Validate required fields
    if (!method) {
      return NextResponse.json({
        jsonrpc: jsonrpc || '2.0',
        id: id || null,
        error: {
          code: -32600,
          message: 'Invalid Request: method is required',
        },
      });
    }

    // Handle initialize request (required for MCP protocol)
    if (method === 'initialize') {
      console.log('✅ Handling initialize request');
      const response = NextResponse.json({
        jsonrpc: jsonrpc || '2.0',
        id: id || 1,
        result: {
          protocolVersion: '2024-11-05',
          serverInfo: {
            name: 'notes-mcp-server',
            version: '1.0.0',
          },
          capabilities: {
            tools: {},
          },
        },
      });
      
      // Ensure CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Content-Type', 'application/json');
      
      return response;
    }

    // Handle tools/list request
    if (method === 'tools/list') {
      console.log('✅ Handling tools/list request');
      return NextResponse.json({
        tools: [
          {
            name: 'create_note',
            description: 'Create a new note with title, content, and optional tags',
            inputSchema: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'The title of the note' },
                content: { type: 'string', description: 'The content (supports markdown)' },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Optional tags',
                },
              },
              required: ['title', 'content'],
            },
          },
          {
            name: 'list_notes',
            description: 'List all notes',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_note',
            description: 'Get a specific note by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Note ID' },
              },
              required: ['id'],
            },
          },
          {
            name: 'search_notes',
            description: 'Search notes by query',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query' },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'Optional tags filter',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'update_note',
            description: 'Update an existing note',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Note ID' },
                title: { type: 'string', description: 'New title (optional)' },
                content: { type: 'string', description: 'New content (optional)' },
                tags: {
                  type: 'array',
                  items: { type: 'string' },
                  description: 'New tags (optional)',
                },
              },
              required: ['id'],
            },
          },
          {
            name: 'delete_note',
            description: 'Delete a note by ID',
            inputSchema: {
              type: 'object',
              properties: {
                id: { type: 'string', description: 'Note ID' },
              },
              required: ['id'],
            },
          },
        ],
        },
      });
      
      // Ensure CORS headers
      response.headers.set('Access-Control-Allow-Origin', '*');
      response.headers.set('Content-Type', 'application/json');
      
      return response;
    }

    // Handle tools/call request
    if (method === 'tools/call') {
      const { name, arguments: args } = params;

      console.log('🔧 Calling tool:', name, args);
      console.log('🔗 Notes API URL:', NOTES_API);

      // Check if notes API is configured
      if (!process.env.NOTES_API_URL && NOTES_API.includes('localhost')) {
        return NextResponse.json({
          jsonrpc: jsonrpc || '2.0',
          id: id || 1,
          error: {
            code: -32603,
            message: 'Notes API not configured. Please set NOTES_API_URL environment variable in Vercel.',
            data: {
              hint: 'Set NOTES_API_URL in Vercel project settings to your notes backend URL',
            },
          },
        });
      }

      let result;

      switch (name) {
        case 'create_note': {
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
            throw new Error(`Failed to create note: ${response.statusText}`);
          }

          const result = await response.json();
          const note = result.data;

          return NextResponse.json({
            jsonrpc: jsonrpc || '2.0',
            id: id || 1,
            result: {
              content: [
                {
                  type: 'text',
                  text: `✓ Created note: "${note.title}"${note.tags.length > 0 ? ` (${note.tags.join(', ')})` : ''}`,
                },
              ],
            },
          });
        }

        case 'list_notes': {
          const response = await fetchWithTimeout(`${NOTES_API}/api/notes`, {}, 5000);

          if (!response.ok) {
            throw new Error(`Failed to list notes: ${response.statusText}`);
          }

          const result = await response.json();
          const notes = result.data;

          if (notes.length === 0) {
            return NextResponse.json({
              jsonrpc: jsonrpc || '2.0',
              id: id || 1,
              result: {
                content: [
                  {
                    type: 'text',
                    text: '📭 No notes yet. Create your first note!',
                  },
                ],
              },
            });
          }

          const notesList = notes
            .map((note: any, index: number) => 
              `${index + 1}. **${note.title}**${note.tags.length > 0 ? ` (${note.tags.join(', ')})` : ''}`
            )
            .join('\n');

          return NextResponse.json({
            jsonrpc: jsonrpc || '2.0',
            id: id || 1,
            result: {
              content: [
                {
                  type: 'text',
                  text: `📚 Found ${notes.length} note${notes.length !== 1 ? 's' : ''}:\n\n${notesList}`,
                },
              ],
            },
          });
        }

        case 'get_note': {
          const response = await fetchWithTimeout(`${NOTES_API}/api/notes/${args.id}`, {}, 5000);

          if (!response.ok) {
            if (response.status === 404) {
              return NextResponse.json({
                jsonrpc: jsonrpc || '2.0',
                id: id || 1,
                error: {
                  code: -32001,
                  message: 'Note not found',
                },
              });
            }
            throw new Error(`Failed to get note: ${response.statusText}`);
          }

          const result = await response.json();
          const note = result.data;

          return NextResponse.json({
            jsonrpc: jsonrpc || '2.0',
            id: id || 1,
            result: {
              content: [
                {
                  type: 'text',
                  text: `# ${note.title}\n\n${note.content}\n\n${note.tags.length > 0 ? `🏷️ Tags: ${note.tags.join(', ')}` : ''}`,
                },
              ],
            },
          });
        }

        case 'search_notes': {
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

          const result = await response.json();
          const notes = result.data;

          if (notes.length === 0) {
            return NextResponse.json({
              jsonrpc: jsonrpc || '2.0',
              id: id || 1,
              result: {
                content: [
                  {
                    type: 'text',
                    text: `🔍 No results found for "${args.query}"`,
                  },
                ],
              },
            });
          }

          const resultsList = notes
            .map((note: any, index: number) => 
              `${index + 1}. **${note.title}** - ${note.content.substring(0, 60)}...`
            )
            .join('\n');

          return NextResponse.json({
            jsonrpc: jsonrpc || '2.0',
            id: id || 1,
            result: {
              content: [
                {
                  type: 'text',
                  text: `🔍 Found ${notes.length} result${notes.length !== 1 ? 's' : ''} for "${args.query}":\n\n${resultsList}`,
                },
              ],
            },
          });
        }

        case 'update_note': {
          const { id, ...updates } = args;

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
                jsonrpc: jsonrpc || '2.0',
                id: id || 1,
                error: {
                  code: -32001,
                  message: 'Note not found',
                },
              });
            }
            throw new Error(`Failed to update note: ${response.statusText}`);
          }

          const result = await response.json();
          const note = result.data;

          return NextResponse.json({
            jsonrpc: jsonrpc || '2.0',
            id: id || 1,
            result: {
              content: [
                {
                  type: 'text',
                  text: `✓ Updated note: "${note.title}"`,
                },
              ],
            },
          });
        }

        case 'delete_note': {
          const response = await fetchWithTimeout(
            `${NOTES_API}/api/notes/${args.id}`,
            {
              method: 'DELETE',
            },
            5000
          );

          if (!response.ok) {
            if (response.status === 404) {
              return NextResponse.json({
                jsonrpc: jsonrpc || '2.0',
                id: id || 1,
                error: {
                  code: -32001,
                  message: 'Note not found',
                },
              });
            }
            throw new Error(`Failed to delete note: ${response.statusText}`);
          }

          return NextResponse.json({
            jsonrpc: jsonrpc || '2.0',
            id: id || 1,
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

        default:
          return NextResponse.json({
            jsonrpc: jsonrpc || '2.0',
            id: id || 1,
            error: {
              code: -32601,
              message: `Unknown tool: ${name}`,
            },
          });
      }
    }

    // Unknown method
    return NextResponse.json({
      jsonrpc: jsonrpc || '2.0',
      id: id || 1,
      error: {
        code: -32601,
        message: `Unknown method: ${method}`,
      },
    });
  } catch (error) {
    console.error('❌ MCP Error:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json({
      jsonrpc: '2.0',
      id: 1,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error',
        data: error instanceof Error ? error.stack : String(error),
      },
    });
  }
}

/**
 * GET /mcp - Health check / Server info
 */
export async function GET(request: NextRequest) {
  console.log('📨 GET request to /mcp');
  
  return NextResponse.json(
    {
      name: 'notes-mcp-server',
      version: '1.0.0',
      description: 'MCP Notes Server for ChatGPT',
      protocol: 'mcp',
      status: 'ok',
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
      },
    }
  );
}

