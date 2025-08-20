#!/bin/bash

# Sistem Penilaian Guru - Production Mode
echo "🏭 Starting Production Mode..."
echo "======================================"

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
        --restart unless-stopped \
        -p 27017:27017 \
        mongo:latest
    echo "⏳ Waiting for MongoDB to be ready..."
    sleep 5
else
    echo "✅ MongoDB is already running"
fi

# Build Frontend for production
echo "🏗️ Building Frontend for production..."
cd /workspaces/percobaan-product/sistem-penilaian-guru/frontend
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Frontend build failed"
    exit 1
fi

# Start Backend in production mode
echo "🔧 Starting Backend in production mode..."
cd /workspaces/percobaan-product/sistem-penilaian-guru/backend
NODE_ENV=production npm start &
BACKEND_PID=$!

# Serve Frontend build with a simple HTTP server
echo "🎨 Serving Frontend production build..."
cd /workspaces/percobaan-product/sistem-penilaian-guru/frontend
npx serve -s build -l 3000 &
FRONTEND_PID=$!

echo ""
echo "🎉 Production environment is running!"
echo "======================================"
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:5000"
echo "📁 Database: mongodb://localhost:27017"
echo ""
echo "🏭 Production features:"
echo "   • Optimized build"
echo "   • Minified assets"
echo "   • Production error handling"
echo ""
echo "💡 Press Ctrl+C to stop all services"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping production environment..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    docker stop mongodb-grading 2>/dev/null
    echo "✅ Production environment stopped"
    exit 0
}

# Set trap to cleanup on script exit
trap cleanup SIGINT SIGTERM

# Keep script running
while true; do
    sleep 1
done
