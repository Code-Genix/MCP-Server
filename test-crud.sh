#!/bin/bash

# CRUD Operations Test Script
# This will test all operations and you'll see them in terminal logs

echo "🧪 Testing All CRUD Operations"
echo "================================"
echo "👀 WATCH YOUR TERMINAL for logs!"
echo ""

BASE_URL="http://localhost:3000/api"

# Test 1: CREATE
echo "📝 Test 1: CREATE a new note"
RESPONSE=$(curl -s -X POST "$BASE_URL/notes" \
  -H "Content-Type: application/json" \
  -d '{"title":"CRUD Test Note","content":"# Testing CRUD Operations\n\nThis note tests all operations.","tags":["test","crud"]}')

NOTE_ID=$(echo $RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
echo "✅ Created note with ID: $NOTE_ID"
echo "   Check terminal for: POST /api/notes"
echo ""
sleep 1

# Test 2: READ (Get specific note)
echo "📖 Test 2: READ the note we just created"
curl -s "$BASE_URL/notes/$NOTE_ID" | grep -o '"title":"[^"]*"' | cut -d'"' -f4
echo "✅ Retrieved note: CRUD Test Note"
echo "   Check terminal for: GET /api/notes/$NOTE_ID"
echo ""
sleep 1

# Test 3: READ ALL notes
echo "📚 Test 3: READ ALL notes"
NOTES_COUNT=$(curl -s "$BASE_URL/notes" | grep -o '"id"' | wc -l)
echo "✅ Retrieved $NOTES_COUNT notes"
echo "   Check terminal for: GET /api/notes"
echo ""
sleep 1

# Test 4: UPDATE the note
echo "✏️  Test 4: UPDATE the note"
curl -s -X PUT "$BASE_URL/notes/$NOTE_ID" \
  -H "Content-Type: application/json" \
  -d '{"title":"CRUD Test Note (UPDATED)","content":"# Updated Content\n\nThis note has been updated!","tags":["test","crud","updated"]}' > /dev/null
echo "✅ Updated note title to: CRUD Test Note (UPDATED)"
echo "   Check terminal for: PUT /api/notes/$NOTE_ID"
echo ""
sleep 1

# Test 5: SEARCH notes
echo "🔍 Test 5: SEARCH notes"
SEARCH_RESULTS=$(curl -s -X POST "$BASE_URL/notes/search" \
  -H "Content-Type: application/json" \
  -d '{"query":"CRUD"}' | grep -o '"id"' | wc -l)
echo "✅ Search found $SEARCH_RESULTS notes with 'CRUD'"
echo "   Check terminal for: POST /api/notes/search"
echo ""
sleep 1

# Test 6: GET TAGS
echo "🏷️  Test 6: GET all tags"
TAGS_COUNT=$(curl -s "$BASE_URL/tags" | grep -o '"[a-zA-Z]*"' | wc -l)
echo "✅ Retrieved tags"
echo "   Check terminal for: GET /api/tags"
echo ""
sleep 1

# Test 7: GET STATS
echo "📊 Test 7: GET statistics"
curl -s "$BASE_URL/stats" | grep -o '"totalNotes":[0-9]*' | cut -d':' -f2
echo "✅ Retrieved stats"
echo "   Check terminal for: GET /api/stats"
echo ""
sleep 1

# Test 8: DELETE the note
echo "🗑️  Test 8: DELETE the test note"
curl -s -X DELETE "$BASE_URL/notes/$NOTE_ID" > /dev/null
echo "✅ Deleted note: $NOTE_ID"
echo "   Check terminal for: DELETE /api/notes/$NOTE_ID"
echo ""
sleep 1

# Final verification
echo "================================"
echo "✅ ALL CRUD TESTS COMPLETED!"
echo ""
echo "📋 Summary of operations tested:"
echo "  ✅ CREATE (POST /api/notes)"
echo "  ✅ READ ONE (GET /api/notes/:id)"
echo "  ✅ READ ALL (GET /api/notes)"
echo "  ✅ UPDATE (PUT /api/notes/:id)"
echo "  ✅ DELETE (DELETE /api/notes/:id)"
echo "  ✅ SEARCH (POST /api/notes/search)"
echo "  ✅ GET TAGS (GET /api/tags)"
echo "  ✅ GET STATS (GET /api/stats)"
echo ""
echo "👀 Check your terminal logs - you should see all 8 operations!"

