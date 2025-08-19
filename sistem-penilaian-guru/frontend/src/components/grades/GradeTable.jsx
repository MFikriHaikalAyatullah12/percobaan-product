import React from 'react';

const GradeTable = ({ grades }) => {
    return (
        <div>
            <h2>Grade Table</h2>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Student Name</th>
                        <th>Subject</th>
                        <th>Grade</th>
                    </tr>
                </thead>
                <tbody>
                    {grades.map((grade) => (
                        <tr key={grade.id}>
                            <td>{grade.id}</td>
                            <td>{grade.studentName}</td>
                            <td>{grade.subject}</td>
                            <td>{grade.grade}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default GradeTable;