# Sistem Penilaian Guru - Backend API

Sistem backend untuk aplikasi penilaian guru yang memungkinkan guru mengelola data siswa dan nilai secara efisien.

## 🎯 Fitur Utama

### Autentikasi & Manajemen Akun
- ✅ Registrasi dan login guru
- ✅ JWT-based authentication
- ✅ Profile management
- ✅ Change password
- ✅ Secure logout

### Manajemen Data Siswa
- ✅ CRUD operations untuk data siswa
- ✅ Search dan filter siswa
- ✅ Pagination
- ✅ Student statistics
- ✅ Grouping by class
- ✅ Soft delete

### Manajemen Nilai
- ✅ Input nilai per siswa
- ✅ Multiple grade types (quiz, assignment, midterm, final, etc.)
- ✅ Grade statistics dan analytics
- ✅ Bulk grade operations
- ✅ Grade history tracking
- ✅ Performance analysis

### Dashboard & Analytics
- ✅ Teacher dashboard overview
- ✅ Grade trends analysis
- ✅ Class performance comparison
- ✅ Student progress tracking
- ✅ Visual data representation

### Manajemen Mata Pelajaran
- ✅ CRUD operations untuk subjects
- ✅ Subject-teacher assignments
- ✅ Subject categorization

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Express-validator
- **Security**: Bcrypt, CORS, Helmet
- **Environment**: dotenv

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sistem-penilaian-guru/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env file with your configuration
   ```

4. **Start MongoDB**
   ```bash
   # For local MongoDB
   mongod
   
   # Or use Docker
   docker run -d -p 27017:27017 --name mongodb mongo
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Verify installation**
   ```bash
   curl http://localhost:5000/health
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register Teacher
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "teacher123",
  "email": "teacher@school.com",
  "password": "SecurePass123",
  "fullName": "John Doe Teacher",
  "subjects": ["Mathematics", "Physics"]
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "teacher123",
  "password": "SecurePass123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt-token>
```

### Student Management Endpoints

#### Get All Students
```http
GET /api/students?page=1&limit=10&search=john&class=10A&academicYear=2024/2025
Authorization: Bearer <jwt-token>
```

#### Create Student
```http
POST /api/students
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "nis": "123456789",
  "fullName": "John Doe Student",
  "email": "john@school.com",
  "phoneNumber": "+6281234567890",
  "dateOfBirth": "2005-01-15",
  "gender": "male",
  "address": "Jl. Pendidikan No. 123",
  "class": "10A",
  "academicYear": "2024/2025"
}
```

#### Update Student
```http
PUT /api/students/:id
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "fullName": "John Doe Updated",
  "class": "10B"
}
```

#### Delete Student
```http
DELETE /api/students/:id
Authorization: Bearer <jwt-token>
```

### Grade Management Endpoints

#### Get All Grades
```http
GET /api/grades?subject=Mathematics&class=10A&semester=1&academicYear=2024/2025
Authorization: Bearer <jwt-token>
```

#### Create Grade
```http
POST /api/grades
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "studentId": "60f7b3b3b3b3b3b3b3b3b3b3",
  "subject": "Mathematics",
  "gradeType": "quiz",
  "score": 85,
  "maxScore": 100,
  "weight": 1,
  "semester": "1",
  "academicYear": "2024/2025",
  "description": "Quiz on Algebra"
}
```

#### Bulk Create Grades
```http
POST /api/grades/bulk
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "grades": [
    {
      "studentId": "60f7b3b3b3b3b3b3b3b3b3b3",
      "subject": "Mathematics",
      "gradeType": "quiz",
      "score": 85,
      "semester": "1"
    },
    {
      "studentId": "60f7b3b3b3b3b3b3b3b3b3b4",
      "subject": "Mathematics",
      "gradeType": "quiz",
      "score": 92,
      "semester": "1"
    }
  ]
}
```

### Dashboard Endpoints

