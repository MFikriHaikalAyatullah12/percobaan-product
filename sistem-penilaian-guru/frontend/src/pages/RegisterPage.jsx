import React from 'react';
import { Container, Paper, Typography, Box } from '@mui/material';
import Register from '../components/auth/Register';

const RegisterPage = () => {
  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
            Sistem Penilaian Guru
          </Typography>
          <Register />
        </Paper>
      </Box>
    </Container>
  );
};

export default RegisterPage;
