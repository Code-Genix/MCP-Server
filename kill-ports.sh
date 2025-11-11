#!/bin/bash

# Kill all ports script for Notes ChatGPT App

echo "🔪 Killing all processes on common ports..."
echo ""

# Function to kill a port
kill_port() {
  PORT=$1
  PID=$(lsof -ti:$PORT 2>/dev/null)
  
  if [ -n "$PID" ]; then
    kill -9 $PID 2>/dev/null
    echo "✓ Killed process on port $PORT (PID: $PID)"
  else
    echo "✓ Port $PORT is already free"
  fi
}

# Kill common ports
kill_port 3000
kill_port 3001
kill_port 3002
kill_port 4040

# Kill ngrok
if pkill -9 ngrok 2>/dev/null; then
  echo "✓ Killed ngrok processes"
else
  echo "✓ No ngrok processes running"
fi

# Kill any node processes with 'app-server' or 'web-server' in name
echo ""
echo "Checking for lingering node processes..."
ps aux | grep -E "app-server|web-server|next dev" | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null && echo "✓ Killed node processes" || echo "✓ No node processes found"

echo ""
echo "✅ All ports cleaned up!"
echo ""
echo "Now you can start fresh:"
echo "  Terminal 1: cd nextjs-app && npm run dev"
echo "  Terminal 2: npm run web"
echo "  Terminal 3: ngrok http 3001"


