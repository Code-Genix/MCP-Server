import { describe, it, expect } from 'vitest';
import {
  CreateNoteSchema,
  UpdateNoteSchema,
  SearchNotesSchema,
  DeleteNoteSchema,
  GetNoteSchema,
} from '../src/types.js';

describe('Validation Schemas', () => {
  describe('CreateNoteSchema', () => {
    it('should validate valid input', () => {
      const input = {
        title: 'Test Note',
        content: 'Test content',
        tags: ['test'],
      };

      const result = CreateNoteSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should allow empty tags array', () => {
      const input = {
        title: 'Test',
        content: 'Content',
        tags: [],
      };

      const result = CreateNoteSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should default tags to empty array when omitted', () => {
      const input = {
        title: 'Test',
        content: 'Content',
      };

      const result = CreateNoteSchema.parse(input);
      expect(result.tags).toEqual([]);
    });

    it('should reject empty title', () => {
      const input = {
        title: '',
        content: 'Content',
      };

      const result = CreateNoteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject missing title', () => {
      const input = {
        content: 'Content',
      };

      const result = CreateNoteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject missing content', () => {
      const input = {
        title: 'Test',
      };

      const result = CreateNoteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should allow empty content', () => {
      const input = {
        title: 'Test',
        content: '',
      };

      const result = CreateNoteSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('UpdateNoteSchema', () => {
    it('should validate valid input with all fields', () => {
      const input = {
        id: 'test-id',
        title: 'New Title',
        content: 'New content',
        tags: ['updated'],
      };

      const result = UpdateNoteSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should allow updating only title', () => {
      const input = {
        id: 'test-id',
        title: 'New Title',
      };

      const result = UpdateNoteSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should allow updating only content', () => {
      const input = {
        id: 'test-id',
        content: 'New content',
      };

      const result = UpdateNoteSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should allow updating only tags', () => {
      const input = {
        id: 'test-id',
        tags: ['new', 'tags'],
      };

      const result = UpdateNoteSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should require id', () => {
      const input = {
        title: 'New Title',
      };

      const result = UpdateNoteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject empty id', () => {
      const input = {
        id: '',
        title: 'New Title',
      };

      const result = UpdateNoteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('SearchNotesSchema', () => {
    it('should validate valid search with query only', () => {
      const input = {
        query: 'search term',
      };

      const result = SearchNotesSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should validate search with query and tags', () => {
      const input = {
        query: 'search term',
        tags: ['tag1', 'tag2'],
      };

      const result = SearchNotesSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject empty query', () => {
      const input = {
        query: '',
      };

      const result = SearchNotesSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject missing query', () => {
      const input = {
        tags: ['tag1'],
      };

      const result = SearchNotesSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should allow empty tags array', () => {
      const input = {
        query: 'search',
        tags: [],
      };

      const result = SearchNotesSchema.safeParse(input);
      expect(result.success).toBe(true);
    });
  });

  describe('DeleteNoteSchema', () => {
    it('should validate valid id', () => {
      const input = {
        id: 'test-id',
      };

      const result = DeleteNoteSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject empty id', () => {
      const input = {
        id: '',
      };

      const result = DeleteNoteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject missing id', () => {
      const input = {};

      const result = DeleteNoteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });

  describe('GetNoteSchema', () => {
    it('should validate valid id', () => {
      const input = {
        id: 'test-id',
      };

      const result = GetNoteSchema.safeParse(input);
      expect(result.success).toBe(true);
    });

    it('should reject empty id', () => {
      const input = {
        id: '',
      };

      const result = GetNoteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });

    it('should reject missing id', () => {
      const input = {};

      const result = GetNoteSchema.safeParse(input);
      expect(result.success).toBe(false);
    });
  });
});

