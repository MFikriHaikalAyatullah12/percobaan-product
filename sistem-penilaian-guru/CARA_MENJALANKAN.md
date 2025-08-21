# 🚀 Panduan Menjalankan Aplikasi Sistem Penilaian Guru

## 📋 Prerequisites

Pastikan Anda memiliki:
- ✅ **Node.js** (v16 atau lebih baru)
- ✅ **Docker** (untuk MongoDB)
- ✅ **Git** (untuk clone repository)

## 🛠️ Cara Menjalankan Aplikasi

### 🎯 **Method 1: One-Click Development Mode (RECOMMENDED)**

```bash
# 1. Masuk ke directory project
cd /workspaces/percobaan-product/sistem-penilaian-guru

# 2. Jalankan development mode
./dev.sh
```

**Script ini akan otomatis:**
- 🐳 Start MongoDB container
- 🔧 Install dependencies (jika belum ada)
- 🚀 Start backend server (port 5001)
- 💻 Start frontend server (port 3000)
- 📊 Setup sample data

### 🎯 **Method 2: Manual Step-by-Step**

#### **Step 1: Start MongoDB**
```bash
# Start MongoDB container
docker run -d --name mongodb-grading -p 27017:27017 mongo:7.0

# Verify MongoDB is running
docker ps | grep mongo
```

#### **Step 2: Start Backend**
```bash
# Masuk ke backend directory
cd /workspaces/percobaan-product/sistem-penilaian-guru/backend

# Install dependencies (jika belum)
npm install

# Start backend server
npm run dev
```

**Backend akan berjalan di:** `http://localhost:5001`

#### **Step 3: Start Frontend**
```bash
# Buka terminal baru, masuk ke frontend directory
cd /workspaces/percobaan-product/sistem-penilaian-guru/frontend

# Install dependencies (jika belum)
npm install

# Start frontend server
npm start
```

**Frontend akan berjalan di:** `http://localhost:3000`

#### **Step 4: Create Sample Data**
```bash
# Di backend directory
cd /workspaces/percobaan-product/sistem-penilaian-guru/backend

# Buat sample data (20 siswa)
node createSampleData.js
```

## 🌐 **Access URLs**

### **Frontend (User Interface)**
- 🏠 **Main App**: http://localhost:3000
- 📊 Dashboard: http://localhost:3000/dashboard  
- 👥 Data Siswa: http://localhost:3000/students
- 📈 Penilaian: http://localhost:3000/grades
- 🏫 Room Kelas: http://localhost:3000/classroom

### **Backend (API Server)**
- 🔧 **API Base**: http://localhost:5001/api
- 🏥 Health Check: http://localhost:5001/health
- 👥 Students API: http://localhost:5001/api/students/demo
- 📚 API Documentation: http://localhost:5001/api

### **Database**
- 🐳 **MongoDB**: localhost:27017
- 📂 Database: `sistem-penilaian-guru`

## ✅ **Verification Steps**

### **1. Check All Services**
```bash
# Test backend health
curl http://localhost:5001/health

# Test students API
curl http://localhost:5001/api/students/demo

# Check frontend is accessible
curl http://localhost:3000
```

### **2. Test Features**
1. **Open browser**: http://localhost:3000
2. **Login**: Otomatis login sebagai "Guru Demo"
3. **Navigate to Data Siswa**: Click menu sidebar
4. **Test clickable cards**: Click any class card (Kelas 1-6)
5. **Verify data loading**: Semua halaman harus load tanpa error

## 🛑 **Stop Services**

### **Stop Development Mode**
```bash
# Jika menggunakan ./dev.sh, tekan Ctrl+C
# Kemudian jalankan:
./stop-all.sh
```

### **Manual Stop**
```bash
# Stop frontend (Ctrl+C di terminal frontend)
# Stop backend (Ctrl+C di terminal backend)
# Stop MongoDB
docker stop mongodb-grading
docker rm mongodb-grading
```

## 🔧 **Troubleshooting**

### **Problem: Port sudah digunakan**
```bash
# Check what's using the port
lsof -i :5001  # or :3000 or :27017

# Kill process if needed
kill -9 <PID>
```

### **Problem: MongoDB connection failed**
```bash
# Restart MongoDB container
docker stop mongodb-grading
docker rm mongodb-grading
docker run -d --name mongodb-grading -p 27017:27017 mongo:7.0
```

### **Problem: No data in application**
```bash
# Recreate sample data
cd backend
node createSampleData.js
```

### **Problem: API not responding**
```bash
# Check backend is running
curl http://localhost:5001/health

# Restart backend if needed
cd backend
npm run dev
```

## 📁 **Project Structure**

```
sistem-penilaian-guru/
├── dev.sh              # 🚀 Start development mode
├── stop-all.sh         # 🛑 Stop all services  
├── backend/            # 🔧 API Server (Port 5001)
│   ├── server.js       
│   ├── package.json
│   └── src/
├── frontend/           # 💻 React App (Port 3000)
│   ├── src/
│   └── package.json
└── database/           # 📊 MongoDB scripts
```

## 🎯 **Development Workflow**

### **Daily Development**
```bash
# 1. Start development environment
./dev.sh

# 2. Code changes akan auto-reload
# - Backend: nodemon auto-restart
# - Frontend: webpack auto-reload

# 3. Stop when done
Ctrl+C (kemudian ./stop-all.sh)
```

### **First Time Setup**
```bash
# 1. Clone repository (jika belum)
git clone <repository-url>

# 2. Navigate to project
cd sistem-penilaian-guru

# 3. Run development mode
./dev.sh

# 4. Wait for "Compiled successfully!" message
# 5. Open http://localhost:3000
```

## 🎉 **Ready to Use!**

Setelah semua services berjalan:

1. **Open browser**: http://localhost:3000
2. **Explore features**:
   - Dashboard dengan statistics real-time
   - Data Siswa dengan clickable class cards  
   - Penilaian dengan filter dan search
   - Room Kelas management per kelas
3. **Test clickable functionality**: Click any class card → Navigate to classroom detail

**Happy Coding!** 🚀
