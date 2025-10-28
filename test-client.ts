/**
 * Simple test client to interact with the MCP Notes Server
 * This simulates how Claude Desktop would communicate with the server
 */

import { spawn } from 'child_process';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function testMCPServer() {
  console.log('🚀 Starting MCP Notes Server Test Client\n');

  // Spawn the server process
  const serverProcess = spawn('node', ['dist/index.js'], {
    stdio: ['pipe', 'pipe', 'pipe'],
  });

  // Create client transport
  const transport = new StdioClientTransport({
    command: 'node',
    args: ['dist/index.js'],
  });

  // Create MCP client
  const client = new Client(
    {
      name: 'test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  try {
    // Connect to server
    await client.connect(transport);
    console.log('✅ Connected to MCP server\n');

    // List available tools
    console.log('📋 Available Tools:');
    const tools = await client.listTools();
    tools.tools.forEach((tool) => {
      console.log(`  - ${tool.name}: ${tool.description}`);
    });
    console.log();

    // Create a note
    console.log('📝 Creating a note...');
    const createResult = await client.callTool({
      name: 'create_note',
      arguments: {
        title: 'Test Note from Client',
        content: 'This note was created via the test client!',
        tags: ['test', 'client'],
      },
    });
    console.log('✅ Create result:', createResult.content[0].text);
    console.log();

    // List resources
    console.log('📚 Available Resources:');
    const resources = await client.listResources();
    resources.resources.forEach((resource) => {
      console.log(`  - ${resource.name}: ${resource.uri}`);
    });
    console.log();

    // Search notes
    console.log('🔍 Searching for notes with "test"...');
    const searchResult = await client.callTool({
      name: 'search_notes',
      arguments: {
        query: 'test',
      },
    });
    console.log('✅ Search result:', searchResult.content[0].text);
    console.log();

    // List tags
    console.log('🏷️  Listing all tags...');
    const tagsResult = await client.callTool({
      name: 'list_tags',
      arguments: {},
    });
    console.log('✅ Tags:', tagsResult.content[0].text);
    console.log();

    // Read a resource
    console.log('📖 Reading notes://all resource...');
    const resourceContent = await client.readResource({
      uri: 'notes://all',
    });
    console.log('✅ Resource content:');
    console.log(resourceContent.contents[0].text?.substring(0, 200) + '...');
    console.log();

    // List prompts
    console.log('💡 Available Prompts:');
    const prompts = await client.listPrompts();
    prompts.prompts.forEach((prompt) => {
      console.log(`  - ${prompt.name}: ${prompt.description}`);
    });
    console.log();

    console.log('✅ All tests completed successfully!\n');
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    // Cleanup
    await client.close();
    serverProcess.kill();
    console.log('🛑 Client disconnected\n');
  }
}

// Run the test
testMCPServer().catch(console.error);

