#!/usr/bin/env bash
# Render the site locally: starts a server and opens it in your browser.
# Usage: ./serve.sh [port]   (default port: 8000)

set -euo pipefail
cd "$(dirname "$0")"

PORT="${1:-8000}"

./build.sh

# Kill anything already listening on the port so re-runs just work
if lsof -ti tcp:"$PORT" >/dev/null 2>&1; then
  echo "Port $PORT is in use — stopping the existing process."
  lsof -ti tcp:"$PORT" | xargs kill
  sleep 1
fi

echo "Serving http://localhost:$PORT (Ctrl+C to stop)"
python3 -m http.server "$PORT" &
SERVER_PID=$!

# Stop the server when the script exits
trap 'kill "$SERVER_PID" 2>/dev/null' EXIT

sleep 1
open "http://localhost:$PORT"

wait "$SERVER_PID"
