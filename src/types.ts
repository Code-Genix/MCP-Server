import { z } from 'zod';

/**
 * Schema for creating a new note
 */
export const CreateNoteSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  content: z.string(),
  tags: z.array(z.string()).optional().default([]),
});

/**
 * Schema for updating an existing note
 */
export const UpdateNoteSchema = z.object({
  id: z.string().min(1, 'Note ID is required'),
  title: z.string().min(1).optional(),
  content: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

/**
 * Schema for searching notes
 */
export const SearchNotesSchema = z.object({
  query: z.string().min(1, 'Search query is required'),
  tags: z.array(z.string()).optional(),
});

/**
 * Schema for deleting a note
 */
export const DeleteNoteSchema = z.object({
  id: z.string().min(1, 'Note ID is required'),
});

/**
 * Schema for getting a specific note
 */
export const GetNoteSchema = z.object({
  id: z.string().min(1, 'Note ID is required'),
});

/**
 * Represents a note in the system
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

/**
 * Input type for creating a note
 */
export type CreateNoteInput = z.infer<typeof CreateNoteSchema>;

/**
 * Input type for updating a note
 */
export type UpdateNoteInput = z.infer<typeof UpdateNoteSchema>;

/**
 * Input type for searching notes
 */
export type SearchNotesInput = z.infer<typeof SearchNotesSchema>;

/**
 * Input type for deleting a note
 */
export type DeleteNoteInput = z.infer<typeof DeleteNoteSchema>;

/**
 * Input type for getting a note
 */
export type GetNoteInput = z.infer<typeof GetNoteSchema>;

/**
 * Metadata about a note (without content)
 */
export interface NoteMetadata {
  id: string;
  title: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

