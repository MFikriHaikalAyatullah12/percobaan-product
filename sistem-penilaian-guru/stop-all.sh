#!/bin/bash

# Sistem Penilaian Guru - Stop All Services
echo "🛑 Stopping Sistem Penilaian Guru..."
echo "======================================"

# Stop Frontend (React)
echo "🎨 Stopping Frontend..."
pkill -f "react-scripts start" 2>/dev/null
pkill -f "npm start" 2>/dev/null

# Stop Backend (Node.js)
echo "🔧 Stopping Backend..."
pkill -f "node server.js" 2>/dev/null
pkill -f "nodemon server.js" 2>/dev/null

# Stop MongoDB container
echo "📁 Stopping MongoDB..."
docker stop mongodb-grading 2>/dev/null
docker rm mongodb-grading 2>/dev/null

echo ""
echo "✅ All services stopped successfully!"
echo "======================================"
