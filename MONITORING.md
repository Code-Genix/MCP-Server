# 👀 Monitoring Your Notes Server

This guide shows you **where to see real-time updates** as you interact with your notes.

---

## 🖥️ Terminal Window (Server Logs)

### Location
The terminal where you ran `npm run web` - **THIS IS YOUR ACTIVITY MONITOR!**

### What You'll See

When you interact with the web dashboard, you'll see **real-time logs** like this:

```bash
🌐 Web Dashboard Server running!
📍 URL: http://localhost:3000
📁 Storage: notes-data/

✨ Open http://localhost:3000 in your browser

👀 Watch this terminal for real-time activity!

[10:30:45] GET /api/stats
   📊 Stats: 2 notes, 4 tags

[10:30:47] GET /api/notes
   ✅ Retrieved 2 notes

[10:31:02] POST /api/notes
   ✅ Created note: "My New Note" [work, important]

[10:31:15] GET /api/notes/abc-123
   ✅ Retrieved note: "My New Note"

[10:31:30] PUT /api/notes/abc-123
   ✅ Updated note: "My Updated Note"

[10:31:45] DELETE /api/notes/abc-123
   🗑️  Deleted note: abc-123

[10:32:00] POST /api/notes/search
   🔍 Search "javascript" found 3 notes
```

### Log Symbols

| Symbol | Meaning |
|--------|---------|
| ✅ | Successful operation |
| ❌ | Error occurred |
| ⚠️ | Warning (e.g., note not found) |
| 🔍 | Search operation |
| 🗑️ | Delete operation |
| 📊 | Statistics retrieved |

---

## 🌐 Browser Window (Visual Updates)

### Location
Your browser at **http://localhost:3000**

### What You'll See

1. **Instant UI Updates**
   - Create a note → See it appear in the grid immediately
   - Delete a note → Card disappears with animation
   - Edit a note → Changes reflect instantly
   - Search → Results filter in real-time

2. **Toast Notifications** (bottom-right)
   - "Note created successfully!" ✅
   - "Note updated successfully!" ✅
   - "Note deleted successfully!" ✅
   - Error messages if something fails ❌

3. **Stats Counter Updates**
   - Total notes counter updates
   - Total tags counter updates
   - Tag filters refresh automatically

---

## 📁 File System (Storage)

### Location
`/Users/ketakimore/MCP-Server-1/notes-data/`

### What You'll See

**Real-time file changes:**

```
notes-data/
├── index.json              ← Updates when notes change
├── {uuid-1}.md            ← Created when you create a note
├── {uuid-2}.md            ← Each note gets its own file
└── ...
```

### How to Watch Files

**Option 1: Manual Check**
```bash
ls -la notes-data/
cat notes-data/index.json
```

**Option 2: Watch Files (macOS/Linux)**
```bash
# In a new terminal
watch -n 1 'ls -lh notes-data/ && echo && cat notes-data/index.json'
```

**Option 3: VS Code**
Open the `notes-data/` folder in VS Code and watch files change in real-time!

---

## 🔄 Multi-Window Monitoring Setup

### Recommended Setup for Full Visibility

```
┌─────────────────────────────────────────────────────────┐
│  SCREEN LAYOUT                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────┐  ┌───────────────────────────┐   │
│  │  Terminal        │  │  Browser                  │   │
│  │  (Server Logs)   │  │  http://localhost:3000    │   │
│  │                  │  │                           │   │
│  │  [10:30:45] GET  │  │  ┌─────┐  ┌─────┐        │   │
│  │  [10:30:47] POST │  │  │Note │  │Note │        │   │
│  │  ✅ Created...   │  │  └─────┘  └─────┘        │   │
│  │                  │  │                           │   │
│  └──────────────────┘  └───────────────────────────┘   │
│                                                         │
│  ┌────────────────────────────────────────────────┐    │
│  │  VS Code (Optional)                            │    │
│  │  Explorer: notes-data/ folder                  │    │
│  │  - index.json                                  │    │
│  │  - note-1.md                                   │    │
│  │  - note-2.md                                   │    │
│  └────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────┘
```

