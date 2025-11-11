# 🚀 ChatGPT Integration - Clean Start

Based on official Vercel Labs template: https://github.com/vercel-labs/chatgpt-apps-sdk-nextjs-starter

---

## 🎯 3 Simple Steps

### Step 1: Start Notes Backend
```bash
npm run web
```
✅ Runs on **port 3000**

### Step 2: Start ChatGPT App
```bash
cd chatgpt-app
npm run dev
```
✅ Runs on **port 3001**

### Step 3: Expose & Connect
```bash
ngrok http 3001
```
✅ Copy the HTTPS URL

**In ChatGPT "New Connector":**
```
https://YOUR-NGROK-URL.ngrok-free.dev/mcp
```
⚠️ **NOTE**: `/mcp` (NOT `/api/mcp`!)

---

## 💬 Test Commands

```
"Create a note about my dentist appointment"
"List all my notes"
"Search for notes about JavaScript"
```

---

## 📁 Structure

```
chatgpt-app/
├── src/app/
│   ├── mcp/
│   │   └── route.ts    ← Main MCP endpoint
│   ├── page.tsx
│   └── layout.tsx
├── middleware.ts       ← CORS handling
├── baseUrl.ts         ← Asset config
└── next.config.js     ← Asset prefix
```

Based on official template! ✨
