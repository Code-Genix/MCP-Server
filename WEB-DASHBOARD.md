# 🌐 Web Dashboard Guide

Your MCP Notes Server now has a beautiful web interface! This guide shows you how to use it.

## 🚀 Quick Start

### Start the Web Dashboard

```bash
cd /Users/ketakimore/MCP-Server-1
npm run web
```

**You'll see:**
```
🌐 Web Dashboard Server running!
📍 URL: http://localhost:3000
📁 Storage: notes-data/

✨ Open http://localhost:3000 in your browser
```

### Open in Your Browser

Visit: **http://localhost:3000**

---

## ✨ Features

### 📊 Dashboard
- **Real-time stats**: See total notes and tags at a glance
- **Recent notes**: Quick access to your latest work
- **Modern dark theme**: Easy on the eyes

### 📝 Create Notes
1. Click **"➕ Create New Note"** button
2. Enter a title
3. Add tags (comma-separated)
4. Write your content with Markdown support
5. Click **"💾 Save"**

### 🔍 Search & Filter
- **Search bar**: Find notes by title or content
- **Tag filters**: Click tags to filter notes
- **Real-time results**: See results as you type

### ✏️ Edit Notes
1. Click any note card to view it
2. Click **"✏️ Edit"** button
3. Make your changes
4. Click **"💾 Save"**

### 🗑️ Delete Notes
1. Open a note
2. Click **"🗑️ Delete"** button
3. Confirm deletion

### 🎨 Markdown Support
Use Markdown formatting in your notes:
- `# Heading 1`, `## Heading 2`, etc.
- `**bold**`, `*italic*`
- `- bullet lists`
- `` `code` ``
- And more!

---

## 📋 Available Commands

| Command | Purpose |
|---------|---------|
| `npm run web` | Start web dashboard (production) |
| `npm run web:dev` | Start with auto-reload (development) |

---

## 🎯 How It Works

### Architecture

```
Browser (http://localhost:3000)
    ↓
Express Web Server (src/web-server.ts)
    ↓
NotesStorage (src/storage/NotesStorage.ts)
    ↓
File System (notes-data/)
```

### API Endpoints

The web server provides REST API endpoints:

- `GET /api/notes` - List all notes
- `GET /api/notes/:id` - Get specific note
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note
- `POST /api/notes/search` - Search notes
- `GET /api/tags` - Get all tags
- `GET /api/stats` - Get statistics

### Files

- **Frontend**: `public/` directory
  - `index.html` - Main interface
  - `styles.css` - Beautiful dark theme
  - `app.js` - Interactive functionality
- **Backend**: `src/web-server.ts`

---

## 🔄 Running Both Servers

You can run both the **MCP server** (for Claude) and the **Web Dashboard** simultaneously!

### Terminal 1 - MCP Server (for Claude Desktop)
```bash
npm start
```

### Terminal 2 - Web Dashboard
```bash
npm run web
```

They both use the **same storage** (`notes-data/`), so:
- Notes created in Claude appear in the web dashboard
- Notes created in the web dashboard appear in Claude
- Real-time synchronization!

---

## 🎨 UI Features

### Modern Design
- ✅ Dark theme for comfortable viewing
- ✅ Smooth animations and transitions
- ✅ Responsive layout (works on mobile too!)
- ✅ Beautiful gradient accents

### User Experience
- ✅ Toast notifications for actions
- ✅ Confirmation dialogs for deletions
- ✅ Real-time search with debouncing
- ✅ Tag-based filtering
- ✅ Relative timestamps ("5m ago", "2h ago")

### Markdown Rendering
- ✅ Live markdown preview
- ✅ Syntax highlighting for code
- ✅ Proper heading hierarchy
- ✅ List formatting
- ✅ Link support

---

## 💡 Tips & Tricks

### Keyboard-Friendly
- Tab through form fields naturally
- Enter in search to filter immediately

### Organizing Notes
1. Use **tags** to categorize (e.g., `work`, `personal`, `urgent`)
2. Use **descriptive titles** for easy searching
3. Use **markdown headings** to structure content

### Markdown Examples

```markdown
# Main Heading

## Section

**Bold text** and *italic text*

- Bullet point 1
- Bullet point 2

1. Numbered item
2. Another item

`inline code`

\`\`\`javascript
// Code block
console.log("Hello!");
\`\`\`
```

---

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 is taken, change it:

```bash
PORT=3001 npm run web
```

Then visit `http://localhost:3001`

### Server Not Starting

1. Check dependencies: `npm install`
2. Verify no other process is using port 3000
3. Check for error messages in terminal

### Notes Not Showing

1. Verify `notes-data/` directory exists
2. Check browser console for errors (F12)
3. Try refreshing the page

### Can't Create Notes

1. Check browser console for validation errors
2. Ensure title is not empty
3. Check network tab for API errors

---

## 🔒 Security Notes

### Local Development
- The server runs on `localhost` only (not accessible from network)
- No authentication (it's for personal use)
- CORS enabled for API flexibility

### Production Considerations
If you want to deploy this:
- Add authentication (JWT, sessions, etc.)
- Use HTTPS
- Implement rate limiting
- Add input sanitization
- Set up proper CORS policies

---

## 📸 Interface Overview

### Sidebar (Left)
```
📝 Notes
────────────────
📊 Stats
  - Total Notes
  - Total Tags

🔍 Search Box

🏷️ Tag Filters
  [tag1] [tag2] [tag3]

➕ Create New Note
```

### Main Area (Right)
```
┌─────────────────────┐
│  Note Cards Grid    │
│  ┌──────┐ ┌──────┐  │
│  │ Note │ │ Note │  │
│  └──────┘ └──────┘  │
│  ┌──────┐ ┌──────┐  │
│  │ Note │ │ Note │  │
│  └──────┘ └──────┘  │
└─────────────────────┘
```

---

## 🎯 Next Steps

### Try It Now!

1. **Open browser**: http://localhost:3000
2. **Create a note**: Click "Create New Note"
3. **Add content**: Try some markdown!
4. **Test search**: Use the search bar
5. **Filter by tags**: Click tag filters

### Customize It

The web interface is easy to customize:
- Edit `public/styles.css` for different colors/themes
- Modify `public/index.html` for layout changes
- Update `public/app.js` for new features

---

## 🔗 Related Files

- Main README: [README.md](./README.md)
- Running Guide: [RUNNING.md](./RUNNING.md)
- Web Server: [src/web-server.ts](./src/web-server.ts)
- Frontend: [public/](./public/)

---

## ✅ Summary

You now have a **full-featured web dashboard** for your notes:

✅ Create, Read, Update, Delete notes  
✅ Search and filter functionality  
✅ Markdown support with live rendering  
✅ Tag-based organization  
✅ Beautiful, modern interface  
✅ Works alongside the MCP server  

**Enjoy your new notes dashboard!** 🎉

