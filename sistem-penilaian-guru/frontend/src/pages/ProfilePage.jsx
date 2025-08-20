import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Grid,
  Divider,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user, updateProfile, changePassword } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState({
    profile: false,
    password: false,
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, profile: true });
    setMessage({ type: '', text: '' });

    const result = await updateProfile(profileData);
    if (result.success) {
      setMessage({ type: 'success', text: 'Profile berhasil diupdate!' });
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setLoading({ ...loading, profile: false });
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setLoading({ ...loading, password: true });
    setMessage({ type: '', text: '' });

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Password baru tidak cocok!' });
      setLoading({ ...loading, password: false });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password minimal 6 karakter!' });
      setLoading({ ...loading, password: false });
      return;
    }

    const result = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });

    if (result.success) {
      setMessage({ type: 'success', text: 'Password berhasil diubah!' });
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } else {
      setMessage({ type: 'error', text: result.message });
    }

    setLoading({ ...loading, password: false });
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Profile
      </Typography>

      {message.text && (
        <Alert severity={message.type} sx={{ mb: 3 }}>
          {message.text}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* Profile Information */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informasi Profile
            </Typography>
            
            <form onSubmit={handleProfileSubmit}>
              <TextField
                fullWidth
                label="Nama Lengkap"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleProfileChange}
                margin="normal"
                required
              />
              
              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 2 }}
                disabled={loading.profile}
                fullWidth
              >
                {loading.profile ? <CircularProgress size={24} /> : 'Update Profile'}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Change Password */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ubah Password
            </Typography>
            
            <form onSubmit={handlePasswordSubmit}>
              <TextField
                fullWidth
                label="Password Saat Ini"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Password Baru"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Konfirmasi Password Baru"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                margin="normal"
                required
              />
              
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                sx={{ mt: 2 }}
                disabled={loading.password}
                fullWidth
              >
                {loading.password ? <CircularProgress size={24} /> : 'Ubah Password'}
              </Button>
            </form>
          </Paper>
        </Grid>

        {/* Account Information */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informasi Akun
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography variant="body1">
                <strong>ID:</strong> {user?._id}
              </Typography>
              <Typography variant="body1">
                <strong>Terdaftar sejak:</strong> {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}
              </Typography>
              <Typography variant="body1">
                <strong>Terakhir diupdate:</strong> {user?.updatedAt ? new Date(user.updatedAt).toLocaleDateString('id-ID') : '-'}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;