---

## 🧪 Test the Monitoring

### Try These Actions

1. **Open Terminal** - Watch the server logs
2. **Open Browser** - Go to http://localhost:3000
3. **Create a Note**
   - In Browser: Click "Create New Note"
   - In Terminal: See `POST /api/notes` and `✅ Created note...`
4. **Search for Notes**
   - In Browser: Type in search box
   - In Terminal: See `POST /api/notes/search` and results count
5. **Delete a Note**
   - In Browser: Open note, click Delete
   - In Terminal: See `DELETE /api/notes/...` and `🗑️ Deleted...`

---

## 📊 Activity Dashboard (Enhanced)

### Real-Time Console Output

Your terminal will show:

```bash
👀 Watch this terminal for real-time activity!

[10:45:30] GET /api/stats
   📊 Stats: 5 notes, 8 tags

[10:45:32] GET /api/notes
   ✅ Retrieved 5 notes

[10:45:35] GET /api/tags
   ✅ Retrieved 8 tags

[10:46:12] POST /api/notes
   ✅ Created note: "Project Ideas" [brainstorm, work]

[10:46:45] POST /api/notes/search
   🔍 Search "project" found 2 notes

[10:47:20] GET /api/notes/abc-123
   ✅ Retrieved note: "Project Ideas"

[10:47:55] PUT /api/notes/abc-123
   ✅ Updated note: "Project Ideas - Revised"

[10:48:30] GET /api/notes
   ✅ Retrieved 5 notes
```

---

## 🛠️ Debugging Tips

### Server Not Logging?

Make sure you restarted the server after adding logging:

```bash
# Stop old server (if running)
pkill -f "tsx src/web-server.ts"

# Start new server with logging
npm run web
```

### Want More Detailed Logs?

Edit `src/web-server.ts` and add more console.log statements:

```typescript
app.post('/api/notes', async (req, res) => {
  console.log('   📝 Request body:', req.body);  // Add this
  // ... rest of code
});
```

### Browser Not Updating?

1. **Hard refresh**: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
2. **Clear cache**: Open DevTools (F12) → Application → Clear Storage
3. **Check console**: F12 → Console tab for errors

---

## 🎯 What to Watch For

### Normal Activity
- ✅ Green checkmarks
- 📊 Stats updates
- 🔍 Search queries
- Timestamp on each request

### Issues to Notice
- ❌ Red X marks = errors
- ⚠️ Warning symbols = not found
- Long delays between request and response
- Error messages in browser console

---

## 📝 Quick Reference

| You Do This... | See in Terminal | See in Browser |
|----------------|-----------------|----------------|
| Load page | `GET /` | Dashboard appears |
| View notes | `GET /api/notes` | Notes grid shows |
| Create note | `POST /api/notes` ✅ Created | Toast notification |
| Search notes | `POST /api/notes/search` 🔍 | Results filter |
| Edit note | `PUT /api/notes/:id` ✅ Updated | Note changes |
| Delete note | `DELETE /api/notes/:id` 🗑️ | Card disappears |

---

## 💡 Pro Tips

1. **Keep terminal visible** while using the browser to see real-time activity
2. **Watch the timestamp** to correlate actions with requests
3. **Use two monitors** if available - browser on one, terminal on the other
4. **Check notes-data/ folder** in VS Code to see actual file changes
5. **Open browser DevTools** (F12) → Network tab to see API calls in detail

---

## 🔗 Related

- [WEB-DASHBOARD.md](./WEB-DASHBOARD.md) - Full web interface guide
- [RUNNING.md](./RUNNING.md) - Running instructions
- [README.md](./README.md) - Main documentation

---

**Now you know exactly where to see all the changes happening!** 👀

