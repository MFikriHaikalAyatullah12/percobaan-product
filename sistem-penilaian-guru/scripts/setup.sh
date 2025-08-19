#!/bin/bash

# This script sets up the development environment for the project.

# Update package list and install necessary packages
sudo apt update
sudo apt install -y nodejs npm docker-compose

# Install frontend dependencies
cd frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Create necessary directories for database backups
mkdir -p database/backups

echo "Setup completed successfully!"