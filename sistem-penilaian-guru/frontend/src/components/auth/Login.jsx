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

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login({ email, password });
            if (result.success) {
                // Redirect to dashboard after successful login
                navigate('/dashboard');
            } else {
                setError(result.message || 'Email atau password salah');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat login');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
            <Typography variant="h5" component="h2" gutterBottom>
                Login
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
                name="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                autoComplete="email"
                autoFocus
            />
            
            <TextField
                margin="normal"
                required
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