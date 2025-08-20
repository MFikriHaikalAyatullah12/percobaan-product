#!/bin/bash

# Sistem Penilaian Guru - Development Mode
echo "🔥 Starting Development Mode..."
echo "======================================"
echo "📝 This will start all services with auto-reload"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start MongoDB container if not running
if ! docker ps | grep -q mongodb-grading; then
    echo "📁 Starting MongoDB database..."
    docker run -d \
        --name mongodb-grading \
        --rm \
        -p 27017:27017 \
        mongo:latest
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 5
else
    echo "✅ MongoDB is already running"
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
cd /workspaces/percobaan-product/sistem-penilaian-guru/backend
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
fi

cd /workspaces/percobaan-product/sistem-penilaian-guru/frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

echo ""
echo "🚀 Starting development servers..."
echo "======================================"

# Start Backend with nodemon (auto-reload)
echo "🔧 Starting Backend with auto-reload..."
cd /workspaces/percobaan-product/sistem-penilaian-guru/backend
npm run dev &
BACKEND_PID=$!

# Wait for backend
echo "⏳ Waiting for backend to initialize..."
sleep 8

# Start Frontend with auto-reload
echo "🎨 Starting Frontend with auto-reload..."
cd /workspaces/percobaan-product/sistem-penilaian-guru/frontend
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 Development environment is ready!"
echo "======================================"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo "📁 Database: mongodb://localhost:27017"
echo ""
echo "🔥 Features:"
echo "   • Auto-reload on file changes"
echo "   • Hot module replacement"
echo "   • Development error overlay"
echo ""
echo "💡 Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping development environment..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    docker stop mongodb-grading 2>/dev/null
    echo "✅ Development environment stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running and show logs
while true; do
    sleep 1
done
