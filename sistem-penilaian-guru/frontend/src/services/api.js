import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Example API call to get all students
export const getStudents = async () => {
    try {
        const response = await apiClient.get('/students');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Example API call to create a new student
export const createStudent = async (studentData) => {
    try {
        const response = await apiClient.post('/students', studentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Example API call to update a student
export const updateStudent = async (studentId, studentData) => {
    try {
        const response = await apiClient.put(`/students/${studentId}`, studentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Example API call to delete a student
export const deleteStudent = async (studentId) => {
    try {
        const response = await apiClient.delete(`/students/${studentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};