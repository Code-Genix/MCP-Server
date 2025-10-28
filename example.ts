/**
 * Example usage of the NotesStorage API
 * This demonstrates how to use the storage layer directly
 */

import { NotesStorage } from './src/storage/NotesStorage.js';

async function main() {
  // Initialize storage
  const storage = new NotesStorage('./example-notes');
  await storage.initialize();

  console.log('📝 Notes Storage Example\n');

  // Create some notes
  console.log('Creating notes...');
  const note1 = await storage.createNote({
    title: 'My First Note',
    content: '# Hello World\n\nThis is my first note using the MCP Notes Server!',
    tags: ['example', 'tutorial'],
  });
  console.log(`✓ Created: ${note1.title} (ID: ${note1.id})`);

  const note2 = await storage.createNote({
    title: 'JavaScript Tips',
    content: '## Array Methods\n\n- map()\n- filter()\n- reduce()',
    tags: ['javascript', 'programming'],
  });
  console.log(`✓ Created: ${note2.title} (ID: ${note2.id})`);

  const note3 = await storage.createNote({
    title: 'Meeting Notes',
    content: '## Attendees\n- Alice\n- Bob\n\n## Discussion\n- Project timeline\n- Budget review',
    tags: ['meeting', 'work'],
  });
  console.log(`✓ Created: ${note3.title} (ID: ${note3.id})`);

  // List all notes
  console.log('\n📋 Listing all notes:');
  const allNotes = await storage.listNotes();
  allNotes.forEach(note => {
    console.log(`  - ${note.title} [${note.tags.join(', ')}]`);
  });

  // Search notes
  console.log('\n🔍 Searching for "JavaScript":');
  const searchResults = await storage.searchNotes('JavaScript');
  searchResults.forEach(note => {
    console.log(`  - ${note.title}`);
  });

  // Get notes by tag
  console.log('\n🏷️  Notes with tag "programming":');
  const tagResults = await storage.searchNotes('', ['programming']);
  tagResults.forEach(note => {
    console.log(`  - ${note.title}`);
  });

  // Update a note
  console.log('\n✏️  Updating note...');
  const updated = await storage.updateNote({
    id: note1.id,
    content: '# Hello World\n\nThis is my updated first note!\n\nNow with more content!',
    tags: ['example', 'tutorial', 'updated'],
  });
  console.log(`✓ Updated: ${updated?.title}`);

  // Get all tags
  console.log('\n🏷️  All tags in use:');
  const tags = await storage.getAllTags();
  console.log(`  ${tags.join(', ')}`);

  // Delete a note
  console.log('\n🗑️  Deleting a note...');
  const deleted = await storage.deleteNote(note3.id);
  console.log(`✓ Deleted: ${deleted ? 'Success' : 'Failed'}`);

  // Final count
  const finalNotes = await storage.listNotes();
  console.log(`\n✅ Final count: ${finalNotes.length} notes\n`);
}

main().catch(console.error);

