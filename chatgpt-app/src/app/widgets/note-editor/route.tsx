import { NextRequest, NextResponse } from 'next/server';
import { escapeHtml, renderTags } from '../../../lib/widget-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const noteData = searchParams.get('data');
  
  try {
    const note = noteData ? JSON.parse(decodeURIComponent(noteData)) : undefined;
    const isEdit = !!note;
    const tagsHtml = note ? renderTags(note.tags || []) : '';
    
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
    .editor { background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
    .editor-title { font-size: 24px; font-weight: 600; margin-bottom: 20px; color: #333; }
    .form-group { margin-bottom: 20px; }
    label { display: block; font-weight: 500; margin-bottom: 8px; color: #333; }
    input, textarea { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; font-family: inherit; font-size: 14px; }
    textarea { min-height: 200px; resize: vertical; }
    .tags-display { margin-top: 8px; }
    .info { font-size: 14px; color: #666; margin-top: 8px; }
  </style>
</head>
<body>
  <div class="editor">
    <div class="editor-title">${isEdit ? 'Edit Note' : 'Create Note'}</div>
    <div class="form-group">
      <label>Title</label>
      <input type="text" value="${note ? escapeHtml(note.title || '') : ''}" readonly style="background: #f5f5f5; cursor: not-allowed;">
    </div>
    <div class="form-group">
      <label>Content</label>
      <textarea readonly style="background: #f5f5f5; cursor: not-allowed;">${note ? escapeHtml(note.content || '') : ''}</textarea>
    </div>
    ${tagsHtml ? `<div class="form-group"><label>Tags</label><div class="tags-display">${tagsHtml}</div></div>` : ''}
    <div class="info">Note: This is a read-only preview. Use ChatGPT commands to edit notes.</div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return NextResponse.json({ error: `Error rendering widget: ${error}` }, { status: 500 });
  }
}

