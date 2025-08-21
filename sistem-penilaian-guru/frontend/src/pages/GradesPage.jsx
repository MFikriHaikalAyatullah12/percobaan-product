import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Chip,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Add as AddIcon,
  Assessment as AssessmentIcon,
  Class as ClassIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import GradeList from '../components/grades/GradeList';
import GradeForm from '../components/grades/GradeForm';
import { api } from '../services/api';
import toast from 'react-hot-toast';

const GradesPage = () => {
    const [grades, setGrades] = useState([]);
    const [students, setStudents] = useState([]);
    const [selectedGrade, setSelectedGrade] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [searchParams] = useSearchParams();
    const classFilter = searchParams.get('class');

    // Mata pelajaran SD
    const subjects = [
        'Matematika',
        'Bahasa Indonesia', 
        'IPA (Ilmu Pengetahuan Alam)',
        'IPS (Ilmu Pengetahuan Sosial)',
        'Bahasa Inggris',
        'Pendidikan Jasmani',
        'Seni Budaya',
        'Pendidikan Agama'
    ];

    useEffect(() => {
        fetchData();
    }, [classFilter]);

    const fetchData = async () => {
        try {
            setLoading(true);
            
            // Fetch students
            const studentsParams = classFilter ? `?class=${classFilter}&limit=100` : '?limit=1000';
            const studentsResponse = await api.get(`/students/demo${studentsParams}`);
            if (studentsResponse.data.success) {
                setStudents(studentsResponse.data.data.students || []);
            }

            // Fetch grades (if grades API exists)
            try {
                const gradesResponse = await api.get('/grades');
                if (gradesResponse.data.success) {
                    setGrades(gradesResponse.data.data || []);
                }
            } catch (error) {
                // Grades API might not exist yet
                setGrades([]);
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
            toast.error('Gagal memuat data');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = () => {
        setSelectedGrade(null);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedGrade(null);
    };

    const handleEdit = (grade) => {
        setSelectedGrade(grade);
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/grades/${id}`);
            toast.success('Nilai berhasil dihapus');
            fetchData();
        } catch (error) {
            toast.error('Gagal menghapus nilai');
        }
    };

    const handleGradeSubmitted = () => {
        fetchData();
        handleCloseDialog();
    };

    if (loading) {
        return (
            <Container maxWidth="lg" sx={{ py: 3 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
                        📊 Penilaian Siswa SD
                    </Typography>
                    {classFilter && (
                        <Chip 
                            icon={<ClassIcon />}
                            label={`Kelas ${classFilter} SD`}
                            color="primary"
                            variant="outlined"
                            sx={{ 
                                fontSize: '1rem',
                                height: '36px',
                                '& .MuiChip-icon': { fontSize: '1.2rem' }
                            }}
                        />
                    )}
                </Box>
                <Typography variant="body1" color="textSecondary">
                    {classFilter 
                        ? `Kelola nilai siswa untuk Kelas ${classFilter} SD`
                        : 'Kelola nilai siswa untuk semua kelas SD (1-6)'
                    }
                </Typography>
            </Box>

            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
                        color: 'white',
                        height: '120px'
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {students.length}
                                    </Typography>
                                    <Typography variant="body1">
                                        Total Siswa
                                    </Typography>
                                </Box>
                                <AssessmentIcon sx={{ fontSize: '3rem', opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
                        color: 'white',
                        height: '120px'
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {subjects.length}
                                    </Typography>
                                    <Typography variant="body1">
                                        Mata Pelajaran
                                    </Typography>
                                </Box>
                                <ClassIcon sx={{ fontSize: '3rem', opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #ed6c02 0%, #ffb74d 100%)',
                        color: 'white',
                        height: '120px'
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {grades.length}
                                    </Typography>
                                    <Typography variant="body1">
                                        Total Nilai
                                    </Typography>
                                </Box>
                                <AssessmentIcon sx={{ fontSize: '3rem', opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ 
                        background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
                        color: 'white',
                        height: '120px'
                    }}>
                        <CardContent>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        85.2
                                    </Typography>
                                    <Typography variant="body1">
                                        Rata-rata
                                    </Typography>
                                </Box>
                                <AssessmentIcon sx={{ fontSize: '3rem', opacity: 0.8 }} />
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Content */}
            {students.length === 0 ? (
                <Alert severity="info" sx={{ mb: 3 }}>
                    {classFilter 
                        ? `Belum ada siswa di Kelas ${classFilter} SD. Silakan tambah siswa terlebih dahulu.`
                        : 'Belum ada data siswa. Silakan tambah siswa terlebih dahulu.'
                    }
                </Alert>
            ) : (
                <GradeList 
                    grades={grades} 
                    students={students}
                    subjects={subjects}
                    onEdit={handleEdit} 
                    onDelete={handleDelete}
                    classFilter={classFilter}
                />
            )}

            {/* Add Grade Button */}
            {students.length > 0 && (
                <Fab
                    color="primary"
                    aria-label="add grade"
                    onClick={handleOpenDialog}
                    sx={{
                        position: 'fixed',
                        bottom: 16,
                        right: 16,
                    }}
                >
                    <AddIcon />
                </Fab>
            )}

            {/* Grade Form Dialog */}
            <Dialog 
                open={openDialog} 
                onClose={handleCloseDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="h6">
                            {selectedGrade ? 'Edit Nilai' : 'Tambah Nilai Baru'}
                        </Typography>
                        <Button
                            onClick={handleCloseDialog}
                            sx={{ minWidth: 'auto', p: 1 }}
                        >
                            <CloseIcon />
                        </Button>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <GradeForm 
                        selectedGrade={selectedGrade}
                        students={students}
                        subjects={subjects}
                        onGradeSubmitted={handleGradeSubmitted}
                        classFilter={classFilter}
                    />
                </DialogContent>
            </Dialog>
        </Container>
    );
};

export default GradesPage;