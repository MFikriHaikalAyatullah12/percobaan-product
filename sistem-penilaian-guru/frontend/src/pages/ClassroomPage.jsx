import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
} from '@mui/material';
import ClassroomManagement from '../components/classroom/ClassroomManagement';

const ClassroomPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight="bold" color="primary" gutterBottom>
          🏫 Manajemen Room Kelas SD
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Kelola dan monitor semua room kelas SD (1-6) dalam satu tempat
        </Typography>
      </Box>

      {/* Info Alert */}
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="body2">
          💡 <strong>Petunjuk:</strong> Gunakan halaman ini untuk memonitor kapasitas, mengelola siswa, 
          dan mengatur nilai untuk setiap kelas SD. Setiap kelas memiliki kapasitas maksimal 35 siswa.
        </Typography>
      </Alert>

      {/* Classroom Management Component */}
      <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
        <ClassroomManagement />
      </Paper>
    </Container>
  );
};

export default ClassroomPage;
