import { NextRequest, NextResponse } from 'next/server';
import { escapeHtml, formatDate, renderTags } from '../../../lib/widget-utils';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const notesData = searchParams.get('data');
  
  if (!notesData) {
    return NextResponse.json({ error: 'Missing notes data' }, { status: 400 });
  }

  try {
    const notes = JSON.parse(decodeURIComponent(notesData));
    const notesArray = Array.isArray(notes) ? notes : [];
    
    if (notesArray.length === 0) {
      const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; padding: 40px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
    .empty-state { text-align: center; background: white; border-radius: 8px; padding: 40px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .empty-icon { font-size: 48px; margin-bottom: 16px; }
    .empty-title { font-size: 20px; font-weight: 600; color: #333; margin-bottom: 8px; }
    .empty-text { color: #666; }
  </style>
</head>
<body>
  <div class="empty-state">
    <div class="empty-icon">📭</div>
    <div class="empty-title">No notes yet</div>
    <div class="empty-text">Create your first note to get started!</div>
  </div>
</body>
</html>`;
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    const notesHtml = notesArray.map((note: any) => {
      const tags = renderTags(note.tags || []);
      return `
      <div style="background: white; border-radius: 8px; padding: 16px; margin-bottom: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
        <h3 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 600; color: #1a1a1a;">${escapeHtml(note.title || 'Untitled')}</h3>
        <p style="margin: 0 0 12px 0; color: #666; line-height: 1.5; white-space: pre-wrap; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${escapeHtml(note.content || '')}</p>
        ${tags ? `<div style="margin-bottom: 8px;">${tags}</div>` : ''}
        <div style="font-size: 12px; color: #999;">Created: ${formatDate(note.createdAt || '')}</div>
      </div>`;
    }).join('');
    
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { margin: 0; padding: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
    .notes-container { max-width: 800px; margin: 0 auto; }
    .header { background: white; border-radius: 8px; padding: 20px; margin-bottom: 16px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header h2 { margin: 0; font-size: 24px; color: #333; }
    .count { color: #666; font-size: 14px; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="notes-container">
    <div class="header">
      <h2>Your Notes</h2>
      <div class="count">${notesArray.length} note${notesArray.length !== 1 ? 's' : ''}</div>
    </div>
    ${notesHtml}
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

