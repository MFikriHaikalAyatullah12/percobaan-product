import React from 'react';
import StudentList from '../components/students/StudentList';
import StudentForm from '../components/students/StudentForm';

const StudentsPage = () => {
    return (
        <div>
            <h1>Students</h1>
            <StudentForm />
            <StudentList />
        </div>
    );
};

export default StudentsPage;