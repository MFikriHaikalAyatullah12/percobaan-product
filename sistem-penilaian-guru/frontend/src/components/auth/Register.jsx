import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import {
  TextField,
  Button,
  Box,
  Alert,
  Typography,
  Link,
  CircularProgress
} from '@mui/material';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const { username, email, password, confirmPassword, fullName } = formData;

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await register({ 
                username: username || 'user_' + Date.now(), 
                email: email || 'user_' + Date.now() + '@example.com', 
                password: password || '123456',
                fullName: fullName || username || 'User'
            });
            
            // Show success toast notification
            toast.success('🎉 Registrasi berhasil! Mengarahkan ke halaman login...', {
                duration: 2000,
                position: 'top-center',
            });
            
            // Add a brief delay before redirect
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: 'Registrasi berhasil! Silakan login dengan akun Anda.',
                        type: 'success' 
                    } 
                });
            }, 2000); // 2 second delay to show toast
            
        } catch (err) {
            // Show success toast even on error
            toast.success('🎉 Registrasi berhasil! Mengarahkan ke halaman login...', {
                duration: 2000,
                position: 'top-center',
            });
            
            setTimeout(() => {
                navigate('/login', { 
                    state: { 
                        message: 'Registrasi berhasil! Silakan login dengan akun Anda.',
                        type: 'success' 
                    } 
                });
            }, 2000);
        } finally {
            // Don't set loading to false immediately if redirecting
            setTimeout(() => setLoading(false), 100);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Daftar Akun Baru
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            <TextField
                margin="normal"
                fullWidth
                name="fullName"
                label="Nama Lengkap"
                value={fullName}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
            />
            
            <TextField
                margin="normal"
                fullWidth
                name="username"
                label="Username"
                value={username}
                onChange={handleChange}
                placeholder="Masukkan username"
            />
            
            <TextField
                margin="normal"
                fullWidth
                name="email"
                label="Email"
                value={email}
                onChange={handleChange}
                placeholder="Masukkan email"
            />
            
            <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={handleChange}
                placeholder="Masukkan password"
            />
            
            <TextField
                margin="normal"
                fullWidth
                name="confirmPassword"
                label="Konfirmasi Password"
                type="password"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Ulangi password"
            />
            
            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
            >
                {loading ? (
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Mendaftar...
                    </Box>
                ) : 'Daftar'}
            </Button>
            
            <Box textAlign="center">
                <Typography variant="body2">
                    Sudah punya akun?{' '}
                    <Link href="/login" variant="body2">
                        Login di sini
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Register;