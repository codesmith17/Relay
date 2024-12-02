#!/bin/bash

while true; do
  # Start the Go application in the background
  go run main.go &
  PID=$!  # Capture the process ID of the Go application

  # Wait for file changes using fswatch (needs to be installed, e.g., via Homebrew)
  fswatch -o . | head -n 1
  
  # Stop the running Go process
  kill $PID
  wait $PID 2>/dev/null  # Ensure the process is terminated
  
  # Forcefully free the port if still in use (use lsof to check for the port)
  lsof -ti :8080 | xargs -r kill -9  # Replace 8080 with your application's port

  # Optional: Add a short delay to allow the OS to release the port
  sleep 1
done
