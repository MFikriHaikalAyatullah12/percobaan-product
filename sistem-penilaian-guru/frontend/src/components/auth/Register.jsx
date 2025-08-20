import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
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
        
        if (password !== confirmPassword) {
            setError('Password tidak cocok');
            return;
        }

        if (password.length < 6) {
            setError('Password minimal 6 karakter');
            return;
        }

        setLoading(true);

        try {
            const result = await register({ 
                username, 
                email, 
                password,
                fullName: fullName || username 
            });
            
            if (result.success) {
                // Redirect to login page after successful registration
                navigate('/login');
            } else {
                setError(result.message || 'Registrasi gagal');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat registrasi');
        } finally {
            setLoading(false);
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
                required
                fullWidth
                name="fullName"
                label="Nama Lengkap"
                value={fullName}
                onChange={handleChange}
                placeholder="Masukkan nama lengkap"
            />
            
            <TextField
                margin="normal"
                required
                fullWidth
                name="username"
                label="Username"
                value={username}
                onChange={handleChange}
                placeholder="Masukkan username"
            />
            
            <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email"
                type="email"
                value={email}
                onChange={handleChange}
                placeholder="Masukkan email"
            />
            
            <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={handleChange}
                placeholder="Minimal 6 karakter"
                helperText="Password minimal 6 karakter"
            />
            
            <TextField
                margin="normal"
                required
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
                {loading ? <CircularProgress size={24} /> : 'Daftar'}
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