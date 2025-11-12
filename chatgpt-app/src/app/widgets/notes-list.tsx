'use client';

import React from 'react';
import NoteCard from './note-card';

interface NotesListProps {
  notes: Array<{
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  }>;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreate?: () => void;
}

export default function NotesList({ notes, onEdit, onDelete, onCreate }: NotesListProps) {
  if (notes.length === 0) {
    return (
      <div style={{
        padding: '40px',
        textAlign: 'center',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📭</div>
        <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>No notes yet</h3>
        <p style={{ margin: '0 0 20px 0', color: '#666' }}>Create your first note to get started!</p>
        {onCreate && (
          <button
            onClick={onCreate}
            style={{
              padding: '10px 20px',
              fontSize: '14px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            ➕ Create Note
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: '8px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '16px',
      }}>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600', color: '#1a1a1a' }}>
          📚 Notes ({notes.length})
        </h2>
        {onCreate && (
          <button
            onClick={onCreate}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            ➕ New Note
          </button>
        )}
      </div>
      
      <div>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
}

