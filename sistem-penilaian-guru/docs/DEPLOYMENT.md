# Deployment Documentation for Sistem Penilaian Guru

## Overview
This document outlines the deployment process for the Sistem Penilaian Guru application. It includes instructions for deploying both the frontend and backend components, as well as database setup.

## Prerequisites
Before deploying the application, ensure that you have the following installed:
- Docker
- Docker Compose
- Node.js (for backend and frontend builds)

## Deployment Steps

### 1. Clone the Repository
Clone the repository to your local machine or server:
```bash
git clone <repository-url>
cd sistem-penilaian-guru
```

### 2. Set Up Environment Variables
Create a `.env` file in both the `frontend` and `backend` directories. Populate these files with the necessary environment variables. Example:
```
# Frontend .env
REACT_APP_API_URL=http://localhost:5000/api

# Backend .env
DATABASE_URL=mongodb://localhost:27017/sistem_penilaian
JWT_SECRET=your_jwt_secret
```

### 3. Build the Frontend
Navigate to the `frontend` directory and install dependencies:
```bash
cd frontend
npm install
```
Build the frontend application:
```bash
npm run build
```

### 4. Start the Backend
Navigate to the `backend` directory and install dependencies:
```bash
cd ../backend
npm install
```
Start the backend server:
```bash
node server.js
```

### 5. Run Docker Compose
In the root directory of the project, run the following command to start all services defined in `docker-compose.yml`:
```bash
docker-compose up -d
```

### 6. Database Setup
Run the database migrations and seed the database if necessary. This can typically be done using a command like:
```bash
# Example for running migrations
npm run migrate

# Example for seeding the database
npm run seed
```

### 7. Access the Application
Once everything is up and running, you can access the application at:
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:5000`

## Troubleshooting
- Ensure that all services are running by checking the Docker containers:
```bash
docker ps
```
- Check logs for any errors:
```bash
docker-compose logs
```

## Conclusion
Following these steps will help you successfully deploy the Sistem Penilaian Guru application. For further assistance, refer to the README.md or contact the development team.