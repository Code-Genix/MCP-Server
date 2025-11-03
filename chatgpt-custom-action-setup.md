# ChatGPT Custom Actions - Setup Instructions

## Step 1: Get Your ngrok URL

After running `ngrok http 3000`, copy the HTTPS URL that looks like:
```
https://abc123.ngrok-free.app
```

## Step 2: Create Custom GPT in ChatGPT

1. Go to https://chat.openai.com
2. Click "Explore GPTs" (left sidebar)
3. Click "Create a GPT" (top right)
4. Click "Configure" tab

## Step 3: Basic Configuration

**Name:** Notes Manager

**Description:** Manage your personal notes with full CRUD operations

**Instructions:**
```
You are a helpful assistant that manages personal notes for the user. 
You can create, read, update, delete, and search through notes.
Always be concise and helpful. When creating notes, use proper markdown formatting.
```

## Step 4: Add Actions

Click "Create new action" and paste this schema:

**IMPORTANT:** Replace `https://YOUR-NGROK-URL-HERE.ngrok-free.app` with your actual ngrok URL!

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
      "url": "https://YOUR-NGROK-URL-HERE.ngrok-free.app"
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
            "description": "List of notes"
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
                    "items": {
                      "type": "string"
                    },
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
            "schema": {
              "type": "string"
            },
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
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "title": {
                    "type": "string"
                  },
                  "content": {
                    "type": "string"
                  },
                  "tags": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
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
            "schema": {
              "type": "string"
            }
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
                    "items": {
                      "type": "string"
                    }
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

## Step 5: Test the Action

Click "Test" in the action editor. It should successfully connect to your ngrok URL.

## Step 6: Save and Use

1. Click "Save" on your Custom GPT
2. Start a new chat with your Custom GPT
3. Try: "Create a note about my dentist appointment"

## Example Usage

Once configured, you can chat naturally:

- "Create a note about my meeting tomorrow"
- "Show me all my notes"
- "Search for notes about appointments"
- "Update the dentist note to change the time to 4pm"
- "Delete the test note"

## Troubleshooting

### ngrok URL expires
- Free ngrok URLs change each time you restart
- You'll need to update the server URL in the Custom GPT settings
- Consider upgrading to ngrok paid for a static domain

### Connection errors
- Make sure `npm run web` is running
- Make sure `ngrok http 3000` is running
- Check that the ngrok URL in the schema matches your current URL

### Authentication errors
- ngrok free tier might show a warning page
- Users need to click through the warning once
- Consider upgrading for a better experience

## Keeping It Running

You need THREE things running:

1. **Terminal 1:** `npm run web` (your notes server)
2. **Terminal 2:** `ngrok http 3000` (expose to internet)
3. **Browser:** ChatGPT with your Custom GPT

## Notes

- Your ngrok URL changes every time you restart ngrok (free tier)
- You'll need to update the Custom GPT schema with the new URL each time
- Consider keeping ngrok running continuously while testing
- For production, deploy to a cloud service with a permanent URL

---

Made with ❤️ for seamless ChatGPT web integration!

