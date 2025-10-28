#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListResourcesRequestSchema,
  ListToolsRequestSchema,
  ReadResourceRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { NotesStorage } from './storage/NotesStorage.js';
import {
  CreateNoteSchema,
  UpdateNoteSchema,
  SearchNotesSchema,
  DeleteNoteSchema,
  GetNoteSchema,
} from './types.js';

/**
 * MCP Notes Server
 * Provides tools and resources for managing notes
 */
class NotesServer {
  private server: Server;
  private storage: NotesStorage;

  constructor() {
    this.server = new Server(
      {
        name: 'mcp-notes-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.storage = new NotesStorage();
    this.setupHandlers();
  }

  /**
   * Setup all MCP handlers
   */
  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'create_note',
          description: 'Create a new note with title, content, and optional tags',
          inputSchema: {
            type: 'object',
            properties: {
              title: {
                type: 'string',
                description: 'The title of the note',
              },
              content: {
                type: 'string',
                description: 'The content of the note (supports markdown)',
              },
              tags: {
                type: 'array',
                items: { type: 'string' },
                description: 'Optional tags to categorize the note',
              },
            },
            required: ['title', 'content'],
          },
        },
        {
          name: 'get_note',
          description: 'Get a specific note by ID',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'The ID of the note to retrieve',
              },
            },
            required: ['id'],
          },
        },
        {
          name: 'update_note',
          description: 'Update an existing note',
          inputSchema: {
            type: 'object',
            properties: {
              id: {
                type: 'string',
                description: 'The ID of the note to update',
              },
              title: {
                type: 'string',
                description: 'New title (optional)',
              },
              content: {
                type: 'string',
                description: 'New content (optional)',
              },
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
              id: {
                type: 'string',
                description: 'The ID of the note to delete',
              },
            },
            required: ['id'],
          },
        },
        {
          name: 'search_notes',
          description: 'Search notes by query text and/or tags',
          inputSchema: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'Search query to match in title or content',
              },
              tags: {
                type: 'array',
                items: { type: 'string' },
                description: 'Filter by tags (optional)',
              },
            },
            required: ['query'],
          },
        },
        {
          name: 'list_tags',
          description: 'Get all unique tags used across all notes',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'create_note': {
            const input = CreateNoteSchema.parse(request.params.arguments);
            const note = await this.storage.createNote(input);
            return {
              content: [
                {
                  type: 'text',
                  text: `Note created successfully!\n\nID: ${note.id}\nTitle: ${note.title}\nTags: ${note.tags.join(', ') || 'none'}\nCreated: ${note.createdAt}`,
                },
              ],
            };
          }

          case 'get_note': {
            const input = GetNoteSchema.parse(request.params.arguments);
            const note = await this.storage.getNote(input.id);
            
            if (!note) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `Note with ID "${input.id}" not found.`,
                  },
                ],
                isError: true,
              };
            }

            return {
              content: [
                {
                  type: 'text',
                  text: `# ${note.title}\n\n${note.content}\n\n---\nID: ${note.id}\nTags: ${note.tags.join(', ') || 'none'}\nCreated: ${note.createdAt}\nUpdated: ${note.updatedAt}`,
                },
              ],
            };
          }

          case 'update_note': {
            const input = UpdateNoteSchema.parse(request.params.arguments);
            const note = await this.storage.updateNote(input);
            
            if (!note) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `Note with ID "${input.id}" not found.`,
                  },
                ],
                isError: true,
              };
            }

            return {
              content: [
                {
                  type: 'text',
                  text: `Note updated successfully!\n\nID: ${note.id}\nTitle: ${note.title}\nTags: ${note.tags.join(', ') || 'none'}\nUpdated: ${note.updatedAt}`,
                },
              ],
            };
          }

          case 'delete_note': {
            const input = DeleteNoteSchema.parse(request.params.arguments);
            const success = await this.storage.deleteNote(input.id);
            
            if (!success) {
              return {
                content: [
                  {
                    type: 'text',
                    text: `Note with ID "${input.id}" not found.`,
                  },
                ],
                isError: true,
              };
            }

            return {
              content: [
                {
                  type: 'text',
                  text: `Note with ID "${input.id}" deleted successfully.`,
                },
              ],
            };
          }

          case 'search_notes': {
            const input = SearchNotesSchema.parse(request.params.arguments);
            const notes = await this.storage.searchNotes(input.query, input.tags);
            
            if (notes.length === 0) {
              return {
                content: [
                  {
                    type: 'text',
                    text: 'No notes found matching your search criteria.',
                  },
                ],
              };
            }

            const results = notes.map(
              note => `### ${note.title}\nID: ${note.id}\nTags: ${note.tags.join(', ') || 'none'}\nPreview: ${note.content.slice(0, 100)}${note.content.length > 100 ? '...' : ''}\n`
            ).join('\n');

            return {
              content: [
                {
                  type: 'text',
                  text: `Found ${notes.length} note(s):\n\n${results}`,
                },
              ],
            };
          }

          case 'list_tags': {
            const tags = await this.storage.getAllTags();
            
            return {
              content: [
                {
                  type: 'text',
                  text: tags.length > 0 
                    ? `Available tags: ${tags.join(', ')}` 
                    : 'No tags found.',
                },
              ],
            };
          }

          default:
            return {
              content: [
                {
                  type: 'text',
                  text: `Unknown tool: ${request.params.name}`,
                },
              ],
              isError: true,
            };
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : String(error)}`,
            },
          ],
          isError: true,
        };
      }
    });

    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      const notes = await this.storage.listNotes();
      
      return {
        resources: [
          {
            uri: 'notes://all',
            name: 'All Notes',
            description: 'List of all notes with metadata',
            mimeType: 'application/json',
          },
          ...notes.map(note => ({
            uri: `notes://${note.id}`,
            name: note.title,
            description: `Note: ${note.title} (${note.tags.join(', ') || 'no tags'})`,
            mimeType: 'text/markdown',
          })),
        ],
      };
    });

    // Read resource content
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const uri = request.params.uri;

      if (uri === 'notes://all') {
        const notes = await this.storage.listNotes();
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(notes, null, 2),
            },
          ],
        };
      }

      if (uri.startsWith('notes://')) {
        const id = uri.replace('notes://', '');
        const note = await this.storage.getNote(id);
        
        if (!note) {
          throw new Error(`Note with ID "${id}" not found`);
        }

        return {
          contents: [
            {
              uri,
              mimeType: 'text/markdown',
              text: `# ${note.title}\n\n${note.content}\n\n---\nTags: ${note.tags.join(', ') || 'none'}\nCreated: ${note.createdAt}\nUpdated: ${note.updatedAt}`,
            },
          ],
        };
      }

      throw new Error(`Unknown resource URI: ${uri}`);
    });

    // List available prompts
    this.server.setRequestHandler(ListPromptsRequestSchema, async () => ({
      prompts: [
        {
          name: 'create_meeting_notes',
          description: 'Template for creating meeting notes',
          arguments: [
            {
              name: 'meeting_title',
              description: 'Title of the meeting',
              required: true,
            },
            {
              name: 'attendees',
              description: 'List of attendees',
              required: false,
            },
          ],
        },
        {
          name: 'create_code_snippet',
          description: 'Template for saving a code snippet',
          arguments: [
            {
              name: 'language',
              description: 'Programming language',
              required: true,
            },
            {
              name: 'description',
              description: 'What the code does',
              required: true,
            },
          ],
        },
      ],
    }));

    // Get prompt content
    this.server.setRequestHandler(GetPromptRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      switch (name) {
        case 'create_meeting_notes': {
          const title = args?.meeting_title || 'Meeting Notes';
          const attendees = args?.attendees || 'N/A';
          
          return {
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Create a meeting note with the following template:\n\nTitle: ${title}\n\n## Attendees\n${attendees}\n\n## Agenda\n\n## Discussion\n\n## Action Items\n\n## Next Steps`,
                },
              },
            ],
          };
        }

        case 'create_code_snippet': {
          const language = args?.language || 'text';
          const description = args?.description || 'Code snippet';
          
          return {
            messages: [
              {
                role: 'user',
                content: {
                  type: 'text',
                  text: `Create a code snippet note:\n\nTitle: ${description}\n\n## Description\n${description}\n\n## Code\n\`\`\`${language}\n// Your code here\n\`\`\`\n\nTags: code, ${language}`,
                },
              },
            ],
          };
        }

        default:
          throw new Error(`Unknown prompt: ${name}`);
      }
    });
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
    await this.storage.initialize();
    
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.error('MCP Notes Server running on stdio');
  }
}

// Start the server
const server = new NotesServer();
server.start().catch(console.error);

