# MCP Notes Server

A Model Context Protocol (MCP) server for managing notes with full CRUD operations, built with TypeScript. This server allows AI assistants like Claude to create, read, update, delete, and search through markdown notes.

**✨ NEW:** Now includes a beautiful **Web Dashboard** for managing your notes in the browser!

**🚀 NEWEST:** **ChatGPT Integration** - Use ChatGPT to manage your notes with natural language!

- 🤖 **MCP Server**: Let Claude manage your notes
- 💬 **ChatGPT**: Use ChatGPT with OpenAI function calling
- 🌐 **Web Dashboard**: Visual interface at `http://localhost:3000`
- 💾 **Shared Storage**: All interfaces use the same notes

## Features

- ✨ **Complete CRUD Operations**: Create, read, update, and delete notes
- 🔍 **Full-Text Search**: Search notes by title, content, and tags
- 🏷️ **Tag Management**: Organize notes with tags
- 📝 **Markdown Support**: Notes are stored as markdown files
- 🔧 **MCP Resources**: Expose notes as readable resources
- 📋 **Prompt Templates**: Built-in templates for common note types
- ✅ **Comprehensive Tests**: Full test coverage with Vitest
- 🔒 **Type-Safe**: Built with TypeScript and Zod validation

## Installation

### Prerequisites

- Node.js 18.0.0 or higher
- npm or yarn

### Setup

1. Clone or navigate to the project directory:
```bash
cd MCP-Server-1
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

## Usage

### Running the Server

The server runs using stdio transport for MCP communication:

```bash
# MCP Server (for Claude Desktop)
npm start

# Web Dashboard (for browser)
npm run web

# ChatGPT Integration (interactive terminal)
npm run chatgpt

# Development mode with auto-reload
npm run dev:server  # MCP server
npm run web:dev     # Web dashboard

# Test the server interactively
npx tsx test-client.ts
```

### 💬 Using ChatGPT Integration

**Quick Start:**

1. Get an OpenAI API key from https://platform.openai.com/api-keys
2. Set your API key: `export OPENAI_API_KEY="sk-..."`
3. Start the notes server: `npm run web`
4. Start ChatGPT integration: `npm run chatgpt`
5. Chat naturally: "Create a note about my meeting tomorrow"

📖 **See [QUICKSTART-CHATGPT.md](./QUICKSTART-CHATGPT.md) for the complete guide!**

### 🌐 Using the Web Dashboard

Start the web server and open in your browser:

```bash
npm run web
# Then visit: http://localhost:3000
```

📖 **See [WEB-DASHBOARD.md](./WEB-DASHBOARD.md) for the complete web interface guide.**  
📖 **See [RUNNING.md](./RUNNING.md) for detailed MCP server instructions.**  
📖 **See [QUICKSTART-CHATGPT.md](./QUICKSTART-CHATGPT.md) for ChatGPT integration!** ⚡️

### Configuration with Claude Desktop

To use this server with Claude Desktop, add it to your Claude configuration file:

**macOS**: `~/Library/Application Support/Claude/claude_desktop_config.json`

**Windows**: `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "notes": {
      "command": "node",
      "args": ["/absolute/path/to/MCP-Server-1/dist/index.js"],
      "env": {}
    }
  }
}
```

Replace `/absolute/path/to/MCP-Server-1` with the actual path to your project.

## Available Tools

### `create_note`
Create a new note with title, content, and optional tags.

**Parameters:**
- `title` (string, required): The title of the note
- `content` (string, required): The content of the note (supports markdown)
- `tags` (string[], optional): Tags to categorize the note

**Example:**
```json
{
  "title": "Meeting Notes - Q1 Planning",
  "content": "## Agenda\n- Review Q4 results\n- Plan Q1 objectives",
  "tags": ["meeting", "planning"]
}
```

### `get_note`
Retrieve a specific note by ID.

**Parameters:**
- `id` (string, required): The ID of the note

### `update_note`
Update an existing note.

**Parameters:**
- `id` (string, required): The ID of the note to update
- `title` (string, optional): New title
- `content` (string, optional): New content
- `tags` (string[], optional): New tags

### `delete_note`
Delete a note by ID.

**Parameters:**
- `id` (string, required): The ID of the note to delete

### `search_notes`
Search notes by query text and/or tags.

**Parameters:**
- `query` (string, required): Search query to match in title or content
- `tags` (string[], optional): Filter by tags

**Example:**
```json
{
  "query": "javascript",
  "tags": ["programming"]
}
```

### `list_tags`
Get all unique tags used across all notes.

**Parameters:** None

## Available Resources

### `notes://all`
Returns a JSON list of all notes with metadata (without content).

