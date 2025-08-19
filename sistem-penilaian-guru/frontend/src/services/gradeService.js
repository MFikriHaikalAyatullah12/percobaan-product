import axios from 'axios';
import { API_URL } from '../utils/constants';

const GradeService = {
    getAllGrades: async () => {
        try {
            const response = await axios.get(`${API_URL}/grades`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching grades: ' + error.message);
        }
    },

    getGradeById: async (id) => {
        try {
            const response = await axios.get(`${API_URL}/grades/${id}`);
            return response.data;
        } catch (error) {
            throw new Error('Error fetching grade: ' + error.message);
        }
    },

    createGrade: async (gradeData) => {
        try {
            const response = await axios.post(`${API_URL}/grades`, gradeData);
            return response.data;
        } catch (error) {
            throw new Error('Error creating grade: ' + error.message);
        }
    },

    updateGrade: async (id, gradeData) => {
        try {
            const response = await axios.put(`${API_URL}/grades/${id}`, gradeData);
            return response.data;
        } catch (error) {
            throw new Error('Error updating grade: ' + error.message);
        }
    },

    deleteGrade: async (id) => {
        try {
            await axios.delete(`${API_URL}/grades/${id}`);
        } catch (error) {
            throw new Error('Error deleting grade: ' + error.message);
        }
    }
};

export default GradeService;