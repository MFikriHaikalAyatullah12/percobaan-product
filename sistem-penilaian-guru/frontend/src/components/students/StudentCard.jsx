import React from 'react';

const StudentCard = ({ student }) => {
    return (
        <div className="student-card">
            <h3>{student.name}</h3>
            <p>Age: {student.age}</p>
            <p>Class: {student.class}</p>
            <p>Grades: {student.grades.join(', ')}</p>
        </div>
    );
};

export default StudentCard;