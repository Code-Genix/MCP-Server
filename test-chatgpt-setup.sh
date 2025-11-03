#!/bin/bash

# Test ChatGPT Integration Setup
# This script verifies that everything is configured correctly

echo "🔍 Testing ChatGPT Integration Setup..."
echo ""

# Check if OpenAI API key is set
echo "1️⃣  Checking OpenAI API Key..."
if [ -z "$OPENAI_API_KEY" ]; then
    echo "   ❌ OPENAI_API_KEY is not set"
    echo "   💡 Run: export OPENAI_API_KEY=\"sk-your-key-here\""
    echo ""
    EXIT_CODE=1
else
    echo "   ✅ OPENAI_API_KEY is set"
    echo ""
fi

# Check if notes server is running
echo "2️⃣  Checking Notes Server..."
if curl -s http://localhost:3000/api/stats > /dev/null 2>&1; then
    echo "   ✅ Notes server is running on http://localhost:3000"
    echo ""
else
    echo "   ❌ Notes server is not running"
    echo "   💡 Run: npm run web"
    echo ""
    EXIT_CODE=1
fi

# Check if openai package is installed
echo "3️⃣  Checking OpenAI Package..."
if [ -d "node_modules/openai" ]; then
    echo "   ✅ OpenAI package is installed"
    echo ""
else
    echo "   ❌ OpenAI package is not installed"
    echo "   💡 Run: npm install openai"
    echo ""
    EXIT_CODE=1
fi

# Check if integration file exists
echo "4️⃣  Checking Integration File..."
if [ -f "chatgpt-integration.ts" ]; then
    echo "   ✅ chatgpt-integration.ts exists"
    echo ""
else
    echo "   ❌ chatgpt-integration.ts not found"
    echo ""
    EXIT_CODE=1
fi

# Summary
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ "$EXIT_CODE" = "1" ]; then
    echo "❌ Setup incomplete. Please fix the issues above."
    echo ""
    echo "📖 Quick Start Guide: QUICKSTART-CHATGPT.md"
    exit 1
else
    echo "✅ Everything is ready!"
    echo ""
    echo "🚀 To start ChatGPT integration, run:"
    echo "   npm run chatgpt"
    echo ""
    echo "📖 For help, see: QUICKSTART-CHATGPT.md"
    exit 0
fi


