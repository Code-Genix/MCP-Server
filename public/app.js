// API Base URL
const API_BASE = '/api';

// State
let currentNote = null;
let editingNoteId = null;
let allNotes = [];
let allTags = [];
let selectedTags = new Set();

// DOM Elements
const welcomeScreen = document.getElementById('welcomeScreen');
const notesList = document.getElementById('notesList');
const noteDetail = document.getElementById('noteDetail');
const noteEditor = document.getElementById('noteEditor');
const searchInput = document.getElementById('searchInput');
const tagsFilter = document.getElementById('tagsFilter');
const totalNotesEl = document.getElementById('totalNotes');
const totalTagsEl = document.getElementById('totalTags');
const toast = document.getElementById('toast');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  loadStats();
  loadNotes();
  loadTags();
  setupEventListeners();
});

// Event Listeners
function setupEventListeners() {
  // Create note buttons
  document.getElementById('createNoteBtn').addEventListener('click', () => showEditor(false));
  document.getElementById('createFirstNote').addEventListener('click', () => showEditor(false));
  
  // Editor actions
  document.getElementById('saveNoteBtn').addEventListener('click', saveNote);
  document.getElementById('cancelEditBtn').addEventListener('click', showNotesList);
  
  // Note detail actions
  document.getElementById('backToList').addEventListener('click', showNotesList);
  document.getElementById('editNoteBtn').addEventListener('click', editCurrentNote);
  document.getElementById('deleteNoteBtn').addEventListener('click', deleteCurrentNote);
  
  // Search
  searchInput.addEventListener('input', debounce(handleSearch, 300));
}

// API Calls
async function apiCall(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Request failed');
    }
    
    return data.data;
  } catch (error) {
    showToast(error.message, 'error');
    throw error;
  }
}

async function loadStats() {
  try {
    const stats = await apiCall('/stats');
    totalNotesEl.textContent = stats.totalNotes;
    totalTagsEl.textContent = stats.totalTags;
  } catch (error) {
    console.error('Failed to load stats:', error);
  }
}

async function loadNotes() {
  try {
    allNotes = await apiCall('/notes');
    displayNotes(allNotes);
    loadStats();
  } catch (error) {
    console.error('Failed to load notes:', error);
  }
}

async function loadTags() {
  try {
    allTags = await apiCall('/tags');
    displayTags(allTags);
  } catch (error) {
    console.error('Failed to load tags:', error);
  }
}

async function getNote(id) {
  try {
    return await apiCall(`/notes/${id}`);
  } catch (error) {
    console.error('Failed to get note:', error);
  }
}

async function createNote(noteData) {
  try {
    const note = await apiCall('/notes', {
      method: 'POST',
      body: JSON.stringify(noteData),
    });
    showToast('Note created successfully!', 'success');
    return note;
  } catch (error) {
    console.error('Failed to create note:', error);
    throw error;
  }
}

