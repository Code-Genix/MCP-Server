export default function Home() {
  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>📝 Notes ChatGPT App</h1>
      <p>MCP Server running. Connect from ChatGPT!</p>
      <div style={{ background: '#f0f0f0', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <strong>URL to use in ChatGPT:</strong>
        <code style={{ display: 'block', marginTop: '10px', padding: '10px', background: 'white' }}>
          https://YOUR-NGROK-URL/api/mcp
        </code>
      </div>
    </div>
  );
}


