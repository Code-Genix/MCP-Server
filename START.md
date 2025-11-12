# 🚀 ChatGPT Integration - Local Development (No Vercel!)

**Simple local setup with ngrok - no deployment needed!**

---

## 🎯 3 Simple Steps

### Step 1: Start Notes Backend
```bash
# Terminal 1
cd /Users/ketakimore/work/MCP-Server-1
npm run web
```
✅ Runs on **port 3000**  
✅ Keep this running!

### Step 2: Start ChatGPT App
```bash
# Terminal 2
cd /Users/ketakimore/work/MCP-Server-1/chatgpt-app
npm run dev
```
✅ Runs on **port 3001**  
✅ Keep this running!

### Step 3: Expose & Connect
```bash
# Terminal 3
ngrok http 3001
```
✅ Copy the **HTTPS URL** (e.g., `https://abc123.ngrok-free.dev`)

**In ChatGPT "New Connector":**
```
https://YOUR-NGROK-URL.ngrok-free.dev/mcp
```
⚠️ **IMPORTANT**: Add `/mcp` at the end!

---

## ✅ Quick Test

After starting everything, test the endpoint:

```bash
curl -X POST https://YOUR-NGROK-URL.ngrok-free.dev/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'
```

**Should return JSON** (not HTML or error)

---

## 💬 Test Commands in ChatGPT

Once connected, try:
```
"Create a note about my dentist appointment"
"List all my notes"
"Search for notes about JavaScript"
"Get note with id abc123"
```

---

## 🔧 How It Works

1. **Notes Backend** (port 3000) - Your actual notes API
2. **ChatGPT App** (port 3001) - Next.js app with MCP endpoint
3. **ngrok** - Exposes port 3001 to the internet
4. **ChatGPT** - Connects to ngrok URL → calls MCP endpoint → calls notes backend

The ChatGPT app automatically connects to `http://localhost:3000` for the notes backend!

---

## 🐛 Troubleshooting

### Port Already in Use?
```bash
# Kill ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### ngrok URL Changed?
- ngrok free plan gives new URL each time
- Just update the URL in ChatGPT "New Connector"

### Connection Timeout?
- Make sure all 3 terminals are running
- Check ngrok is forwarding to port 3001
- Verify notes backend is on port 3000

---

## 📁 Structure

```
chatgpt-app/
├── src/app/
│   ├── mcp/
│   │   └── route.ts    ← Main MCP endpoint (connects to localhost:3000)
│   ├── page.tsx
│   └── layout.tsx
├── middleware.ts       ← CORS handling
└── next.config.js
```

**No Vercel needed - everything runs locally!** 🎉
