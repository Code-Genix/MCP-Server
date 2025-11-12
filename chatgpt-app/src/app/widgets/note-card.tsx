'use client';

import React from 'react';

interface NoteCardProps {
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

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '12px',
      backgroundColor: '#ffffff',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
        <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600', color: '#1a1a1a' }}>
          {note.title}
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          {onEdit && (
            <button
              onClick={() => onEdit(note.id)}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(note.id)}
              style={{
                padding: '4px 12px',
                fontSize: '12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Delete
            </button>
          )}
        </div>
      </div>
      
      <div style={{ 
        color: '#666',
        fontSize: '14px',
        lineHeight: '1.6',
        marginBottom: '12px',
        whiteSpace: 'pre-wrap',
      }}>
        {note.content.substring(0, 200)}{note.content.length > 200 ? '...' : ''}
      </div>

      {note.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '8px' }}>
          {note.tags.map((tag, idx) => (
            <span
              key={idx}
              style={{
                padding: '2px 8px',
                fontSize: '11px',
                backgroundColor: '#e3f2fd',
                color: '#1976d2',
                borderRadius: '12px',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div style={{ fontSize: '11px', color: '#999' }}>
        Created: {new Date(note.createdAt).toLocaleDateString()}
        {note.updatedAt !== note.createdAt && (
          <> • Updated: {new Date(note.updatedAt).toLocaleDateString()}</>
        )}
      </div>
    </div>
  );
}

