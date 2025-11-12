# Notes ChatGPT App

Next.js application for ChatGPT Apps SDK integration with interactive widgets.

## Structure

```
chatgpt-app/
├── src/
│   ├── app/
│   │   ├── mcp/
│   │   │   └── route.ts          # MCP server endpoint
│   │   ├── widgets/
│   │   │   ├── note-card.tsx     # Note card component
│   │   │   ├── notes-list.tsx    # Notes list component
│   │   │   ├── note-detail.tsx   # Note detail component
│   │   │   ├── note-editor.tsx   # Note editor component
│   │   │   └── */route.tsx       # Widget route handlers
│   │   ├── layout.tsx
│   │   └── page.tsx
│   └── lib/
│       ├── types.ts              # TypeScript types
│       ├── utils.ts              # Utility functions
│       └── tools.ts              # Tool handlers
├── middleware.ts                 # CORS middleware
├── next.config.js               # Next.js configuration
└── package.json
```

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

## Environment Variables

- `NOTES_API_URL` - Backend API URL (default: `http://localhost:3000`)
- `VERCEL_URL` - Auto-set by Vercel in production

## Development

1. Start notes backend on port 3000
2. Start this app: `npm run dev` (runs on port 3001)
3. Expose with ngrok: `ngrok http 3001`
4. Connect in ChatGPT using ngrok URL + `/mcp`

## Features

- ✅ MCP protocol implementation
- ✅ Interactive widgets
- ✅ Type-safe TypeScript
- ✅ Clean, modular code structure
