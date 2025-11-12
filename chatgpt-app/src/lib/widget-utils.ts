/**
 * Utility functions for widget HTML generation
 */

export function escapeHtml(text: string): string {
  const div = { textContent: text } as any;
  return div.textContent || text.replace(/[&<"'>]/g, (m) => {
    const map: Record<string, string> = { '&': '&amp;', '<': '&lt;', '"': '&quot;', "'": '&#39;', '>': '&gt;' };
    return map[m];
  });
}

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString();
  } catch {
    return dateString;
  }
}

export function renderTags(tags: string[]): string {
  if (!Array.isArray(tags) || tags.length === 0) return '';
  return tags.map((tag: string) => 
    `<span style="display: inline-block; background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 4px; font-size: 12px; margin-right: 4px; margin-bottom: 4px;">${escapeHtml(tag)}</span>`
  ).join('');
}

