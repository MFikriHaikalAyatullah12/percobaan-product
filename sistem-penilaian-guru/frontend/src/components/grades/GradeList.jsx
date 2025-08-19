import React from 'react';

const GradeList = ({ grades }) => {
    return (
        <div>
            <h2>Grade List</h2>
            <ul>
                {grades.map((grade) => (
                    <li key={grade.id}>
                        {grade.subject}: {grade.score}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default GradeList;