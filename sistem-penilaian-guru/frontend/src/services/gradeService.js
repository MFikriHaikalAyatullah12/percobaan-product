import { api } from './api';

// Grade service functions
export const fetchGrades = async () => {
    try {
        const response = await api.get('/grades');
        return response.data;
    } catch (error) {
        throw new Error('Error fetching grades: ' + error.message);
    }
};

export const getGradeById = async (id) => {
    try {
        const response = await api.get(`/grades/${id}`);
        return response.data;
    } catch (error) {
        throw new Error('Error fetching grade: ' + error.message);
    }
};

export const createGrade = async (gradeData) => {
    try {
        const response = await api.post('/grades', gradeData);
        return response.data;
    } catch (error) {
        throw new Error('Error creating grade: ' + error.message);
    }
};

export const updateGrade = async (id, gradeData) => {
    try {
        const response = await api.put(`/grades/${id}`, gradeData);
        return response.data;
    } catch (error) {
        throw new Error('Error updating grade: ' + error.message);
    }
};

export const deleteGrade = async (id) => {
    try {
        await api.delete(`/grades/${id}`);
    } catch (error) {
        throw new Error('Error deleting grade: ' + error.message);
    }
};

const GradeService = {
    fetchGrades,
    getGradeById,
    createGrade,
    updateGrade,
    deleteGrade,
};

export default GradeService;