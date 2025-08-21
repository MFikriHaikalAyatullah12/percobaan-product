import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
} from '@mui/material';
import {
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Star as StarIcon,
  Person as PersonIcon,
  School as SchoolIcon,
} from '@mui/icons-material';

const GradeList = ({ 
  grades, 
  students, 
  subjects, 
  onEdit, 
  onDelete, 
  classFilter 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [subjectFilter, setSubjectFilter] = useState('');
    const [semesterFilter, setSemesterFilter] = useState('');
    const [deleteDialog, setDeleteDialog] = useState({ open: false, grade: null });

    // Filter grades based on search and filters
    const filteredGrades = grades.filter(grade => {
        const student = students.find(s => s._id === grade.studentId);
        const matchesSearch = student?.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            grade.subject.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubject = !subjectFilter || grade.subject === subjectFilter;
        const matchesSemester = !semesterFilter || grade.semester === semesterFilter;
        
        return matchesSearch && matchesSubject && matchesSemester;
    });

    const getGradeColor = (grade) => {
        if (grade >= 85) return '#4caf50'; // Green
        if (grade >= 70) return '#ff9800'; // Orange
        return '#f44336'; // Red
    };

    const getGradeLabel = (grade) => {
        if (grade >= 85) return 'Sangat Baik';
        if (grade >= 70) return 'Baik';
        return 'Perlu Perbaikan';
    };

    const handleDeleteClick = (grade) => {
        setDeleteDialog({ open: true, grade });
    };

    const handleDeleteConfirm = () => {
        if (deleteDialog.grade) {
            onDelete(deleteDialog.grade._id);
        }
        setDeleteDialog({ open: false, grade: null });
    };

    if (grades.length === 0) {
        return (
            <Alert severity="info" sx={{ mt: 3 }}>
                Belum ada data nilai. Klik tombol + untuk menambah nilai baru.
            </Alert>
        );
    }

    return (
        <Box>
            {/* Search and Filters */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    📋 Daftar Nilai Siswa ({filteredGrades.length} nilai)
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {/* Search */}
                    <Grid item xs={12} md={4}>
                        <TextField
                            fullWidth
                            placeholder="Cari siswa atau mata pelajaran..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                            }}
                            variant="outlined"
                            size="small"
                        />
                    </Grid>
                    
                    {/* Subject Filter */}
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Mata Pelajaran</InputLabel>
                            <Select
                                value={subjectFilter}
                                label="Mata Pelajaran"
                                onChange={(e) => setSubjectFilter(e.target.value)}
                            >
                                <MenuItem value="">Semua Mata Pelajaran</MenuItem>
                                {subjects.map((subject) => (
                                    <MenuItem key={subject} value={subject}>
                                        {subject}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    {/* Semester Filter */}
                    <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Semester</InputLabel>
                            <Select
                                value={semesterFilter}
                                label="Semester"
                                onChange={(e) => setSemesterFilter(e.target.value)}
                            >
                                <MenuItem value="">Semua Semester</MenuItem>
                                <MenuItem value="1">Semester 1</MenuItem>
                                <MenuItem value="2">Semester 2</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Grade Cards */}
            {filteredGrades.length === 0 ? (
                <Alert severity="info">
                    Tidak ada nilai yang sesuai dengan filter pencarian.
                </Alert>
            ) : (
                <Grid container spacing={3}>
                    {filteredGrades.map((grade) => {
                        const student = students.find(s => s._id === grade.studentId);
                        if (!student) return null;

                        return (
                            <Grid item xs={12} sm={6} md={4} key={grade._id}>
                                <Card 
                                    sx={{ 
                                        height: '100%',
                                        border: `2px solid ${getGradeColor(grade.grade)}20`,
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 4,
                                            border: `2px solid ${getGradeColor(grade.grade)}60`,
                                        }
                                    }}
                                >
                                    <CardContent>
                                        {/* Student Info */}
                                        <Box display="flex" alignItems="center" mb={2}>
                                            <Avatar 
                                                sx={{ 
                                                    mr: 1.5, 
                                                    bgcolor: 'primary.main',
                                                    width: 40,
                                                    height: 40
                                                }}
                                            >
                                                <PersonIcon />
                                            </Avatar>
                                            <Box>
                                                <Typography variant="h6" fontWeight="bold">
                                                    {student.fullName}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    NIS: {student.nis} • Kelas {student.class || student.grade} SD
                                                </Typography>
                                            </Box>
                                        </Box>

                                        {/* Subject */}
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <SchoolIcon sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />
                                            <Typography variant="body1" fontWeight="medium">
                                                {grade.subject}
                                            </Typography>
                                        </Box>

                                        {/* Grade */}
                                        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
                                            <Box display="flex" alignItems="center">
                                                <StarIcon sx={{ mr: 0.5, color: getGradeColor(grade.grade) }} />
                                                <Typography variant="h4" fontWeight="bold" color={getGradeColor(grade.grade)}>
                                                    {grade.grade}
                                                </Typography>
                                            </Box>
                                            <Chip 
                                                label={getGradeLabel(grade.grade)}
                                                size="small"
                                                sx={{ 
                                                    backgroundColor: getGradeColor(grade.grade),
                                                    color: 'white',
                                                    fontWeight: 'bold'
                                                }}
                                            />
                                        </Box>

                                        {/* Additional Info */}
                                        <Box display="flex" justifyContent="space-between" mb={1}>
                                            <Typography variant="body2" color="text.secondary">
                                                Semester {grade.semester}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {grade.academicYear}
                                            </Typography>
                                        </Box>

                                        {grade.description && (
                                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                                💭 {grade.description}
                                            </Typography>
                                        )}
                                    </CardContent>

                                    <CardActions sx={{ justifyContent: 'space-between', px: 2, pb: 2 }}>
                                        <Button
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={() => onEdit(grade)}
                                            sx={{ color: '#1976d2' }}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDeleteClick(grade)}
                                            sx={{ color: '#f44336' }}
                                        >
                                            Hapus
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog 
                open={deleteDialog.open} 
                onClose={() => setDeleteDialog({ open: false, grade: null })}
            >
                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                <DialogContent>
                    <Typography>
                        Apakah Anda yakin ingin menghapus nilai {deleteDialog.grade?.subject} 
                        untuk siswa ini? Tindakan ini tidak dapat dibatalkan.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button 
                        onClick={() => setDeleteDialog({ open: false, grade: null })}
                        color="inherit"
                    >
                        Batal
                    </Button>
                    <Button 
                        onClick={handleDeleteConfirm}
                        color="error"
                        variant="contained"
                    >
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default GradeList;