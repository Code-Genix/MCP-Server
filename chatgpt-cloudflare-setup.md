# ChatGPT Custom Actions - Cloudflare Tunnel Setup

## Quick Setup (3 Steps!)

### Step 1: Install Cloudflare Tunnel

```bash
brew install cloudflared
```

### Step 2: Start Your Services

**Terminal 1:**
```bash
npm run web
```

**Terminal 2:**
```bash
cloudflared tunnel --url http://localhost:3000
```

You'll get a URL like: `https://abc-def-123.trycloudflare.com`

**Copy this URL!**

---

## Step 3: Create Custom GPT in ChatGPT

1. Go to **https://chat.openai.com**
2. Click **"Explore GPTs"** (left sidebar)
3. Click **"Create a GPT"** (top right)
4. Click **"Configure"** tab

### Basic Info:

**Name:** 
```
Notes Manager
```

**Description:**
```
Manage your personal notes with full CRUD operations
```

**Instructions:**
```
You are a helpful assistant that manages personal notes for the user. 
You can create, read, update, delete, and search through notes.
Always be concise and helpful. When creating notes, use proper markdown formatting.
When the user asks to create a note, extract the key information and organize it well.
```

### Add Action:

Click **"Create new action"** and paste this:

**🚨 IMPORTANT: Replace `YOUR-CLOUDFLARE-URL` with your actual URL!**

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "Notes API",
    "description": "Personal notes management API",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://YOUR-CLOUDFLARE-URL.trycloudflare.com"
    }
  ],
  "paths": {
    "/api/notes": {
      "get": {
        "operationId": "listNotes",
        "summary": "List all notes",
        "description": "Get a list of all notes with metadata",
        "responses": {
          "200": {
            "description": "List of notes",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": { "type": "boolean" },
                    "data": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": { "type": "string" },
                          "title": { "type": "string" },
                          "tags": { "type": "array", "items": { "type": "string" } },
                          "createdAt": { "type": "string" },
                          "updatedAt": { "type": "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      "post": {
        "operationId": "createNote",
        "summary": "Create a new note",
        "description": "Create a new note with title, content, and optional tags",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["title", "content"],
                "properties": {
                  "title": {
                    "type": "string",
                    "description": "The title of the note"
                  },
                  "content": {
                    "type": "string",
                    "description": "The content of the note (supports markdown)"
                  },
                  "tags": {
                    "type": "array",
                    "items": { "type": "string" },
                    "description": "Optional tags to categorize the note"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Note created successfully"
          }
        }
      }
    },
    "/api/notes/{id}": {
      "get": {
        "operationId": "getNote",
        "summary": "Get a specific note",
        "description": "Retrieve a note by its ID",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" },
            "description": "The ID of the note"
          }
        ],
        "responses": {
          "200": {
            "description": "Note details"
          }
        }
      },
      "put": {
        "operationId": "updateNote",
        "summary": "Update an existing note",
        "description": "Update a note's title, content, or tags",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
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
        },
        "responses": {
          "200": {
            "description": "Note updated"
          }
        }
      },
      "delete": {
        "operationId": "deleteNote",
        "summary": "Delete a note",
        "description": "Delete a note by its ID",
        "parameters": [
          {
            "name": "id",
            "in": "path",
            "required": true,
            "schema": { "type": "string" }
          }
        ],
        "responses": {
          "200": {
            "description": "Note deleted"
          }
        }
      }
    },
    "/api/notes/search": {
      "post": {
        "operationId": "searchNotes",
        "summary": "Search notes",
        "description": "Search notes by query text and/or tags",
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["query"],
                "properties": {
                  "query": {
                    "type": "string",
                    "description": "Search query"
                  },
                  "tags": {
                    "type": "array",
                    "items": { "type": "string" }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Search results"
          }
        }
      }
    },
    "/api/tags": {
      "get": {
        "operationId": "listTags",
        "summary": "Get all tags",
        "description": "Get all unique tags used across all notes",
        "responses": {
          "200": {
            "description": "List of tags"
          }
        }
      }
    }
  }
}
```

### Save and Test:

1. Click **"Test"** - it should connect successfully
2. Click **"Save"**
3. Start chatting!

---

## 🎯 Example Usage

Once your Custom GPT is set up, try:

```
You: Create a note about my dentist appointment tomorrow at 3pm

GPT: I've created a note for your dentist appointment tomorrow at 3pm!

You: List all my notes

GPT: You have 1 note:
     - Dentist Appointment (created just now)

You: Search for notes about appointments

GPT: I found 1 note matching "appointments":
     - Dentist Appointment
```

---

## 💡 Advantages of Cloudflare Tunnel

✅ **Completely free** - No account needed for quick tunnels  
✅ **No auth tokens** - Just run and go  
✅ **Fast** - Cloudflare's global network  
✅ **Reliable** - Better uptime than ngrok free tier  

---

## 🔧 Keeping It Running

You need **TWO terminals** running:

**Terminal 1:**
```bash
npm run web
```
*(Your notes server on port 3000)*

**Terminal 2:**
```bash
cloudflared tunnel --url http://localhost:3000
```
*(Exposes it to the internet)*

**⚠️ Note:** The Cloudflare URL changes each time you restart the tunnel (just like ngrok free). You'll need to update the Custom GPT schema with the new URL.

---

## 🐛 Troubleshooting

### "Cannot connect to localhost:3000"
- Make sure `npm run web` is running first
- Check http://localhost:3000 works in your browser

### "Connection refused"
- Restart both terminals
- Make sure no firewall is blocking the connection

### URL keeps changing
- This is normal for quick tunnels
- Each restart gives you a new URL
- For a permanent URL, set up a named tunnel (requires Cloudflare account)

---

## 🚀 Quick Start Checklist

- [ ] Install cloudflared: `brew install cloudflared`
- [ ] Terminal 1: `npm run web`
- [ ] Terminal 2: `cloudflared tunnel --url http://localhost:3000`
- [ ] Copy the `.trycloudflare.com` URL
- [ ] Go to chat.openai.com
- [ ] Create a Custom GPT
- [ ] Add the action (update the URL in the JSON)
- [ ] Test and save
- [ ] Start chatting!

---

Made with ❤️ for seamless ChatGPT integration via Cloudflare!