#### Get Dashboard Overview
```http
GET /api/dashboard/overview?academicYear=2024/2025&semester=1
Authorization: Bearer <jwt-token>
```

#### Get Grade Trends
```http
GET /api/dashboard/trends?academicYear=2024/2025
Authorization: Bearer <jwt-token>
```

#### Get Class Comparison
```http
GET /api/dashboard/classes?academicYear=2024/2025&semester=1
Authorization: Bearer <jwt-token>
```

### Subject Management Endpoints

#### Get All Subjects
```http
GET /api/subjects?search=math&category=core
Authorization: Bearer <jwt-token>
```

#### Create Subject
```http
POST /api/subjects
Authorization: Bearer <jwt-token>
Content-Type: application/json

{
  "name": "Advanced Mathematics",
  "code": "MATH101",
  "description": "Advanced mathematical concepts",
  "credits": 3,
  "category": "core"
}
```

## 🔒 Authentication & Authorization

Sistem menggunakan JWT untuk authentication. Setiap request ke protected endpoint harus menyertakan token dalam header:

```http
Authorization: Bearer <your-jwt-token>
```

### Role-Based Access Control
- **Teacher**: Dapat mengakses semua fitur untuk siswa dan nilai yang mereka kelola
- **Admin**: (Future feature) Dapat mengakses semua data

## 📊 Data Models

### User (Teacher)
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  fullName: String,
  role: String (teacher/admin),
  subjects: [String],
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Student
```javascript
{
  nis: String (unique),
  fullName: String,
  email: String,
  phoneNumber: String,
  dateOfBirth: Date,
  gender: String (male/female),
  address: String,
  class: String,
  academicYear: String,
  teacherId: ObjectId (ref: User),
  subjects: [Object],
  isActive: Boolean,
  enrollmentDate: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Grade
```javascript
{
  studentId: ObjectId (ref: Student),
  teacherId: ObjectId (ref: User),
  subject: String,
  gradeType: String (quiz/assignment/midterm/final/participation/project),
  score: Number,
  maxScore: Number,
  weight: Number,
  class: String,
  academicYear: String,
  semester: String (1/2),
  date: Date,
  description: String,
  notes: String,
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Subject
```javascript
{
  name: String (unique),
  code: String (unique),
  description: String,
  credits: Number,
  category: String (core/elective/extracurricular),
  teachers: [ObjectId] (ref: User),
  classes: [String],
  isActive: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

### Test Coverage
- Unit tests for controllers
- Integration tests for API endpoints
- Database operation tests

## 🛡️ Security Features

- **Password Hashing**: Bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Input Validation**: Express-validator for all inputs
- **CORS Protection**: Configured for frontend domain
- **Rate Limiting**: Prevent API abuse
- **Error Handling**: Comprehensive error responses
- **SQL Injection Prevention**: MongoDB ODM protection

## 📈 Performance Optimizations

- **Database Indexing**: Optimized queries with proper indexes
- **Pagination**: Efficient data loading
- **Aggregation Pipelines**: Complex queries optimization
- **Caching**: (Future implementation)
- **Compression**: Response compression middleware

## 🚀 Deployment

### Environment Variables
Pastikan semua environment variables sudah di-set:

```bash
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://username:password@host:port/database
JWT_SECRET=your-production-jwt-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Production Setup
```bash
# Install dependencies
npm ci --only=production

# Start with PM2
npm install -g pm2
pm2 start server.js --name "grading-system-api"

# Or start normally
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📝 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors array (if applicable)
  ]
}
```

### Pagination Response
```json
{
  "success": true,
  "message": "Data retrieved successfully",
  "data": {
    "items": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

## 📧 Support

Untuk pertanyaan dan dukungan:
- Email: support@sistem-penilaian-guru.com
- Issues: GitHub Issues section

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Sistem Penilaian Guru** - Membantu guru mengelola penilaian siswa dengan lebih efisien dan terorganisir! 📚✨
