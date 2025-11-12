/**
 * Types for MCP server and widgets
 */

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface MCPRequest {
  jsonrpc: string;
  id: number | string | null;
  method: string;
  params?: {
    name?: string;
    arguments?: Record<string, unknown>;
  };
}

export interface MCPResponse {
  jsonrpc: string;
  id: number | string | null;
  result?: {
    content?: Array<{
      type: string;
      text?: string;
      url?: string;
    }>;
    tools?: unknown[];
    protocolVersion?: string;
    serverInfo?: {
      name: string;
      version: string;
    };
    capabilities?: {
      tools?: Record<string, unknown>;
    };
  };
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

export interface NotesAPIResponse {
  data: Note | Note[];
  success: boolean;
}

