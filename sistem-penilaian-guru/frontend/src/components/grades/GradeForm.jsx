import React, { useState } from 'react';

const GradeForm = ({ onSubmit, initialData }) => {
    const [grade, setGrade] = useState(initialData ? initialData.grade : '');
    const [subject, setSubject] = useState(initialData ? initialData.subject : '');
    const [studentId, setStudentId] = useState(initialData ? initialData.studentId : '');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ grade, subject, studentId });
        setGrade('');
        setSubject('');
        setStudentId('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="grade">Grade:</label>
                <input
                    type="text"
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="subject">Subject:</label>
                <input
                    type="text"
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
            </div>
            <div>
                <label htmlFor="studentId">Student ID:</label>
                <input
                    type="text"
                    id="studentId"
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default GradeForm;