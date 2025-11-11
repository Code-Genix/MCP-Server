# 🚀 Deploying to Vercel

## Prerequisites

1. ✅ Vercel account (free): https://vercel.com/signup
2. ✅ Your notes backend needs to be deployed somewhere accessible
3. ✅ Or keep notes backend local and use ngrok

---

## 📝 Deployment Steps

### Option A: Deploy ChatGPT App Only (Notes Backend Local)

1. **Deploy to Vercel:**
   ```bash
   cd /Users/ketakimore/work/MCP-Server-1/chatgpt-app
   
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   ```

2. **Keep Notes Backend Local:**
   ```bash
   # In another terminal
   cd /Users/ketakimore/work/MCP-Server-1
   npm run web
   
   # Expose it
   ngrok http 3000
   ```

3. **Set Environment Variable in Vercel:**
   - Go to your Vercel project dashboard
   - Settings → Environment Variables
   - Add: `NOTES_API_URL` = `https://your-ngrok-url-for-port-3000`

4. **Redeploy:**
   ```bash
   vercel --prod
   ```

5. **Use in ChatGPT:**
   ```
   https://your-app.vercel.app/mcp
   ```

---

### Option B: Deploy Both (Recommended)

#### Step 1: Deploy Notes Backend

Your notes backend needs to be deployed too. Options:

**A. Railway (Easiest):**
```bash
cd /Users/ketakimore/work/MCP-Server-1

# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

**B. Render:**
- Go to https://render.com
- Connect GitHub repo
- Create Web Service
- Build command: `npm install && npm run build`
- Start command: `npm run web`

**C. Fly.io:**
```bash
# Install flyctl
brew install flyctl

# Deploy
cd /Users/ketakimore/work/MCP-Server-1
fly launch
fly deploy
```

#### Step 2: Deploy ChatGPT App to Vercel

```bash
cd chatgpt-app
vercel
```

#### Step 3: Connect Them

In Vercel environment variables:
```
NOTES_API_URL=https://your-notes-backend.railway.app
```

---

## 🐛 Common Vercel Issues & Fixes

### Issue 1: Build Fails

**Error:** `Module not found` or `Cannot find module`

**Fix:**
```bash
# Make sure all dependencies are in package.json
cd chatgpt-app
npm install
```

### Issue 2: TypeScript Errors

**Error:** TypeScript compilation fails

**Fix:**
```bash
# Build locally first to catch errors
npm run build
```

### Issue 3: CORS Errors

**Error:** CORS policy blocking requests

**Fix:** middleware.ts already handles this! ✅

### Issue 4: Environment Variables

**Error:** `NOTES_API_URL` undefined

**Fix:** Set in Vercel dashboard:
1. Project Settings
2. Environment Variables
3. Add `NOTES_API_URL`
4. Redeploy

### Issue 5: Port Not Found

**Error:** Cannot bind to port

**Fix:** Don't specify port in production! Update package.json:
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start"  // Remove -p 3001
  }
}
```

---

## 📋 Vercel Deployment Checklist

Before deploying:
- [ ] `npm run build` works locally
- [ ] No TypeScript errors
- [ ] Environment variables defined
- [ ] Notes backend is accessible (deployed or via ngrok)
- [ ] middleware.ts exists (CORS)
- [ ] next.config.js has assetPrefix

---

## 🎯 Quick Deploy Commands

```bash
# From chatgpt-app directory:

# 1. Test build locally
npm run build

# 2. Deploy to Vercel
vercel

# 3. Set environment variable (after first deploy)
vercel env add NOTES_API_URL

# 4. Redeploy with env vars
vercel --prod
```

---

## 🔗 After Deployment

Your app will be at: `https://your-app.vercel.app`

Use in ChatGPT:
```
https://your-app.vercel.app/mcp
```

(No ngrok needed once deployed!)

---

## 💡 For Now (While Testing)

Since ChatGPT's "New Connector" is broken:

1. **Keep everything local**
2. **Use Custom GPT with Actions instead**
3. **Point Custom GPT to your ngrok URL directly**

This bypasses the broken "New Connector" feature!

---

**What specific errors are you seeing in Vercel?** Show me the error message and I'll help fix it! 🔧

