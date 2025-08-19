INSERT INTO users (username, password, role) VALUES
('admin', 'admin123', 'admin'),
('teacher1', 'teacher123', 'teacher'),
('student1', 'student123', 'student');

INSERT INTO teachers (name, subject) VALUES
('John Doe', 'Mathematics'),
('Jane Smith', 'Science');

INSERT INTO students (name, class) VALUES
('Alice Johnson', '10A'),
('Bob Brown', '10B');

INSERT INTO subjects (name) VALUES
('Mathematics'),
('Science'),
('History');

INSERT INTO classes (name) VALUES
('10A'),
('10B'),
('11A'),
('11B');

INSERT INTO grades (student_id, subject_id, grade) VALUES
(1, 1, 'A'),
(1, 2, 'B'),
(2, 1, 'C'),
(2, 2, 'A');