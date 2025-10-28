import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { NotesStorage } from '../src/storage/NotesStorage.js';

describe('NotesStorage', () => {
  const testDir = './test-notes-data';
  let storage: NotesStorage;

  beforeEach(async () => {
    storage = new NotesStorage(testDir);
    await storage.initialize();
  });

  afterEach(async () => {
    // Clean up test directory
    try {
      await fs.rm(testDir, { recursive: true, force: true });
    } catch {
      // Ignore errors
    }
  });

  describe('initialize', () => {
    it('should create notes directory and index file', async () => {
      const indexPath = path.join(testDir, 'index.json');
      const indexExists = await fs.access(indexPath).then(() => true).catch(() => false);
      expect(indexExists).toBe(true);
      
      const content = await fs.readFile(indexPath, 'utf-8');
      expect(JSON.parse(content)).toEqual([]);
    });
  });

  describe('createNote', () => {
    it('should create a new note with all fields', async () => {
      const input = {
        title: 'Test Note',
        content: 'This is test content',
        tags: ['test', 'example'],
      };

      const note = await storage.createNote(input);

      expect(note.id).toBeDefined();
      expect(note.title).toBe(input.title);
      expect(note.content).toBe(input.content);
      expect(note.tags).toEqual(input.tags);
      expect(note.createdAt).toBeDefined();
      expect(note.updatedAt).toBeDefined();
      expect(note.createdAt).toBe(note.updatedAt);
    });

    it('should create a note without tags', async () => {
      const input = {
        title: 'Simple Note',
        content: 'Simple content',
      };

      const note = await storage.createNote(input);

      expect(note.tags).toEqual([]);
    });

    it('should save note content to file', async () => {
      const input = {
        title: 'File Test',
        content: 'Content should be in file',
        tags: [],
      };

      const note = await storage.createNote(input);
      const filePath = path.join(testDir, `${note.id}.md`);
      const fileContent = await fs.readFile(filePath, 'utf-8');

      expect(fileContent).toBe(input.content);
    });

    it('should add note to index', async () => {
      const input = {
        title: 'Index Test',
        content: 'Testing index',
        tags: ['index'],
      };

      const note = await storage.createNote(input);
      const notes = await storage.listNotes();

      expect(notes).toHaveLength(1);
      expect(notes[0].id).toBe(note.id);
      expect(notes[0].title).toBe(note.title);
    });
  });

  describe('getNote', () => {
    it('should retrieve an existing note', async () => {
      const created = await storage.createNote({
        title: 'Get Test',
        content: 'Get content',
        tags: ['get'],
      });

      const retrieved = await storage.getNote(created.id);

      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.title).toBe(created.title);
      expect(retrieved?.content).toBe(created.content);
      expect(retrieved?.tags).toEqual(created.tags);
    });

    it('should return null for non-existent note', async () => {
      const note = await storage.getNote('non-existent-id');
      expect(note).toBeNull();
    });
  });

  describe('listNotes', () => {
    it('should return empty array when no notes exist', async () => {
      const notes = await storage.listNotes();
      expect(notes).toEqual([]);
    });

    it('should list all notes metadata', async () => {
      await storage.createNote({ title: 'Note 1', content: 'Content 1', tags: ['a'] });
      await storage.createNote({ title: 'Note 2', content: 'Content 2', tags: ['b'] });
      await storage.createNote({ title: 'Note 3', content: 'Content 3', tags: ['c'] });

      const notes = await storage.listNotes();

      expect(notes).toHaveLength(3);
      expect(notes.map(n => n.title)).toEqual(['Note 1', 'Note 2', 'Note 3']);
    });

    it('should not include content in list', async () => {
      await storage.createNote({ title: 'Test', content: 'Secret content', tags: [] });
      const notes = await storage.listNotes();

      expect(notes[0]).not.toHaveProperty('content');
    });
  });

  describe('updateNote', () => {
    it('should update note title', async () => {
      const created = await storage.createNote({
        title: 'Original Title',
        content: 'Content',
        tags: [],
      });

      // Small delay to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));

      const updated = await storage.updateNote({
        id: created.id,
        title: 'New Title',
      });

      expect(updated?.title).toBe('New Title');
      expect(updated?.content).toBe('Content');
      expect(updated?.updatedAt).not.toBe(created.updatedAt);
    });

    it('should update note content', async () => {
      const created = await storage.createNote({
        title: 'Title',
        content: 'Original Content',
        tags: [],
      });

      const updated = await storage.updateNote({
        id: created.id,
        content: 'New Content',
      });

      expect(updated?.content).toBe('New Content');
      
      // Verify file was updated
      const filePath = path.join(testDir, `${created.id}.md`);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      expect(fileContent).toBe('New Content');
    });

    it('should update note tags', async () => {
      const created = await storage.createNote({
        title: 'Title',
        content: 'Content',
        tags: ['old'],
      });

      const updated = await storage.updateNote({
        id: created.id,
        tags: ['new', 'updated'],
      });

      expect(updated?.tags).toEqual(['new', 'updated']);
    });

    it('should return null for non-existent note', async () => {
      const result = await storage.updateNote({
        id: 'non-existent',
        title: 'New Title',
      });

      expect(result).toBeNull();
    });

    it('should update multiple fields at once', async () => {
      const created = await storage.createNote({
        title: 'Old',
        content: 'Old',
        tags: ['old'],
      });

      const updated = await storage.updateNote({
        id: created.id,
        title: 'New',
        content: 'New',
        tags: ['new'],
      });

      expect(updated?.title).toBe('New');
      expect(updated?.content).toBe('New');
      expect(updated?.tags).toEqual(['new']);
    });
  });

  describe('deleteNote', () => {
    it('should delete an existing note', async () => {
      const created = await storage.createNote({
        title: 'To Delete',
        content: 'Will be deleted',
        tags: [],
      });

      const success = await storage.deleteNote(created.id);
      expect(success).toBe(true);

      const retrieved = await storage.getNote(created.id);
      expect(retrieved).toBeNull();
    });

    it('should remove note from index', async () => {
      const created = await storage.createNote({
        title: 'To Delete',
        content: 'Content',
        tags: [],
      });

      await storage.deleteNote(created.id);
      const notes = await storage.listNotes();

      expect(notes).toHaveLength(0);
    });

    it('should delete note file', async () => {
      const created = await storage.createNote({
        title: 'To Delete',
        content: 'Content',
        tags: [],
      });

      const filePath = path.join(testDir, `${created.id}.md`);
      await storage.deleteNote(created.id);

      const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
      expect(fileExists).toBe(false);
    });

    it('should return false for non-existent note', async () => {
      const success = await storage.deleteNote('non-existent');
      expect(success).toBe(false);
    });
  });

  describe('searchNotes', () => {
    beforeEach(async () => {
      await storage.createNote({
        title: 'JavaScript Tutorial',
        content: 'Learn JavaScript basics',
        tags: ['programming', 'javascript'],
      });

      await storage.createNote({
        title: 'Python Guide',
        content: 'Introduction to Python',
        tags: ['programming', 'python'],
      });

      await storage.createNote({
        title: 'Meeting Notes',
        content: 'Discussed JavaScript project',
        tags: ['meeting'],
      });
    });

    it('should search by title', async () => {
      const results = await storage.searchNotes('JavaScript');
      expect(results).toHaveLength(2);
      expect(results.map(n => n.title)).toContain('JavaScript Tutorial');
      expect(results.map(n => n.title)).toContain('Meeting Notes');
    });

    it('should search by content', async () => {
      const results = await storage.searchNotes('Introduction');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('Python Guide');
    });

    it('should be case insensitive', async () => {
      const results = await storage.searchNotes('javascript');
      expect(results.length).toBeGreaterThan(0);
    });

    it('should filter by tags', async () => {
      const results = await storage.searchNotes('', ['programming']);
      expect(results).toHaveLength(2);
      expect(results.every(n => n.tags.includes('programming'))).toBe(true);
    });

    it('should search with both query and tags', async () => {
      const results = await storage.searchNotes('JavaScript', ['programming']);
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('JavaScript Tutorial');
    });

    it('should return empty array when no matches', async () => {
      const results = await storage.searchNotes('nonexistent');
      expect(results).toEqual([]);
    });

    it('should require all tags to match', async () => {
      const results = await storage.searchNotes('', ['programming', 'javascript']);
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('JavaScript Tutorial');
    });
  });

  describe('getAllTags', () => {
    it('should return empty array when no notes exist', async () => {
      const tags = await storage.getAllTags();
      expect(tags).toEqual([]);
    });

    it('should return all unique tags', async () => {
      await storage.createNote({ title: 'N1', content: 'C1', tags: ['a', 'b'] });
      await storage.createNote({ title: 'N2', content: 'C2', tags: ['b', 'c'] });
      await storage.createNote({ title: 'N3', content: 'C3', tags: ['c', 'd'] });

      const tags = await storage.getAllTags();
      expect(tags).toHaveLength(4);
      expect(tags).toEqual(['a', 'b', 'c', 'd']);
    });

    it('should return sorted tags', async () => {
      await storage.createNote({ title: 'N1', content: 'C1', tags: ['zebra', 'alpha'] });
      
      const tags = await storage.getAllTags();
      expect(tags).toEqual(['alpha', 'zebra']);
    });

    it('should not include duplicate tags', async () => {
      await storage.createNote({ title: 'N1', content: 'C1', tags: ['tag'] });
      await storage.createNote({ title: 'N2', content: 'C2', tags: ['tag'] });

      const tags = await storage.getAllTags();
      expect(tags).toEqual(['tag']);
    });
  });
});

