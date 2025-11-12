'use client';

import React from 'react';

interface NoteDetailProps {
  note: {
    id: string;
    title: string;
    content: string;
    tags: string[];
    createdAt: string;
    updatedAt: string;
  };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function NoteDetail({ note, onEdit, onDelete }: NoteDetailProps) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '24px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '600', color: '#1a1a1a' }}>
          {note.title}
        </h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onEdit && (
            <button
              onClick={() => onEdit(note.id)}
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              ✏️ Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(note.id)}
              style={{
                padding: '6px 16px',
                fontSize: '14px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              🗑️ Delete
            </button>
          )}
        </div>
      </div>

      {note.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {note.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                borderRadius: '16px',
                fontWeight: '500',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div style={{
        color: '#333',
        fontSize: '16px',
        lineHeight: '1.8',
        marginBottom: '20px',
        whiteSpace: 'pre-wrap',
      }}>
        {note.content}
      </div>

      <div style={{
        paddingTop: '16px',
        borderTop: '1px solid #e0e0e0',
        fontSize: '12px',
        color: '#999',
      }}>
        <div>Created: {new Date(note.createdAt).toLocaleString()}</div>
        {note.updatedAt !== note.createdAt && (
          <div>Updated: {new Date(note.updatedAt).toLocaleString()}</div>
        )}
      </div>
    </div>
  );
}

