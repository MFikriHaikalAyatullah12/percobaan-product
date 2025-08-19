import React, { useEffect, useState } from 'react';
import GradeList from '../components/grades/GradeList';
import GradeForm from '../components/grades/GradeForm';
import { fetchGrades } from '../services/gradeService';

const GradesPage = () => {
    const [grades, setGrades] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);

    useEffect(() => {
        const getGrades = async () => {
            const data = await fetchGrades();
            setGrades(data);
        };
        getGrades();
    }, []);

    const handleEdit = (grade) => {
        setSelectedGrade(grade);
    };

    const handleDelete = (id) => {
        setGrades(grades.filter(grade => grade.id !== id));
    };

    return (
        <div>
            <h1>Grades</h1>
            <GradeForm selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} setGrades={setGrades} />
            <GradeList grades={grades} onEdit={handleEdit} onDelete={handleDelete} />
        </div>
    );
};

export default GradesPage;