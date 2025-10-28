import { promises as fs } from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import type { Note, NoteMetadata, CreateNoteInput, UpdateNoteInput } from '../types.js';

/**
 * Storage class for managing notes on the file system
 */
export class NotesStorage {
  private notesDir: string;
  private indexFile: string;

  constructor(baseDir: string = './notes-data') {
    this.notesDir = path.resolve(baseDir);
    this.indexFile = path.join(this.notesDir, 'index.json');
  }

  /**
   * Initialize storage directory and index file
   */
  async initialize(): Promise<void> {
    try {
      await fs.mkdir(this.notesDir, { recursive: true });
      
      // Create index file if it doesn't exist
      try {
        await fs.access(this.indexFile);
      } catch {
        await fs.writeFile(this.indexFile, JSON.stringify([], null, 2));
      }
    } catch (error) {
      throw new Error(`Failed to initialize storage: ${error}`);
    }
  }

  /**
   * Read the index of all notes
   */
  private async readIndex(): Promise<NoteMetadata[]> {
    try {
      const data = await fs.readFile(this.indexFile, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error(`Failed to read index: ${error}`);
    }
  }

  /**
   * Write the index of all notes
   */
  private async writeIndex(index: NoteMetadata[]): Promise<void> {
    try {
      await fs.writeFile(this.indexFile, JSON.stringify(index, null, 2));
    } catch (error) {
      throw new Error(`Failed to write index: ${error}`);
    }
  }

  /**
   * Get the file path for a note
   */
  private getNotePath(id: string): string {
    return path.join(this.notesDir, `${id}.md`);
  }

  /**
   * Create a new note
   */
  async createNote(input: CreateNoteInput): Promise<Note> {
    const id = randomUUID();
    const now = new Date().toISOString();
    
    const note: Note = {
      id,
      title: input.title,
      content: input.content,
      tags: input.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    // Write note content to file
    const notePath = this.getNotePath(id);
    await fs.writeFile(notePath, note.content, 'utf-8');

    // Update index
    const index = await this.readIndex();
    index.push({
      id: note.id,
      title: note.title,
      tags: note.tags,
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });
    await this.writeIndex(index);

    return note;
  }

  /**
   * Get a note by ID
   */
  async getNote(id: string): Promise<Note | null> {
    const index = await this.readIndex();
    const metadata = index.find(n => n.id === id);
    
    if (!metadata) {
      return null;
    }

    try {
      const content = await fs.readFile(this.getNotePath(id), 'utf-8');
      return {
        ...metadata,
        content,
      };
    } catch (error) {
      // File doesn't exist but is in index - clean up
      await this.deleteNote(id);
      return null;
    }
  }

  /**
   * List all notes (metadata only)
   */
  async listNotes(): Promise<NoteMetadata[]> {
    return await this.readIndex();
  }

  /**
   * Update an existing note
   */
  async updateNote(input: UpdateNoteInput): Promise<Note | null> {
    const existingNote = await this.getNote(input.id);
    
    if (!existingNote) {
      return null;
    }

    const updatedNote: Note = {
      ...existingNote,
      title: input.title ?? existingNote.title,
      content: input.content ?? existingNote.content,
      tags: input.tags ?? existingNote.tags,
      updatedAt: new Date().toISOString(),
    };

    // Update note content
    if (input.content !== undefined) {
      await fs.writeFile(this.getNotePath(input.id), updatedNote.content, 'utf-8');
    }

    // Update index
    const index = await this.readIndex();
    const noteIndex = index.findIndex(n => n.id === input.id);
    if (noteIndex !== -1) {
      index[noteIndex] = {
        id: updatedNote.id,
        title: updatedNote.title,
        tags: updatedNote.tags,
        createdAt: updatedNote.createdAt,
        updatedAt: updatedNote.updatedAt,
      };
      await this.writeIndex(index);
    }

    return updatedNote;
  }

  /**
   * Delete a note
   */
  async deleteNote(id: string): Promise<boolean> {
    const index = await this.readIndex();
    const noteIndex = index.findIndex(n => n.id === id);
    
    if (noteIndex === -1) {
      return false;
    }

    // Delete file
    try {
      await fs.unlink(this.getNotePath(id));
    } catch {
      // File might not exist, continue with index cleanup
    }

    // Update index
    index.splice(noteIndex, 1);
    await this.writeIndex(index);

    return true;
  }

  /**
   * Search notes by query and/or tags
   */
  async searchNotes(query: string, tags?: string[]): Promise<Note[]> {
    const allNotes = await this.listNotes();
    const results: Note[] = [];

    for (const metadata of allNotes) {
      // Filter by tags if provided
      if (tags && tags.length > 0) {
        const hasAllTags = tags.every(tag => metadata.tags.includes(tag));
        if (!hasAllTags) {
          continue;
        }
      }

      // Get full note to search content
      const note = await this.getNote(metadata.id);
      if (!note) {
        continue;
      }

      // Search in title and content
      const searchText = query.toLowerCase();
      const titleMatch = note.title.toLowerCase().includes(searchText);
      const contentMatch = note.content.toLowerCase().includes(searchText);
      
      if (titleMatch || contentMatch) {
        results.push(note);
      }
    }

    return results;
  }

  /**
   * Get all unique tags
   */
  async getAllTags(): Promise<string[]> {
    const index = await this.readIndex();
    const tagSet = new Set<string>();
    
    for (const note of index) {
      note.tags.forEach(tag => tagSet.add(tag));
    }

    return Array.from(tagSet).sort();
  }
}

