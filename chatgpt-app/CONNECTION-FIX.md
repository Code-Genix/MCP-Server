# 🔧 Fix: Add `/mcp` to Your URL!

## ❌ Wrong URL (What you have now):
```
https://mcp-server-29k2eibib-ketu0810s-projects.vercel.app
```

## ✅ Correct URL (What you need):
```
https://mcp-server-29k2eibib-ketu0810s-projects.vercel.app/mcp
```

---

## 🎯 Steps to Fix:

1. **In ChatGPT "New Connector" modal:**
   - Find the **"MCP Server URL"** field
   - Change it from:
     ```
     https://mcp-server-29k2eibib-ketu0810s-projects.vercel.app
     ```
   - To:
     ```
     https://mcp-server-29k2eibib-ketu0810s-projects.vercel.app/mcp
     ```
   - **Add `/mcp` at the end!**

2. **Click "Create" again**

3. **It should work now!** ✅

---

## 🧪 Test First (Optional):

Before trying in ChatGPT, test the endpoint:

```bash
curl https://mcp-server-29k2eibib-ketu0810s-projects.vercel.app/mcp
```

Should return:
```json
{
  "name": "notes-mcp-server",
  "version": "1.0.0",
  "description": "MCP Notes Server for ChatGPT",
  "protocol": "mcp",
  "status": "ok"
}
```

---

## 💡 Why This Matters:

- Your Next.js app has the MCP handler at `/mcp` route
- Without `/mcp`, ChatGPT hits the root URL which doesn't have the MCP handler
- That's why you're getting 401/500 errors!

**Just add `/mcp` and it'll work!** 🚀

