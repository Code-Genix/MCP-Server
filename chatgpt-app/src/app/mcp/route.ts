/**
 * MCP Server Route Handler
 * Handles all MCP protocol requests from ChatGPT
 */

import { NextRequest, NextResponse } from 'next/server';
import type { MCPRequest } from '../../lib/types';
import {
  handleCreateNote,
  handleListNotes,
  handleGetNote,
  handleSearchNotes,
  handleUpdateNote,
  handleDeleteNote,
} from '../../lib/tools';

const TOOLS_DEFINITION = [
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
];

/**
 * Handle initialize request
 */
function handleInitialize(jsonrpc: string, id: number | string | null) {
  console.log('✅ Handling initialize - responding immediately');
  const response = NextResponse.json(
    {
      jsonrpc: jsonrpc || '2.0',
      id: id ?? null,
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
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
  
  return response;
}

/**
 * Handle tools/list request
 */
function handleToolsList(jsonrpc: string, id: number | string | null) {
  console.log('✅ Handling tools/list - responding immediately');
  const response = NextResponse.json(
    {
      jsonrpc: jsonrpc || '2.0',
      id: id ?? null,
      result: {
        tools: TOOLS_DEFINITION,
      },
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    }
  );
  
  return response;
}

/**
 * Handle tools/call request
 */
async function handleToolsCall(
  params: { name: string; arguments: Record<string, unknown> },
  request: NextRequest,
  jsonrpc: string,
  id: number | string | null
): Promise<NextResponse> {
  const { name, arguments: args } = params;

  // Check if notes API is accessible
  const notesApiUrl = process.env.NOTES_API_URL || 'http://localhost:3000';
  console.log(`📡 Using Notes API: ${notesApiUrl}`);
  
  // Warn if using localhost in production-like environment
  if (notesApiUrl.includes('localhost') && process.env.NODE_ENV === 'production') {
    console.warn('⚠️ WARNING: Using localhost for Notes API in production. This will not work!');
  }

  try {
    switch (name) {
      case 'create_note':
        return handleCreateNote(
          args as { title: string; content: string; tags?: string[] },
          request
        );

      case 'list_notes':
        return handleListNotes(request);

      case 'get_note':
        return handleGetNote(args.id as string, request);

      case 'search_notes':
        return handleSearchNotes(
          args as { query: string; tags?: string[] },
          request
        );

      case 'update_note': {
        const { id, ...updates } = args;
        return handleUpdateNote(id as string, updates, request);
      }

      case 'delete_note':
        return handleDeleteNote(args.id as string);

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
  } catch (error) {
    console.error(`Error handling tool ${name}:`, error);
    return NextResponse.json({
      jsonrpc: jsonrpc || '2.0',
      id: id || 1,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error',
      },
    });
  }
}

/**
 * POST /mcp - Main MCP endpoint
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  try {
    let body: MCPRequest;
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
    console.log(`📨 MCP Request [${method}] - ID: ${id} - Time: ${Date.now() - startTime}ms`);

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

    // Route to appropriate handler
    switch (method) {
      case 'initialize':
        return handleInitialize(jsonrpc, id);

      case 'tools/list':
        return handleToolsList(jsonrpc, id);

      case 'tools/call':
        if (!params || !params.name) {
          return NextResponse.json({
            jsonrpc: jsonrpc || '2.0',
            id: id || null,
            error: {
              code: -32600,
              message: 'Invalid Request: tool name is required',
            },
          });
        }
        return handleToolsCall(
          { name: params.name, arguments: params.arguments || {} },
          request,
          jsonrpc,
          id
        );

      default:
        return NextResponse.json({
          jsonrpc: jsonrpc || '2.0',
          id: id || null,
          error: {
            code: -32601,
            message: `Unknown method: ${method}`,
          },
        });
    }
  } catch (error) {
    console.error('❌ MCP Error:', error);
    return NextResponse.json({
      jsonrpc: '2.0',
      id: 1,
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error',
      },
    });
  }
}

/**
 * GET /mcp - Health check endpoint
 */
export async function GET(request: NextRequest) {
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
