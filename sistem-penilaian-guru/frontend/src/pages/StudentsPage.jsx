import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Fab,
  Paper,
  Grid,
  Card,
  CardContent,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  People,
  Close as CloseIcon,
} from '@mui/icons-material';
import StudentList from '../components/students/StudentList';
import StudentForm from '../components/students/StudentForm';

const StudentsPage = () => {
    const [openDialog, setOpenDialog] = useState(false);
    const [refreshList, setRefreshList] = useState(0);

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleStudentAdded = () => {
        setRefreshList(prev => prev + 1);
        handleCloseDialog();
    };

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
                    🎓 Manajemen Siswa
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Kelola data siswa, tambah siswa baru, dan edit informasi siswa
                </Typography>
            </Box>

            {/* Stats Card */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} md={12}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        color: 'white',
                        boxShadow: 3 
                    }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <People sx={{ fontSize: 40 }} />
                                <Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        Data Siswa
                                    </Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                        Kelola informasi lengkap siswa, termasuk data pribadi dan akademik
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Student List */}
            <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
                <StudentList key={refreshList} />
            </Paper>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="add student"
                sx={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                    boxShadow: 4,
                    '&:hover': {
                        transform: 'scale(1.1)',
                        boxShadow: 6,
                    },
                    transition: 'all 0.2s',
                }}
                onClick={handleOpenDialog}
            >
                <AddIcon />
            </Fab>

            {/* Add Student Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: 2,
                        boxShadow: 10,
                    }
                }}
            >
                <DialogTitle sx={{ 
                    backgroundColor: 'primary.main', 
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <Typography variant="h6" fontWeight="bold">
                        ➕ Tambah Siswa Baru
                    </Typography>
                    <IconButton 
                        edge="end" 
                        color="inherit" 
                        onClick={handleCloseDialog}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 3, mt: 2 }}>
                    <StudentForm onStudentAdded={handleStudentAdded} />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default StudentsPage;