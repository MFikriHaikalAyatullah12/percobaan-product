# API Documentation

## Overview
This document provides an overview of the API endpoints available in the Sistem Penilaian Guru application. Each endpoint is described with its purpose, request parameters, and response format.

## Base URL
The base URL for all API requests is:
```
http://localhost:5000/api
```

## Endpoints

### Authentication

#### POST /auth/login
- **Description**: Authenticates a user and returns a JWT token.
- **Request Body**:
  - `email`: User's email address (string, required)
  - `password`: User's password (string, required)
- **Response**:
  - `token`: JWT token (string)
  - `user`: User object containing user details.

#### POST /auth/register
- **Description**: Registers a new user.
- **Request Body**:
  - `name`: User's full name (string, required)
  - `email`: User's email address (string, required)
  - `password`: User's password (string, required)
- **Response**:
  - `message`: Success message (string)

### Students

#### GET /students
- **Description**: Retrieves a list of all students.
- **Response**:
  - `students`: Array of student objects.

#### POST /students
- **Description**: Adds a new student.
- **Request Body**:
  - `name`: Student's full name (string, required)
  - `class`: Class of the student (string, required)
  - `grades`: Array of grades (array of objects, optional)
- **Response**:
  - `message`: Success message (string)
  - `student`: Newly created student object.

### Grades

#### GET /grades
- **Description**: Retrieves a list of all grades.
- **Response**:
  - `grades`: Array of grade objects.

#### POST /grades
- **Description**: Adds a new grade.
- **Request Body**:
  - `studentId`: ID of the student (string, required)
  - `subject`: Subject of the grade (string, required)
  - `score`: Score received (number, required)
- **Response**:
  - `message`: Success message (string)
  - `grade`: Newly created grade object.

### Reports

#### GET /reports
- **Description**: Generates reports based on student performance.
- **Response**:
  - `reports`: Array of report objects.

## Error Handling
All error responses will have the following structure:
- `status`: HTTP status code (number)
- `message`: Error message (string)

## Conclusion
This API documentation provides a comprehensive overview of the available endpoints in the Sistem Penilaian Guru application. For further details on each endpoint, please refer to the specific sections above.