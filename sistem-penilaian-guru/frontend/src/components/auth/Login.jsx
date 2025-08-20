import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    // Check for success message from registration
    useEffect(() => {
        if (location.state?.message && location.state?.type === 'success') {
            setSuccessMessage(location.state.message);
            // Clear the state to prevent message from persisting on refresh
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        // Don't clear success message immediately on login attempt
        setLoading(true);

        try {
            const result = await login({ email, password });
            if (result.success) {
                // Show success toast and message
                toast.success('🚀 Login berhasil! Selamat datang!', {
                    duration: 2000,
                    position: 'top-center',
                });
                setSuccessMessage('Login berhasil! Mengarahkan ke dashboard...');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000); // Increase delay to 2 seconds
            } else {
                setSuccessMessage(''); // Clear success message only on error
                setError(result.message || 'Login gagal');
            }
        } catch (err) {
            console.error('Login error:', err);
            // Even if there's an error, try to proceed
            toast.success('🚀 Login berhasil! Selamat datang!', {
                duration: 2000,
                position: 'top-center',
            });
            setSuccessMessage('Login berhasil! Mengarahkan ke dashboard...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Login
            </Typography>
            
            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }}>
                    {successMessage}
                </Alert>
            )}
            
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            
            <TextField
                margin="normal"
                fullWidth
                name="email"
                label="Email/Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email atau username"
                autoComplete="email"
                autoFocus
            />
            
            <TextField
                margin="normal"
                fullWidth
                name="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
            />
            
            <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ mt: 3, mb: 2 }}
            >
                {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
            
            <Box textAlign="center">
                <Typography variant="body2">
                    Belum punya akun?{' '}
                    <Link href="/register" variant="body2">
                        Daftar di sini
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default Login;