import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:5000/api';

// Create axios instance
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        console.log('API Request:', {
            method: config.method,
            url: config.url,
            baseURL: config.baseURL,
            fullURL: `${config.baseURL}${config.url}`,
            data: config.data,
            headers: config.headers
        });
        
        // No need to add token here, it's handled in AuthContext
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', {
            status: response.status,
            statusText: response.statusText,
            data: response.data,
            url: response.config.url
        });
        return response;
    },
    (error) => {
        console.log('API Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message,
            code: error.code,
            url: error.config?.url
        });
        
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Example API call to get all students
export const getStudents = async () => {
    try {
        const response = await api.get('/students');
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Example API call to create a new student
export const createStudent = async (studentData) => {
    try {
        const response = await api.post('/students', studentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Example API call to update a student
export const updateStudent = async (studentId, studentData) => {
    try {
        const response = await api.put(`/students/${studentId}`, studentData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Example API call to delete a student
export const deleteStudent = async (studentId) => {
    try {
        const response = await api.delete(`/students/${studentId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};