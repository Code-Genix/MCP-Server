'use client';

import React, { useState } from 'react';

interface NoteEditorProps {
  note?: {
    id: string;
    title: string;
    content: string;
    tags: string[];
  };
  onSubmit: (data: { title: string; content: string; tags: string[] }) => void;
  onCancel?: () => void;
}

export default function NoteEditor({ note, onSubmit, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tagsInput, setTagsInput] = useState(note?.tags.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const tags = tagsInput
      .split(',')
      .map(t => t.trim())
      .filter(t => t.length > 0);
    
    onSubmit({ title, content, tags });
  };

  return (
    <div style={{
      border: '1px solid #e0e0e0',
      borderRadius: '8px',
      padding: '20px',
      backgroundColor: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    }}>
      <h2 style={{ margin: '0 0 20px 0', fontSize: '20px', fontWeight: '600', color: '#1a1a1a' }}>
        {note ? '✏️ Edit Note' : '➕ Create New Note'}
      </h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            fontSize: '14px', 
            fontWeight: '500',
            color: '#333',
          }}>
            Title *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Enter note title"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            fontSize: '14px', 
            fontWeight: '500',
            color: '#333',
          }}>
            Content *
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            placeholder="Write your note here... (Markdown supported)"
            rows={8}
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              boxSizing: 'border-box',
              fontFamily: 'inherit',
              resize: 'vertical',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label style={{ 
            display: 'block', 
            marginBottom: '6px', 
            fontSize: '14px', 
            fontWeight: '500',
            color: '#333',
          }}>
            Tags (comma-separated)
          </label>
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="work, idea, urgent"
            style={{
              width: '100%',
              padding: '10px',
              fontSize: '14px',
              border: '1px solid #ddd',
              borderRadius: '6px',
              boxSizing: 'border-box',
            }}
          />
          <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
            Separate tags with commas
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              style={{
                padding: '10px 20px',
                fontSize: '14px',
                backgroundColor: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '500',
              }}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
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
            💾 {note ? 'Update' : 'Create'} Note
          </button>
        </div>
      </form>
    </div>
  );
}

