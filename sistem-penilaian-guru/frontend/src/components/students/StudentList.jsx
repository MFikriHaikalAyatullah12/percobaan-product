import React from 'react';
import { useStudents } from '../../hooks/useStudents';
import StudentCard from './StudentCard';

const StudentList = () => {
    const { students, loading, error } = useStudents();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading students: {error.message}</div>;
    }

    return (
        <div>
            <h2>Student List</h2>
            <div className="student-list">
                {students.map(student => (
                    <StudentCard key={student.id} student={student} />
                ))}
            </div>
        </div>
    );
};

export default StudentList;