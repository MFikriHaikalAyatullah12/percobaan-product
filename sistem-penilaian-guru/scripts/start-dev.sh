#!/bin/bash

# Start the development server for the frontend and backend

# Navigate to the frontend directory and start the frontend server
cd frontend
npm install
npm start &

# Navigate to the backend directory and start the backend server
cd ../backend
npm install
node server.js &

# Wait for both servers to start
wait

echo "Development servers are running."