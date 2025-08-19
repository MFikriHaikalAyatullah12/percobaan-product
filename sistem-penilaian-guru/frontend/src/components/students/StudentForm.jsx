import React, { useState } from 'react';

const StudentForm = ({ onSubmit, initialData }) => {
    const [name, setName] = useState(initialData ? initialData.name : '');
    const [age, setAge] = useState(initialData ? initialData.age : '');
    const [grade, setGrade] = useState(initialData ? initialData.grade : '');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name || !age || !grade) {
            setError('All fields are required');
            return;
        }
        setError('');
        onSubmit({ name, age, grade });
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>{initialData ? 'Edit Student' : 'Add Student'}</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Name:</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Age:</label>
                <input
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Grade:</label>
                <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    required
                />
            </div>
            <button type="submit">{initialData ? 'Update' : 'Add'}</button>
        </form>
    );
};

export default StudentForm;