async function updateNote(id, noteData) {
  try {
    const note = await apiCall(`/notes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(noteData),
    });
    showToast('Note updated successfully!', 'success');
    return note;
  } catch (error) {
    console.error('Failed to update note:', error);
    throw error;
  }
}

async function deleteNote(id) {
  try {
    await apiCall(`/notes/${id}`, {
      method: 'DELETE',
    });
    showToast('Note deleted successfully!', 'success');
  } catch (error) {
    console.error('Failed to delete note:', error);
    throw error;
  }
}

async function searchNotes(query) {
  try {
    const tags = Array.from(selectedTags);
    return await apiCall('/notes/search', {
      method: 'POST',
      body: JSON.stringify({ query, tags: tags.length > 0 ? tags : undefined }),
    });
  } catch (error) {
    console.error('Failed to search notes:', error);
    return [];
  }
}

// Display Functions
function displayNotes(notes) {
  if (notes.length === 0) {
    welcomeScreen.style.display = 'flex';
    notesList.style.display = 'none';
    return;
  }
  
  welcomeScreen.style.display = 'none';
  notesList.style.display = 'grid';
  
  notesList.innerHTML = notes.map(note => `
    <div class="note-card" onclick="viewNote('${note.id}')">
      <h3 class="note-card-title">${escapeHtml(note.title)}</h3>
      <div class="note-card-meta">
        <span>${formatDate(note.updatedAt)}</span>
      </div>
      <div class="note-card-tags">
        ${note.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
      </div>
    </div>
  `).join('');
}

function displayTags(tags) {
  if (tags.length === 0) {
    tagsFilter.innerHTML = '<p style="color: var(--text-secondary); font-size: 0.85rem;">No tags yet</p>';
    return;
  }
  
  tagsFilter.innerHTML = tags.map(tag => `
    <span 
      class="tag-filter-item ${selectedTags.has(tag) ? 'active' : ''}" 
      onclick="toggleTag('${escapeHtml(tag)}')"
    >
      ${escapeHtml(tag)}
    </span>
  `).join('');
}

async function viewNote(id) {
  try {
    currentNote = await getNote(id);
    
    document.getElementById('noteTitle').textContent = currentNote.title;
    document.getElementById('noteDate').textContent = `Updated: ${formatDate(currentNote.updatedAt)}`;
    document.getElementById('noteTags').innerHTML = currentNote.tags
      .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
      .join('');
    
    // Render markdown
    document.getElementById('noteContent').innerHTML = marked.parse(currentNote.content);
    
    showView('detail');
  } catch (error) {
    console.error('Failed to view note:', error);
  }
}

function showEditor(isEdit = false) {
  if (isEdit && currentNote) {
    // Edit mode - populate with current note data
    document.getElementById('editorTitle').textContent = 'Edit Note';
    document.getElementById('noteTitleInput').value = currentNote.title;
    document.getElementById('noteContentInput').value = currentNote.content;
    document.getElementById('noteTagsInput').value = currentNote.tags.join(', ');
    editingNoteId = currentNote.id;
  } else {
    // Create mode - clear form
    document.getElementById('editorTitle').textContent = 'Create Note';
    document.getElementById('noteTitleInput').value = '';
    document.getElementById('noteContentInput').value = '';
    document.getElementById('noteTagsInput').value = '';
    editingNoteId = null;
    currentNote = null; // Clear current note state
  }
  
  showView('editor');
  
  // Focus on title input for better UX
  setTimeout(() => {
    document.getElementById('noteTitleInput').focus();
  }, 100);
}

async function saveNote() {
  const title = document.getElementById('noteTitleInput').value.trim();
  const content = document.getElementById('noteContentInput').value.trim();
  const tagsInput = document.getElementById('noteTagsInput').value.trim();
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()).filter(t => t) : [];
  
  if (!title) {
    showToast('Please enter a title', 'error');
    return;
  }
  
  try {
    if (editingNoteId) {
      await updateNote(editingNoteId, { title, content, tags });
    } else {
      await createNote({ title, content, tags });
    }
    
    await loadNotes();
    await loadTags();
    showNotesList();
  } catch (error) {
    // Error already shown in apiCall
  }
}

function editCurrentNote() {
  showEditor(true);
}

async function deleteCurrentNote() {
  if (!currentNote) return;
  
  if (!confirm(`Are you sure you want to delete "${currentNote.title}"?`)) {
    return;
  }
  
  try {
    await deleteNote(currentNote.id);
    await loadNotes();
    await loadTags();
    showNotesList();
  } catch (error) {
    // Error already shown in apiCall
  }
}

function showNotesList() {
  showView('list');
  loadNotes();
}

function showView(view) {
  welcomeScreen.style.display = 'none';
  notesList.style.display = 'none';
  noteDetail.style.display = 'none';
  noteEditor.style.display = 'none';
  
  switch(view) {
    case 'list':
      // Will be set by displayNotes
      loadNotes();
      break;
    case 'detail':
      noteDetail.style.display = 'block';
      break;
    case 'editor':
      noteEditor.style.display = 'block';
      break;
  }
}

async function handleSearch(e) {
  const query = e.target.value.trim();
  
  if (!query && selectedTags.size === 0) {
    displayNotes(allNotes);
    return;
  }
  
  if (!query) {
    // Filter by tags only
    const filtered = allNotes.filter(note => 
      Array.from(selectedTags).every(tag => note.tags.includes(tag))
    );
    displayNotes(filtered);
    return;
  }
  
  const results = await searchNotes(query);
  displayNotes(results);
}

function toggleTag(tag) {
  if (selectedTags.has(tag)) {
    selectedTags.delete(tag);
  } else {
    selectedTags.add(tag);
  }
  
  displayTags(allTags);
  handleSearch({ target: searchInput });
}

// Utility Functions
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  
  return date.toLocaleDateString();
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

function showToast(message, type = 'success') {
  toast.textContent = message;
  toast.className = `toast show ${type}`;
  
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

