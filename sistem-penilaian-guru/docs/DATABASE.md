# DATABASE.md

# Database Schema and Structure

This document provides an overview of the database schema and structure used in the Sistem Penilaian Guru project.

## Database Overview

The database is designed to store information related to teachers, students, grades, and reports. It consists of several tables, each serving a specific purpose.

## Tables

### Users Table

- **Table Name**: `users`
- **Description**: Stores user information including authentication details.
- **Columns**:
  - `id`: Primary key, unique identifier for each user.
  - `username`: Unique username for the user.
  - `password`: Hashed password for authentication.
  - `role`: Role of the user (e.g., admin, teacher).

### Teachers Table

- **Table Name**: `teachers`
- **Description**: Stores information about teachers.
- **Columns**:
  - `id`: Primary key, unique identifier for each teacher.
  - `name`: Full name of the teacher.
  - `subject`: Subject taught by the teacher.

### Students Table

- **Table Name**: `students`
- **Description**: Stores information about students.
- **Columns**:
  - `id`: Primary key, unique identifier for each student.
  - `name`: Full name of the student.
  - `class_id`: Foreign key referencing the class the student belongs to.

### Subjects Table

- **Table Name**: `subjects`
- **Description**: Stores information about subjects offered.
- **Columns**:
  - `id`: Primary key, unique identifier for each subject.
  - `name`: Name of the subject.

### Classes Table

- **Table Name**: `classes`
- **Description**: Stores information about classes.
- **Columns**:
  - `id`: Primary key, unique identifier for each class.
  - `name`: Name of the class.

### Grades Table

- **Table Name**: `grades`
- **Description**: Stores grades assigned to students.
- **Columns**:
  - `id`: Primary key, unique identifier for each grade entry.
  - `student_id`: Foreign key referencing the student.
  - `subject_id`: Foreign key referencing the subject.
  - `grade`: Grade received by the student.

## Relationships

- **Users** can be either teachers or students based on their role.
- **Teachers** can teach multiple **Subjects**.
- **Students** can belong to one **Class** and receive multiple **Grades** for different **Subjects**.

## Migration Files

The database schema is managed using migration files located in the `database/migrations` directory. Each migration file corresponds to a specific change in the database structure.

- `001_create_users_table.sql`: Creates the `users` table.
- `002_create_teachers_table.sql`: Creates the `teachers` table.
- `003_create_students_table.sql`: Creates the `students` table.
- `004_create_subjects_table.sql`: Creates the `subjects` table.
- `005_create_classes_table.sql`: Creates the `classes` table.
- `006_create_grades_table.sql`: Creates the `grades` table.

## Seed Data

Seed data for the database can be found in the `database/seeds` directory, which helps in populating the database with initial data for testing and development purposes.