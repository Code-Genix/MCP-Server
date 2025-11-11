# MCP Notes Server

A Model Context Protocol server for managing markdown notes with ChatGPT integration.

## Quick Start

See **[START.md](./START.md)** for the simple 3-step setup.

## What's Here

- **`src/`** - Core MCP server & notes backend
- **`chatgpt-app/`** - ChatGPT integration (Next.js)
- **`notes-data/`** - Your notes storage
- **`public/`** - Web dashboard UI

## Features

- ✅ Full CRUD operations (create, read, update, delete notes)
- ✅ Search & tags
- ✅ Works with Claude Desktop (MCP)
- ✅ Works with ChatGPT (via chatgpt-app)
- ✅ Web dashboard (browser UI)
- ✅ Markdown support

## Usage

### For Claude Desktop

Add to your Claude config (`~/Library/Application Support/Claude/claude_desktop_config.json`):

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

See [START.md](./START.md) - it's just 3 commands!

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
- Zod (validation)
- Vitest (testing)

---

**For detailed setup, see [START.md](./START.md)**
