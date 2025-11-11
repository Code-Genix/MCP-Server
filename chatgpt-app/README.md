# ChatGPT Notes App

Clean Next.js app with MCP endpoint for ChatGPT.

## Quick Start

```bash
# Install
npm install

# Start (runs on port 3001)
npm run dev

# In another terminal, start notes backend
cd ..
npm run web

# Expose via ngrok
ngrok http 3001

# Use in ChatGPT:
# https://YOUR-NGROK-URL/api/mcp
```

## What This Does

- `/api/mcp` - MCP endpoint ChatGPT calls
- Connects to notes backend on port 3000
- Exposes create_note, list_notes, search_notes tools


