#!/bin/bash

# Sistem Penilaian Guru - S# Start Frontend
echo "🎨 Starting Frontend server..."
cd /workspaces/percobaan-product/sistem-penilaian-guru/frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 All services are starting up!"
echo "======================================"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo "📁 Database: mongodb://localhost:27017"
echo ""
echo "💡 Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    docker stop mongodb-grading 2>/dev/null
    echo "✅ All services stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
while true; do
    sleep 1
donell Services
echo "🚀 Starting Sistem Penilaian Guru..."
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start MongoDB container if not running
if ! docker ps | grep -q mongodb-grading; then
    echo "� Starting MongoDB database..."
    docker run -d \
        --name mongodb-grading \
        --rm \
        -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=password \
        mongo:latest
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 5
else
    echo "✅ MongoDB is already running"
fi

# Start Backend if not running
if ! pgrep -f "node server.js" > /dev/null; then
    echo "🔧 Starting Backend server..."
    cd /workspaces/percobaan-product/sistem-penilaian-guru/backend
    npm run dev &
    BACKEND_PID=$!
    echo "⏳ Waiting for backend to be ready..."
    sleep 10
else
    echo "✅ Backend is already running"
fi

# Start Frontend
echo "� Starting Frontend server..."
cd /workspaces/percobaan-product/sistem-penilaian-guru/frontend
npm start

echo "✅ Sistem siap digunakan di http://localhost:3000"
