#!/bin/bash

# Sistem Penilaian Guru - Start All Services
echo "🚀 Starting Sistem Penilaian Guru..."
echo "======================================"

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Start Backend
echo "🔧 Starting Backend server..."
cd /workspaces/percobaan-product/sistem-penilaian-guru/backend
npm start &
BACKEND_PID=$!
echo "⏳ Waiting for backend to start..."
sleep 5

# Start Frontend
echo "🎨 Starting Frontend server..."
cd /workspaces/percobaan-product/sistem-penilaian-guru/frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 All services are starting up!"
echo "======================================"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo ""
echo "💡 Press Ctrl+C to stop all services"
echo ""

# Keep script running
while true; do
    sleep 1
done
