# 🔍 Check Vercel Logs to Debug 401 Error

## 📊 How to See What ChatGPT is Sending

### Step 1: View Vercel Logs

1. Go to: https://vercel.com/dashboard
2. Click your project: **mcp-server**
3. Go to **Deployments** tab
4. Click on the **latest deployment**
5. Click **Functions** tab
6. Click on `/mcp` function
7. You'll see **real-time logs**!

---

## 🔍 What to Look For

When you try to connect in ChatGPT, you should see logs like:

```
📨 Request headers: { ... }
📨 MCP Request: { method: 'initialize', ... }
✅ Handling initialize request
```

**OR** you might see errors that tell us what's wrong!

---

## 🐛 Common 401 Causes

### 1. ChatGPT Sending Auth Headers

If you see in logs:
```
authorization: Bearer ...
```

**Fix:** ChatGPT might be checking auth. We need to handle this.

### 2. Wrong Response Format

If ChatGPT expects a different format, logs will show what it sent.

### 3. Missing Headers

If CORS headers aren't being set properly.

---

## 🎯 Quick Test

**Test the endpoint directly:**

```bash
# Test GET
curl https://mcp-server-29k2eibib-ketu0810s-projects.vercel.app/mcp

# Test POST with initialize
curl -X POST https://mcp-server-29k2eibib-ketu0810s-projects.vercel.app/mcp \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'
```

**What do these return?** Share the output!

---

## 💡 Next Steps

1. **Check Vercel logs** (see above)
2. **Test endpoints** (curl commands above)
3. **Share what you see** - I'll fix it!

---

**The logs will tell us exactly what ChatGPT is sending and why it's getting 401!** 🔍