### `notes://{id}`
Returns the full content of a specific note in markdown format.

## Available Prompts

### `create_meeting_notes`
Template for creating structured meeting notes.

**Arguments:**
- `meeting_title` (required): Title of the meeting
- `attendees` (optional): List of attendees

### `create_code_snippet`
Template for saving code snippets.

**Arguments:**
- `language` (required): Programming language
- `description` (required): What the code does

## Data Storage

Notes are stored in the `notes-data` directory (created automatically):
- Individual note content is stored as `.md` files
- Metadata and index are stored in `index.json`
- Each note has a unique UUID as its identifier

## Development

### Project Structure

```
MCP-Server-1/
├── src/
│   ├── index.ts              # Main server implementation
│   ├── types.ts              # Type definitions and schemas
│   └── storage/
│       └── NotesStorage.ts   # File system storage layer
├── tests/
│   ├── NotesStorage.test.ts  # Storage layer tests
│   └── validation.test.ts    # Schema validation tests
├── dist/                      # Compiled JavaScript (generated)
├── notes-data/                # Note storage (generated)
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

### Running Tests

Run all tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm run test:watch
```

Run tests with coverage:
```bash
npm run test:coverage
```

### Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Watch mode for development
- `npm start` - Start the MCP server
- `npm run web` - Start the web dashboard
- `npm run chatgpt` - Start ChatGPT integration
- `npm test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Generate coverage report

## Architecture

### MCP Protocol Implementation

This server implements the Model Context Protocol specification:

1. **Tools**: Functions that the AI can call to perform actions (create, update, delete notes)
2. **Resources**: Data that the AI can read (list of notes, individual note content)
3. **Prompts**: Reusable templates for common operations

### Storage Layer

The `NotesStorage` class provides a file-based storage system:
- Notes are stored as individual markdown files
- An index file tracks metadata for fast querying
- All operations are async and handle errors gracefully

### Validation

Input validation uses Zod schemas to ensure:
- Type safety at runtime
- Clear error messages
- Consistent data structure

## Example Use Cases

### With Claude Desktop

Once configured, you can ask Claude to:

- "Create a note about today's standup meeting"
- "Search my notes for anything related to JavaScript"
- "Update the note titled 'Project Ideas' with new content"
- "Show me all notes tagged with 'urgent'"
- "Delete the note with ID abc-123"

### Programmatic Usage

```typescript
import { NotesStorage } from './src/storage/NotesStorage.js';

const storage = new NotesStorage();
await storage.initialize();

// Create a note
const note = await storage.createNote({
  title: 'My First Note',
  content: 'Hello, world!',
  tags: ['example'],
});

// Search notes
const results = await storage.searchNotes('hello');

// Update a note
await storage.updateNote({
  id: note.id,
  content: 'Updated content',
});
```

## Troubleshooting

### Server Not Starting

1. Make sure you've run `npm run build`
2. Check that Node.js version is 18.0.0 or higher: `node --version`
3. Verify all dependencies are installed: `npm install`

### Notes Not Persisting

1. Check that the `notes-data` directory has write permissions
2. Look for error messages in the server output
3. Verify the storage directory path in the code

### Claude Not Seeing the Server

1. Verify the path in `claude_desktop_config.json` is absolute
2. Restart Claude Desktop after configuration changes
3. Check Claude's logs for error messages

## Contributing

This is a learning project demonstrating MCP server implementation. Feel free to:
- Report issues
- Suggest improvements
- Fork and extend functionality

## License

MIT

## Learn More

- [Model Context Protocol Documentation](https://modelcontextprotocol.io/)
- [MCP SDK on GitHub](https://github.com/modelcontextprotocol/typescript-sdk)
- [Claude Desktop](https://claude.ai/desktop)

## Acknowledgments

Built with:
- [@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk) - Official MCP SDK
- [Zod](https://zod.dev/) - TypeScript-first schema validation
- [Vitest](https://vitest.dev/) - Fast unit testing framework

