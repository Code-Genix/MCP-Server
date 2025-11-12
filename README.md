# MCP Notes Server

A Model Context Protocol server for managing markdown notes with ChatGPT integration.

## Project Structure

```
MCP-Server-1/
├── src/                    # Core backend code
│   ├── index.ts           # MCP server (for Claude)
│   ├── web-server.ts      # REST API server
│   ├── storage/           # Notes storage
│   └── types.ts           # TypeScript types
├── chatgpt-app/           # ChatGPT integration (Next.js)
│   └── src/
│       ├── app/
│       │   ├── mcp/       # MCP endpoint
│       │   └── widgets/   # Interactive widgets
│       └── lib/           # Utilities & tools
├── notes-data/            # Notes storage directory
├── public/                # Web dashboard
└── tests/                 # Test files
```

## Quick Start

See **[START.md](./START.md)** for setup instructions.

## Features

- ✅ Full CRUD operations (create, read, update, delete notes)
- ✅ Search & tags
- ✅ Works with Claude Desktop (MCP)
- ✅ Works with ChatGPT (via chatgpt-app)
- ✅ Web dashboard (browser UI)
- ✅ Markdown support
- ✅ Interactive widgets in ChatGPT

## Usage

### For Claude Desktop

Add to `~/Library/Application Support/Claude/claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "notes": {
      "command": "node",
      "args": ["/path/to/MCP-Server-1/dist/index.js"]
    }
  }
}
```

### For ChatGPT

1. Start backend: `npm run web` (port 3000)
2. Start ChatGPT app: `cd chatgpt-app && npm run dev` (port 3001)
3. Expose with ngrok: `ngrok http 3001`
4. Connect in ChatGPT using ngrok URL + `/mcp`

### For Web Browser

```bash
npm run web
# Visit: http://localhost:3000
```

## Scripts

```bash
npm run build    # Build TypeScript
npm start        # Start MCP server (for Claude)
npm run web      # Start web dashboard & API
npm test         # Run tests
```

## Tech Stack

- TypeScript
- Node.js + Express
- Model Context Protocol SDK
- Next.js (for ChatGPT integration)
- React (for widgets)
- Zod (validation)
- Vitest (testing)

---

**For detailed setup, see [START.md](./START.md)**
