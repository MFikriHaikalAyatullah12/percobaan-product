import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000/api/auth';

const authService = {
    register: async (userData) => {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    },

    login: async (userData) => {
        const response = await axios.post(`${API_URL}/login`, userData);
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        return JSON.parse(localStorage.getItem('user'));
    },

    setUser: (user) => {
        localStorage.setItem('user', JSON.stringify(user));
    }
};

export default authService;