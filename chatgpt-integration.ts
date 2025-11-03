#!/usr/bin/env node

/**
 * ChatGPT Integration using OpenAI Function Calling
 * 
 * This script allows you to interact with your notes using ChatGPT.
 * It uses OpenAI's function calling feature to connect ChatGPT with your notes API.
 * 
 * Setup:
 * 1. Get your OpenAI API key from https://platform.openai.com/api-keys
 * 2. Set the OPENAI_API_KEY environment variable:
 *    export OPENAI_API_KEY="sk-..."
 * 3. Make sure your notes server is running: npm run web
 * 4. Run this script: npx tsx chatgpt-integration.ts
 */

import OpenAI from 'openai';
import readline from 'readline';

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "sk-your-api-key-here"; // 👈 Paste your key here

if (!OPENAI_API_KEY) {
  console.error('❌ Error: OPENAI_API_KEY environment variable is not set.');
  console.error('   Get your API key from: https://platform.openai.com/api-keys');
  console.error('   Then run: export OPENAI_API_KEY="sk-..."');
  process.exit(1);
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

// Define the functions that ChatGPT can call
const functions: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'create_note',
      description: 'Create a new note with title, content, and optional tags',
      parameters: {
        type: 'object',
        properties: {
          title: {
            type: 'string',
            description: 'The title of the note',
          },
          content: {
            type: 'string',
            description: 'The content of the note (supports markdown)',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Optional tags to categorize the note',
          },
        },
        required: ['title', 'content'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_note',
      description: 'Get a specific note by ID',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the note to retrieve',
          },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_notes',
      description: 'List all notes with their metadata',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'update_note',
      description: 'Update an existing note',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the note to update',
          },
          title: {
            type: 'string',
            description: 'New title (optional)',
          },
          content: {
            type: 'string',
            description: 'New content (optional)',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'New tags (optional)',
          },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'delete_note',
      description: 'Delete a note by ID',
      parameters: {
        type: 'object',
        properties: {
          id: {
            type: 'string',
            description: 'The ID of the note to delete',
          },
        },
        required: ['id'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'search_notes',
      description: 'Search notes by query text and/or tags',
      parameters: {
        type: 'object',
        properties: {
          query: {
            type: 'string',
            description: 'Search query to match in title or content',
          },
          tags: {
            type: 'array',
            items: { type: 'string' },
            description: 'Filter by tags (optional)',
          },
        },
        required: ['query'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'list_tags',
      description: 'Get all unique tags used across all notes',
      parameters: {
        type: 'object',
        properties: {},
      },
    },
  },
];

// Function implementations that call your API
async function executeFunction(name: string, args: any): Promise<string> {
  try {
    switch (name) {
      case 'create_note': {
        const response = await fetch(`${API_BASE_URL}/api/notes`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(args),
        });
        const data = await response.json();
        return JSON.stringify(data, null, 2);
      }

      case 'get_note': {
        const response = await fetch(`${API_BASE_URL}/api/notes/${args.id}`);
        const data = await response.json();
        return JSON.stringify(data, null, 2);
      }

      case 'list_notes': {
        const response = await fetch(`${API_BASE_URL}/api/notes`);
        const data = await response.json();
        return JSON.stringify(data, null, 2);
      }

      case 'update_note': {
        const { id, ...updateData } = args;
        const response = await fetch(`${API_BASE_URL}/api/notes/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updateData),
        });
        const data = await response.json();
        return JSON.stringify(data, null, 2);
      }

      case 'delete_note': {
        const response = await fetch(`${API_BASE_URL}/api/notes/${args.id}`, {
          method: 'DELETE',
        });
        const data = await response.json();
        return JSON.stringify(data, null, 2);
      }

      case 'search_notes': {
        const response = await fetch(`${API_BASE_URL}/api/notes/search`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(args),
        });
        const data = await response.json();
        return JSON.stringify(data, null, 2);
      }

      case 'list_tags': {
        const response = await fetch(`${API_BASE_URL}/api/tags`);
        const data = await response.json();
        return JSON.stringify(data, null, 2);
      }

      default:
        return JSON.stringify({ error: `Unknown function: ${name}` });
    }
  } catch (error) {
    return JSON.stringify({ 
      error: error instanceof Error ? error.message : String(error) 
    });
  }
}

// Main chat loop
async function chat() {
  console.log('🤖 ChatGPT Notes Assistant');
  console.log('📝 Connected to your notes at:', API_BASE_URL);
  console.log('💬 Type your requests and press Enter. Type "exit" to quit.\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    {
      role: 'system',
      content: 'You are a helpful assistant that manages notes. You have access to functions to create, read, update, delete, and search notes. Always be helpful and concise.',
    },
  ];

  const askQuestion = () => {
    rl.question('\n👤 You: ', async (userInput) => {
      if (userInput.toLowerCase() === 'exit') {
        console.log('\n👋 Goodbye!');
        rl.close();
        process.exit(0);
      }

      if (!userInput.trim()) {
        askQuestion();
        return;
      }

      messages.push({
        role: 'user',
        content: userInput,
      });

      try {
        // Call ChatGPT
        let response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: messages,
          tools: functions,
          tool_choice: 'auto',
        });

        let responseMessage = response.choices[0].message;

        // Handle function calls
        while (responseMessage.tool_calls && responseMessage.tool_calls.length > 0) {
          messages.push(responseMessage);

          // Execute all function calls
          for (const toolCall of responseMessage.tool_calls) {
            const functionName = toolCall.function.name;
            const functionArgs = JSON.parse(toolCall.function.arguments);

            console.log(`\n🔧 Calling function: ${functionName}`);
            console.log(`   Arguments:`, functionArgs);

            const functionResponse = await executeFunction(functionName, functionArgs);

            messages.push({
              role: 'tool',
              tool_call_id: toolCall.id,
              content: functionResponse,
            });
          }

          // Get the next response from ChatGPT
          response = await openai.chat.completions.create({
            model: 'gpt-4o',
            messages: messages,
            tools: functions,
            tool_choice: 'auto',
          });

          responseMessage = response.choices[0].message;
        }

        messages.push(responseMessage);
        console.log(`\n🤖 Assistant: ${responseMessage.content}`);
      } catch (error) {
        console.error('\n❌ Error:', error instanceof Error ? error.message : String(error));
      }

      askQuestion();
    });
  };

  askQuestion();
}

// Check if the API is available
async function checkAPI() {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats`);
    if (!response.ok) {
      throw new Error(`API returned status ${response.status}`);
    }
    console.log('✅ Connected to notes API successfully\n');
    return true;
  } catch (error) {
    console.error('❌ Error: Cannot connect to notes API at', API_BASE_URL);
    console.error('   Make sure your server is running: npm run web');
    console.error('   Error details:', error instanceof Error ? error.message : String(error));
    return false;
  }
}

// Start the chat
(async () => {
  if (await checkAPI()) {
    await chat();
  } else {
    process.exit(1);
  }
})();


