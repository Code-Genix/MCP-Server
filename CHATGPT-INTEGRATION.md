# ChatGPT Integration Guide

This guide shows you how to integrate your MCP Notes Server with ChatGPT.

## 🎯 Two Integration Methods

### Method 1: Interactive Chat (Recommended for Testing)

Use the interactive terminal interface with ChatGPT function calling.

#### Setup Steps:

1. **Get an OpenAI API Key**
   - Go to https://platform.openai.com/api-keys
   - Create a new API key
   - Copy the key (starts with `sk-...`)

2. **Set the API Key**
   ```bash
   export OPENAI_API_KEY="sk-your-api-key-here"
   ```

3. **Start Your Notes Server**
   ```bash
   npm run web
   ```
   This starts the API server on http://localhost:3000

4. **Run the ChatGPT Integration**
   ```bash
   npx tsx chatgpt-integration.ts
   ```

#### Example Usage:

```
👤 You: Create a note about my dentist appointment tomorrow at 3pm

🤖 Assistant: I've created a note about your dentist appointment. 
              The note is titled "Dentist Appointment" and includes 
              the details about tomorrow at 3pm.

👤 You: List all my notes

🤖 Assistant: You have 1 note:
              1. Dentist Appointment (created just now)

👤 You: Search for notes about appointments

🤖 Assistant: I found 1 note matching "appointments":
              - Dentist Appointment
```

---

### Method 2: ChatGPT Custom Actions (ChatGPT Plus/Enterprise)

Use ChatGPT directly from the web interface with custom actions.

#### Setup Steps:

1. **Expose Your API Publicly**
   
   Since ChatGPT needs to access your API, you need to make it publicly accessible. Use one of these options:

   **Option A: Using ngrok (Recommended)**
   ```bash
   # Install ngrok
   brew install ngrok  # on macOS
   
   # Start your notes server
   npm run web
   
   # In another terminal, expose it
   ngrok http 3000
   ```
   Copy the `https://` URL that ngrok provides (e.g., `https://abc123.ngrok.io`)

   **Option B: Using Cloudflare Tunnel**
   ```bash
   # Install cloudflared
   brew install cloudflared  # on macOS
   
   # Start your notes server
   npm run web
   
   # In another terminal, create tunnel
   cloudflared tunnel --url http://localhost:3000
   ```

2. **Configure ChatGPT Custom Actions**

   a. Go to ChatGPT (https://chat.openai.com)
   
   b. Click on your profile → Settings → Custom Actions (or create a Custom GPT)
   
   c. Add a new action with this schema:

   ```json
   {
     "openapi": "3.1.0",
     "info": {
       "title": "MCP Notes API",
       "description": "API for managing notes",
       "version": "1.0.0"
     },
     "servers": [
       {
         "url": "https://YOUR-NGROK-URL-HERE.ngrok.io"
       }
     ],
     "paths": {
       "/api/notes": {
         "get": {
           "operationId": "listNotes",
           "summary": "List all notes"
         },
         "post": {
           "operationId": "createNote",
           "summary": "Create a new note",
           "requestBody": {
             "required": true,
             "content": {
               "application/json": {
                 "schema": {
                   "type": "object",
                   "required": ["title", "content"],
                   "properties": {
                     "title": { "type": "string" },
                     "content": { "type": "string" },
                     "tags": {
                       "type": "array",
                       "items": { "type": "string" }
                     }
                   }
                 }
               }
             }
           }
         }
       }
     }
   }
   ```

   d. Replace `YOUR-NGROK-URL-HERE.ngrok.io` with your actual ngrok URL

3. **Use ChatGPT to Manage Notes**

   Now you can just chat with ChatGPT:
   - "Create a note about my meeting tomorrow"
   - "Show me all my notes"
   - "Search for notes about projects"

---

## 🧪 Testing the Integration

### Test Commands:

```bash
# In the interactive chat:
Create a note titled "Meeting Notes" with content "Discussed project timeline"
List all my notes
Search for notes about "meeting"
Create a note about grocery shopping with tags shopping and todo
```

### Expected Behavior:

1. ChatGPT will call your API functions
2. You'll see function calls logged in the terminal
3. ChatGPT will respond with the results
4. Your notes will be saved in `notes-data/`

---

## 📋 Available Commands

ChatGPT understands natural language, but here are some examples:

| What You Say | What It Does |
|-------------|-------------|
| "Create a note about..." | Creates a new note |
| "Show me all my notes" | Lists all notes |
| "Find notes about..." | Searches notes |
| "Update note X to say..." | Updates a note |
| "Delete the note about..." | Deletes a note |
| "What tags do I have?" | Lists all tags |

---

## 🔧 Troubleshooting

### Issue: "Cannot connect to API"
**Solution:** Make sure your notes server is running:
```bash
npm run web
```

### Issue: "OPENAI_API_KEY not set"
**Solution:** Set your API key:
```bash
export OPENAI_API_KEY="sk-your-key-here"
```

### Issue: ChatGPT Custom Actions not working
**Solutions:**
- Verify your ngrok tunnel is running
- Check that the URL in the schema matches your ngrok URL
- Make sure the tunnel hasn't expired (ngrok free tier has time limits)

### Issue: "Rate limit exceeded"
**Solution:** You're hitting OpenAI's rate limits. Wait a bit or upgrade your OpenAI plan.

---

## 💰 Costs

### Method 1 (Interactive Chat):
- Uses OpenAI API (GPT-4)
- Approximately $0.01-0.03 per conversation
- You need an OpenAI API key with credits

### Method 2 (Custom Actions):
- Requires ChatGPT Plus ($20/month) or Enterprise
- No additional API costs

---

## 🚀 Advanced: Deploy to Production

For production use, instead of ngrok:

1. Deploy your notes server to a cloud provider (Vercel, Railway, Fly.io, etc.)
2. Get a permanent HTTPS URL
3. Update the ChatGPT action schema with the production URL
4. Add authentication (API keys, OAuth, etc.)

Example Vercel deployment:
```bash
npm install -g vercel
vercel deploy
```

---

## 📚 Next Steps

- Add authentication to your API
- Create more complex note templates
- Integrate with other tools (calendar, tasks, etc.)
- Build a mobile app using the same API
- Add voice notes support

---

## ❓ Need Help?

- Check the main README.md for general setup
- Review TROUBLESHOOTING.md for common issues
- Open an issue on GitHub

---

Made with ❤️ for seamless note-taking with ChatGPT!


