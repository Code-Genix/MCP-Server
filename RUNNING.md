# Running the MCP Notes Server

This guide explains different ways to run and test your MCP Notes Server.

## 🎯 Understanding MCP Servers

**Important**: MCP servers are **NOT** traditional HTTP web servers. They:
- Communicate via **stdio** (standard input/output)
- Are designed to be controlled by MCP clients (like Claude Desktop)
- Don't have a web interface or REST API

Think of them as **background services** that AI assistants can talk to.

---

## 🚀 Running Options

### 1. Production Mode (Compiled JavaScript)

Run the built server:

```bash
npm start
```

**What happens:**
- Loads the compiled `dist/index.js`
- Server waits for stdio input from an MCP client
- Prints: `MCP Notes Server running on stdio`
- Stays running until you press `Ctrl+C` or an MCP client connects

**When to use:** When running with Claude Desktop or in production

---

### 2. Development Mode with Auto-Reload

Run directly from TypeScript source with auto-reload:

```bash
npm run dev:server
```

**What happens:**
- Uses `tsx watch` to run TypeScript directly
- Automatically restarts when you modify source files
- Great for rapid development

**When to use:** When actively developing and testing changes

---

### 3. Development with TypeScript Compiler Watch

Watch and compile TypeScript, then run separately:

**Terminal 1** - Watch and compile:
```bash
npm run dev
```

**Terminal 2** - Run the server:
```bash
npm start
```

**When to use:** When you want to see compilation errors separately

---

### 4. Debug Mode with Inspector

Run with Node.js debugger attached:

```bash
npm run inspector
```

Then attach your debugger (VS Code, Chrome DevTools) to `localhost:9229`

**When to use:** When you need to debug with breakpoints

---

## 🧪 Testing the Server

### Option 1: Interactive Test Client (Recommended)

Use the included test client to interact with the server:

```bash
npx tsx test-client.ts
```

**What it does:**
- ✅ Connects to the server
- ✅ Lists all available tools and resources
- ✅ Creates a test note
- ✅ Searches notes
- ✅ Reads resources
- ✅ Shows prompts
- ✅ Cleans up and disconnects

**Output Example:**
```
🚀 Starting MCP Notes Server Test Client

✅ Connected to MCP server

📋 Available Tools:
  - create_note: Create a new note with title, content, and optional tags
  - get_note: Get a specific note by ID
  ...

📝 Creating a note...
✅ Create result: Note created successfully!
```

---

### Option 2: Run Unit Tests

Run the comprehensive test suite:

```bash
# Run once
npm test

# Watch mode (runs on file changes)
npm run test:watch

# With coverage report
npm run test:coverage
```

---

### Option 3: Direct Storage Testing

Use the example script to test storage directly (no MCP protocol):

```bash
npx tsx example.ts
```

This demonstrates CRUD operations without the MCP layer.

---

## 🔌 Using with Claude Desktop

### Step 1: Build the Project

```bash
npm run build
```

### Step 2: Configure Claude Desktop

Edit your configuration file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

Add:

```json
{
  "mcpServers": {
    "notes": {
      "command": "node",
      "args": [
        "/Users/ketakimore/MCP-Server-1/dist/index.js"
      ],
      "env": {}
    }
  }
}
```

### Step 3: Restart Claude Desktop

The server will automatically start when Claude needs it.

### Step 4: Test in Claude

Ask Claude:
- "Create a note about today's meeting"
- "Search my notes for JavaScript"
- "List all my notes"
- "Show me notes tagged with 'work'"

---

## 📊 Server Behavior

### What Happens When Server Starts

1. **Initializes storage**: Creates `notes-data/` directory if needed
2. **Sets up MCP handlers**: Registers tools, resources, and prompts
3. **Connects transport**: Listens on stdio for MCP protocol messages
4. **Ready**: Prints "MCP Notes Server running on stdio"
5. **Waits**: Stays running until client disconnects or Ctrl+C

### Data Storage

All notes are stored in:
```
notes-data/
├── index.json          # Metadata index
├── {uuid-1}.md         # Note 1 content
├── {uuid-2}.md         # Note 2 content
└── ...
```

---

## 🔍 Debugging Tips

### Check if Server is Running

When connected to Claude Desktop, check Claude's logs:
- **macOS**: `~/Library/Logs/Claude/mcp*.log`
- **Windows**: `%APPDATA%\Claude\logs\mcp*.log`

### Manual Server Test

Run the test client to verify everything works:
```bash
npx tsx test-client.ts
```

If this works, your server is functioning correctly.

### Common Issues

**Issue**: Server starts but Claude can't connect
- ✅ Check the path in `claude_desktop_config.json` is absolute
- ✅ Verify `dist/index.js` exists (run `npm run build`)
- ✅ Restart Claude Desktop after config changes

**Issue**: "Module not found" errors
- ✅ Run `npm install`
- ✅ Run `npm run build`

**Issue**: Permission errors
- ✅ Ensure `notes-data/` directory is writable
- ✅ Check file permissions

---

## 🎓 Development Workflow

### Recommended Workflow

1. **Make changes** to source files in `src/`
2. **Auto-rebuild** using `npm run dev` (terminal 1)
3. **Test changes** using `npx tsx test-client.ts` (terminal 2)
4. **Run unit tests** using `npm test`
5. **Try in Claude** once verified

### Quick Iteration

For rapid testing without Claude Desktop:

```bash
# One command: rebuild and test
npm run build && npx tsx test-client.ts
```

---

## 📝 Summary of Commands

| Command | Purpose |
|---------|---------|
| `npm start` | Run production server |
| `npm run dev:server` | Run with auto-reload |
| `npm run dev` | Watch and compile TypeScript |
| `npm run build` | Build for production |
| `npm test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npx tsx test-client.ts` | Test server interactively |
| `npx tsx example.ts` | Test storage directly |

---

## 🚦 Next Steps

1. ✅ Run `npm start` to verify server starts
2. ✅ Run `npx tsx test-client.ts` to test functionality
3. ✅ Configure Claude Desktop (optional)
4. ✅ Start using your notes server!

---

**Need Help?** Check the main [README.md](./README.md) for more details.

