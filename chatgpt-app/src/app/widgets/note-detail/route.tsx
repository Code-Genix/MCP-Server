import { NextRequest, NextResponse } from 'next/server';
import { escapeHtml, formatDate, renderTags } from '../../../lib/widget-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const noteData = searchParams.get('data');
  
  if (!noteData) {
    return NextResponse.json({ error: 'Missing note data' }, { status: 400 });
  }

  try {
    const note = JSON.parse(decodeURIComponent(noteData));
    const tagsHtml = renderTags(note.tags || []);
    
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
    .note-detail { background: white; border-radius: 8px; padding: 24px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 800px; margin: 0 auto; }
    .note-title { font-size: 28px; font-weight: 600; margin-bottom: 16px; color: #333; }
    .note-content { color: #333; line-height: 1.8; margin-bottom: 24px; white-space: pre-wrap; }
    .note-tags { margin-bottom: 16px; }
    .note-meta { font-size: 14px; color: #999; border-top: 1px solid #e0e0e0; padding-top: 16px; }
    .meta-item { margin-bottom: 4px; }
  </style>
</head>
<body>
  <div class="note-detail">
    <div class="note-title">${escapeHtml(note.title || 'Untitled')}</div>
    <div class="note-content">${escapeHtml(note.content || '')}</div>
    ${tagsHtml ? `<div class="note-tags">${tagsHtml}</div>` : ''}
    <div class="note-meta">
      <div class="meta-item">Created: ${formatDate(note.createdAt || '')}</div>
      ${note.updatedAt && note.updatedAt !== note.createdAt ? `<div class="meta-item">Updated: ${formatDate(note.updatedAt)}</div>` : ''}
      ${note.id ? `<div class="meta-item">ID: ${escapeHtml(note.id)}</div>` : ''}
    </div>
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

