import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  CircularProgress,
  Tabs,
  Tab,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`auth-tabpanel-${index}`}
      aria-labelledby={`auth-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const LoginPage = () => {
  const { user, login, register, loading } = useAuth();
  const [tab, setTab] = useState(0);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    subjects: '',
  });
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
    setError('');
    setFormData({
      fullName: '',
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      subjects: '',
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email dan password harus diisi');
      setFormLoading(false);
      return;
    }

    const result = await login({
      username: formData.email, // Backend expects username field but accepts email
      password: formData.password,
    });

    if (!result.success) {
      setError(result.message);
    }

    setFormLoading(false);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    if (!formData.fullName || !formData.username || !formData.email || !formData.password) {
      setError('Semua field harus diisi');
      setFormLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password tidak cocok');
      setFormLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setError('Password minimal 8 karakter');
      setFormLoading(false);
      return;
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      setError('Password harus mengandung huruf besar, huruf kecil, dan angka');
      setFormLoading(false);
      return;
    }

    const result = await register({
      fullName: formData.fullName,
      username: formData.username,
      email: formData.email,
      password: formData.password,
      subjects: formData.subjects ? formData.subjects.split(',').map(s => s.trim()) : [],
    });

    if (!result.success) {
      setError(result.message);
    }

    setFormLoading(false);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Paper elevation={6} sx={{ width: '100%', overflow: 'hidden' }}>
          <Box sx={{ textAlign: 'center', p: 3, bgcolor: 'primary.main', color: 'white' }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Sistem Penilaian Guru
            </Typography>
            <Typography variant="body1">
              Platform untuk mengelola data siswa dan nilai
            </Typography>
          </Box>

          <Tabs
            value={tab}
            onChange={handleTabChange}
            variant="fullWidth"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Login" />
            <Tab label="Register" />
          </Tabs>

          {error && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">{error}</Alert>
            </Box>
          )}

          <TabPanel value={tab} index={0}>
            <form onSubmit={handleLogin}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                required
                autoComplete="email"
                autoFocus
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
                autoComplete="current-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={formLoading}
              >
                {formLoading ? <CircularProgress size={24} /> : 'Login'}
              </Button>
            </form>
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <form onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Nama Lengkap"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                margin="normal"
                required
                autoComplete="name"
                autoFocus
              />
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                margin="normal"
                required
                autoComplete="username"
                helperText="Hanya huruf, angka, dan underscore. Contoh: fikri123"
                error={formData.username && !/^[a-zA-Z0-9_]+$/.test(formData.username)}
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                margin="normal"
                required
                autoComplete="email"
              />
              <TextField
                fullWidth
                label="Mata Pelajaran (pisahkan dengan koma)"
                name="subjects"
                value={formData.subjects}
                onChange={handleInputChange}
                margin="normal"
                placeholder="Matematika, Fisika, Kimia"
                helperText="Contoh: Matematika, Fisika, Kimia"
              />
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                margin="normal"
                required
                autoComplete="new-password"
                helperText="Minimal 8 karakter, harus ada huruf besar, kecil, dan angka. Contoh: TestPass123"
                error={formData.password && (formData.password.length < 8 || !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password))}
              />
              <TextField
                fullWidth
                label="Konfirmasi Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                margin="normal"
                required
                autoComplete="new-password"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={formLoading}
              >
                {formLoading ? <CircularProgress size={24} /> : 'Register'}
              </Button>
            </form>
          </TabPanel>
        </Paper>
      </Box>
    </Container>
  );
};

export default LoginPage;