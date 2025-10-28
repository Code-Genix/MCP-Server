#!/usr/bin/env node

/**
 * Web Dashboard Server for MCP Notes
 * Provides a browser-based UI to manage notes
 */

import express from 'express';
import cors from 'cors';
import { NotesStorage } from './storage/NotesStorage.js';
import {
  CreateNoteSchema,
  UpdateNoteSchema,
  SearchNotesSchema,
  DeleteNoteSchema,
  GetNoteSchema,
} from './types.js';
import { z } from 'zod';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const storage = new NotesStorage();

// Middleware
app.use(cors());
app.use(express.json());

// Logging middleware to see requests in terminal
app.use((req, res, next) => {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

app.use(express.static(path.join(__dirname, '../public')));

// Initialize storage
await storage.initialize();

// API Routes

/**
 * GET /api/notes - List all notes (metadata only)
 */
app.get('/api/notes', async (req, res) => {
  try {
    const notes = await storage.listNotes();
    console.log(`   ✅ Retrieved ${notes.length} notes`);
    res.json({ success: true, data: notes });
  } catch (error) {
    console.error('   ❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * GET /api/notes/:id - Get a specific note
 */
app.get('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const note = await storage.getNote(id);
    
    if (!note) {
      console.log(`   ⚠️  Note not found: ${id}`);
      return res.status(404).json({ 
        success: false, 
        error: 'Note not found' 
      });
    }
    
    console.log(`   ✅ Retrieved note: "${note.title}"`);
    res.json({ success: true, data: note });
  } catch (error) {
    console.error('   ❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * POST /api/notes - Create a new note
 */
app.post('/api/notes', async (req, res) => {
  try {
    const input = CreateNoteSchema.parse(req.body);
    const note = await storage.createNote(input);
    console.log(`   ✅ Created note: "${note.title}" [${note.tags.join(', ')}]`);
    res.status(201).json({ success: true, data: note });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('   ❌ Validation error:', error.errors);
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    console.error('   ❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * PUT /api/notes/:id - Update an existing note
 */
app.put('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const input = UpdateNoteSchema.parse({ ...req.body, id });
    const note = await storage.updateNote(input);
    
    if (!note) {
      console.log(`   ⚠️  Note not found: ${id}`);
      return res.status(404).json({ 
        success: false, 
        error: 'Note not found' 
      });
    }
    
    console.log(`   ✅ Updated note: "${note.title}"`);
    res.json({ success: true, data: note });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('   ❌ Validation error:', error.errors);
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    console.error('   ❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * DELETE /api/notes/:id - Delete a note
 */
app.delete('/api/notes/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const success = await storage.deleteNote(id);
    
    if (!success) {
      console.log(`   ⚠️  Note not found: ${id}`);
      return res.status(404).json({ 
        success: false, 
        error: 'Note not found' 
      });
    }
    
    console.log(`   🗑️  Deleted note: ${id}`);
    res.json({ success: true, message: 'Note deleted successfully' });
  } catch (error) {
    console.error('   ❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * POST /api/notes/search - Search notes
 */
app.post('/api/notes/search', async (req, res) => {
  try {
    const input = SearchNotesSchema.parse(req.body);
    const notes = await storage.searchNotes(input.query, input.tags);
    console.log(`   🔍 Search "${input.query}" found ${notes.length} notes`);
    res.json({ success: true, data: notes });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('   ❌ Validation error:', error.errors);
      return res.status(400).json({ 
        success: false, 
        error: 'Validation error', 
        details: error.errors 
      });
    }
    console.error('   ❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * GET /api/tags - Get all unique tags
 */
app.get('/api/tags', async (req, res) => {
  try {
    const tags = await storage.getAllTags();
    console.log(`   ✅ Retrieved ${tags.length} tags`);
    res.json({ success: true, data: tags });
  } catch (error) {
    console.error('   ❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

/**
 * GET /api/stats - Get statistics
 */
app.get('/api/stats', async (req, res) => {
  try {
    const notes = await storage.listNotes();
    const tags = await storage.getAllTags();
    
    console.log(`   📊 Stats: ${notes.length} notes, ${tags.length} tags`);
    
    res.json({ 
      success: true, 
      data: {
        totalNotes: notes.length,
        totalTags: tags.length,
        recentNotes: notes
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
          .slice(0, 5),
      }
    });
  } catch (error) {
    console.error('   ❌ Error:', error);
    res.status(500).json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🌐 Web Dashboard Server running!`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`📁 Storage: notes-data/`);
  console.log(`\n✨ Open http://localhost:${PORT} in your browser`);
  console.log(`\n👀 Watch this terminal for real-time activity!\n`);
});
