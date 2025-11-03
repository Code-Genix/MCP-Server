# 🚀 Quick Start: ChatGPT Integration

Get your notes working with ChatGPT in 5 minutes!

## Step 1: Get Your OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Click "Create new secret key"
3. Copy the key (it starts with `sk-...`)

## Step 2: Set Your API Key

```bash
export OPENAI_API_KEY="sk-your-key-here"
```

💡 **Tip:** To make this permanent, add it to your `~/.zshrc` or `~/.bashrc`:
```bash
echo 'export OPENAI_API_KEY="sk-your-key-here"' >> ~/.zshrc
source ~/.zshrc
```

## Step 3: Start the Notes Server

Open a terminal and run:
```bash
npm run web
```

You should see:
```
🌐 Web Dashboard Server running!
📍 URL: http://localhost:3000
```

✅ Leave this running!

## Step 4: Start ChatGPT Integration

Open a **NEW terminal** and run:
```bash
npm run chatgpt
```

You should see:
```
🤖 ChatGPT Notes Assistant
📝 Connected to your notes at: http://localhost:3000
💬 Type your requests and press Enter. Type "exit" to quit.
```

## Step 5: Try It Out!

Now you can chat naturally with ChatGPT to manage your notes:

```
👤 You: Create a note about my dentist appointment tomorrow at 3pm

🤖 Assistant: I've created a note for your dentist appointment...

👤 You: List all my notes

🤖 Assistant: You have 1 note...

👤 You: Create a shopping list note with eggs, milk, and bread

🤖 Assistant: I've created your shopping list note...

👤 You: Search for notes about appointments

🤖 Assistant: I found 1 note matching "appointments"...
```

## 🎯 What Can You Ask?

### Create Notes
- "Create a note about my meeting tomorrow"
- "Make a note with title 'Ideas' and content 'Build a todo app'"
- "Create a shopping list with eggs, milk, bread"

### Find Notes
- "Show me all my notes"
- "List all notes"
- "What notes do I have?"

### Search Notes
- "Search for notes about meetings"
- "Find notes with the word 'appointment'"
- "Show me notes tagged with 'work'"

### Update Notes
- "Update the note about [topic]"
- "Change the dentist note to 4pm instead"

### Delete Notes
- "Delete the note about [topic]"
- "Remove the shopping list note"

### Get Tags
- "What tags do I have?"
- "List all my tags"

## 🔧 Troubleshooting

### "Cannot connect to API"
**Problem:** Your notes server isn't running.
**Solution:** 
```bash
npm run web
```

### "OPENAI_API_KEY not set"
**Problem:** Environment variable not configured.
**Solution:**
```bash
export OPENAI_API_KEY="sk-your-key-here"
```

### "Insufficient credits"
**Problem:** Your OpenAI account needs credits.
**Solution:** Add credits at https://platform.openai.com/account/billing

### Function calls not working
**Problem:** The API server might not be accessible.
**Solution:** 
1. Check that `npm run web` is running
2. Visit http://localhost:3000 in your browser
3. Try the integration again

## 💰 Cost Estimate

Using GPT-4o (latest model):
- **Input:** ~$2.50 per 1M tokens
- **Output:** ~$10 per 1M tokens

Typical conversation:
- Simple note creation: ~$0.01
- Complex queries: ~$0.02-0.05
- Heavy usage (100 operations): ~$1-2

💡 **Tip:** You can switch to GPT-3.5-turbo in `chatgpt-integration.ts` for much cheaper costs (~10x less)!

## 🌟 Next Steps

Now that it's working, you can:

1. **Use it daily** - Replace your note-taking app
2. **Customize** - Edit `chatgpt-integration.ts` to change behavior
3. **Deploy** - See `CHATGPT-INTEGRATION.md` for production setup
4. **Extend** - Add new functions (reminders, calendar integration, etc.)

## 📚 More Information

- Full integration guide: `CHATGPT-INTEGRATION.md`
- API documentation: `README.md`
- Troubleshooting: `TROUBLESHOOTING.md`

---

**Enjoy your AI-powered note-taking! 🎉**


