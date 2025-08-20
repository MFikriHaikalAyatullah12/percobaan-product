import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          const response = await api.get('/auth/profile');
          if (response.data.success) {
            setUser(response.data.data.user);
          }
        } catch (error) {
          console.error('Failed to get user profile:', error);
          Cookies.remove('token');
          delete api.defaults.headers.common['Authorization'];
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Set token in cookies and axios headers
        Cookies.set('token', token, { expires: 1 }); // 1 day
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        toast.success('Login berhasil!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login gagal';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('Sending registration data:', userData);
      const response = await api.post('/auth/register', userData);
      console.log('Registration response:', response.data);
      if (response.data.success) {
        const { token, user } = response.data.data;
        
        // Set token in cookies and axios headers
        Cookies.set('token', token, { expires: 1 });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        setUser(user);
        toast.success('Registrasi berhasil!');
        return { success: true };
      }
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error response:', error.response);
      console.error('Error request:', error.request);
      console.error('Error message:', error.message);
      console.error('Error config:', error.config);
      
      let message = 'Registrasi gagal';
      
      if (error.code === 'ERR_NETWORK') {
        message = 'Tidak dapat terhubung ke server. Pastikan backend berjalan di port 5000.';
      } else if (error.response) {
        // Server responded with error status
        if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
          const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
          message = `Validasi gagal: ${errorMessages}`;
        } else if (error.response.data?.message) {
          message = error.response.data.message;
        } else {
          message = `Server error: ${error.response.status} ${error.response.statusText}`;
        }
      } else if (error.request) {
        // Request was made but no response received
        message = 'Tidak ada respon dari server. Periksa koneksi internet atau backend.';
      }
      
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    // Remove token from cookies and axios headers
    Cookies.remove('token');
    delete api.defaults.headers.common['Authorization'];
    
    setUser(null);
    toast.success('Logout berhasil!');
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      if (response.data.success) {
        setUser(response.data.data.user);
        toast.success('Profile berhasil diupdate!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Update profile gagal';
      toast.error(message);
      return { success: false, message };
    }
  };

  const changePassword = async (passwordData) => {
    try {
      const response = await api.post('/auth/change-password', passwordData);
      if (response.data.success) {
        toast.success('Password berhasil diubah!');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Ubah password gagal';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
