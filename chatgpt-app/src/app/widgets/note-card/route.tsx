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
    .note-card { background: white; border-radius: 8px; padding: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); max-width: 600px; }
    .note-title { font-size: 20px; font-weight: 600; margin-bottom: 12px; color: #333; }
    .note-content { color: #666; line-height: 1.6; margin-bottom: 16px; white-space: pre-wrap; }
    .note-tags { margin-bottom: 12px; }
    .note-meta { font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="note-card">
    <div class="note-title">${escapeHtml(note.title || 'Untitled')}</div>
    <div class="note-content">${escapeHtml(note.content || '')}</div>
    ${tagsHtml ? `<div class="note-tags">${tagsHtml}</div>` : ''}
    <div class="note-meta">Created: ${formatDate(note.createdAt)}</div>
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

