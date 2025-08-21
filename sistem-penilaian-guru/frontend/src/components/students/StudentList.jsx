import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CardActionArea,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
} from '@mui/icons-material';
import { api } from '../../services/api';
import StudentCard from './StudentCard';
import StudentForm from './StudentForm';
import toast from 'react-hot-toast';

const StudentList = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('');
    const [academicYearFilter, setAcademicYearFilter] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStudents, setTotalStudents] = useState(0);
    const [editStudent, setEditStudent] = useState(null);
    const [deleteStudent, setDeleteStudent] = useState(null);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    
    // URL params untuk filter kelas
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    
    // Set filter kelas dari URL saat komponen dimuat
    useEffect(() => {
        const classFromUrl = searchParams.get('class');
        if (classFromUrl) {
            setClassFilter(classFromUrl);
        }
    }, [searchParams]);
    
    // Fetch students saat classFilter berubah
    useEffect(() => {
        fetchStudents();
    }, [page, searchTerm, classFilter, academicYearFilter]);
    
    // Konstanta kapasitas maksimal per kelas
    const MAX_CAPACITY_PER_CLASS = 35;
    
    // Menghitung jumlah siswa per kelas
    const getClassCount = (grade) => {
        return students.filter(student => student.grade === grade).length;
    };
    
    // Mendapatkan status kapasitas kelas
    const getClassCapacityStatus = (grade) => {
        const count = getClassCount(grade);
        const percentage = (count / MAX_CAPACITY_PER_CLASS) * 100;
        
        if (percentage >= 100) return { status: 'full', color: '#f44336', text: 'Penuh' };
        if (percentage >= 80) return { status: 'warning', color: '#ff9800', text: 'Hampir Penuh' };
        return { status: 'normal', color: '#4caf50', text: 'Tersedia' };
    };

    // Fungsi untuk navigasi ke detail room kelas
    const handleClassroomClick = (grade) => {
        navigate(`/classroom/${grade}`);
    };

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(searchTerm && { search: searchTerm }),
                ...(classFilter && { class: classFilter }),
                ...(academicYearFilter && { academicYear: academicYearFilter }),
            });

            const response = await api.get(`/students/demo?${params}`);
            if (response.data.success) {
                setStudents(response.data.data.students || []);
                setTotalPages(response.data.data.pagination?.totalPages || 1);
                setTotalStudents(response.data.data.pagination?.totalStudents || 0);
            }
        } catch (error) {
            console.error('Error fetching students:', error);
            toast.error('Gagal memuat data siswa');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, [page, searchTerm, classFilter, academicYearFilter]);

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setPage(1);
    };

    const handlePageChange = (event, newPage) => {
        setPage(newPage);
    };

    const handleEdit = (student) => {
        setEditStudent(student);
        setOpenEditDialog(true);
    };

    const handleDelete = (student) => {
        setDeleteStudent(student);
        setOpenDeleteDialog(true);
    };

    const confirmDelete = async () => {
        try {
            await api.delete(`/students/${deleteStudent._id}`);
            toast.success('Siswa berhasil dihapus');
            fetchStudents();
        } catch (error) {
            toast.error('Gagal menghapus siswa');
        } finally {
            setOpenDeleteDialog(false);
            setDeleteStudent(null);
        }
    };

    const handleStudentUpdated = () => {
        fetchStudents();
        setOpenEditDialog(false);
        setEditStudent(null);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header with Search and Filters */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    📋 Daftar Siswa ({totalStudents} siswa)
                </Typography>
                
                <Grid container spacing={2} sx={{ mt: 1 }}>
                    {/* Search */}
                    <Grid item xs={12} md={6}>
                        <TextField
                            fullWidth
                            placeholder="Cari siswa (nama, NIS, email)..."
                            value={searchTerm}
                            onChange={handleSearch}
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
                    
                    {/* Class Filter */}
                    <Grid item xs={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Kelas</InputLabel>
                            <Select
                                value={classFilter}
                                label="Kelas"
                                onChange={(e) => {
                                    setClassFilter(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <MenuItem value="">Semua Kelas</MenuItem>
                                <MenuItem value="1">Kelas 1 SD</MenuItem>
                                <MenuItem value="2">Kelas 2 SD</MenuItem>
                                <MenuItem value="3">Kelas 3 SD</MenuItem>
                                <MenuItem value="4">Kelas 4 SD</MenuItem>
                                <MenuItem value="5">Kelas 5 SD</MenuItem>
                                <MenuItem value="6">Kelas 6 SD</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    
                    {/* Academic Year Filter */}
                    <Grid item xs={6} md={3}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Tahun Ajaran</InputLabel>
                            <Select
                                value={academicYearFilter}
                                label="Tahun Ajaran"
                                onChange={(e) => {
                                    setAcademicYearFilter(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <MenuItem value="">Semua Tahun</MenuItem>
                                <MenuItem value="2023/2024">2023/2024</MenuItem>
                                <MenuItem value="2024/2025">2024/2025</MenuItem>
                                <MenuItem value="2025/2026">2025/2026</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Box>

            {/* Kapasitas Kelas SD */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                    🏫 Kapasitas Kelas SD
                </Typography>
                <Grid container spacing={2}>
                    {[1, 2, 3, 4, 5, 6].map(grade => {
                        const count = getClassCount(grade.toString());
                        const capacity = getClassCapacityStatus(grade.toString());
                        const percentage = (count / MAX_CAPACITY_PER_CLASS) * 100;
                        
                        return (
                            <Grid item xs={12} sm={6} md={4} key={grade}>
                                <Card 
                                    sx={{ 
                                        background: `linear-gradient(135deg, ${capacity.color}20 0%, ${capacity.color}10 100%)`,
                                        border: `1px solid ${capacity.color}40`,
                                        position: 'relative',
                                        overflow: 'hidden',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: 6,
                                            border: `2px solid ${capacity.color}`,
                                        }
                                    }}
                                >
                                    <CardActionArea 
                                        onClick={() => handleClassroomClick(grade)}
                                        sx={{ height: '100%' }}
                                    >
                                        <CardContent>
                                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                                <Typography variant="h6" fontWeight="bold">
                                                    📚 Kelas {grade} SD
                                                </Typography>
                                                <Chip 
                                                    label={capacity.text}
                                                    size="small"
                                                    sx={{ 
                                                        backgroundColor: capacity.color,
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            </Box>
                                            
                                            <Typography variant="body2" color="text.secondary" mb={2}>
                                                👥 {count} / {MAX_CAPACITY_PER_CLASS} siswa
                                            </Typography>
                                            
                                            <Box 
                                                sx={{ 
                                                    width: '100%', 
                                                    height: 8, 
                                                    backgroundColor: '#f0f0f0',
                                                    borderRadius: 4,
                                                    overflow: 'hidden',
                                                    mb: 1
                                                }}
                                            >
                                                <Box 
                                                    sx={{ 
                                                        width: `${Math.min(percentage, 100)}%`,
                                                        height: '100%',
                                                        backgroundColor: capacity.color,
                                                        transition: 'width 0.3s ease'
                                                    }}
                                                />
                                            </Box>
                                            
                                            <Typography variant="caption" color="text.secondary" mb={1} display="block">
                                                📊 {percentage.toFixed(1)}% kapasitas
                                            </Typography>
                                            
                                            <Typography variant="body2" 
                                                sx={{ 
                                                    color: capacity.color, 
                                                    fontWeight: 'medium',
                                                    textAlign: 'center',
                                                    mt: 1,
                                                    p: 1,
                                                    backgroundColor: `${capacity.color}10`,
                                                    borderRadius: 1
                                                }}
                                            >
                                                🖱️ Klik untuk kelola room kelas
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>
            </Box>

            {/* Student Grid */}
            {students.length === 0 ? (
                <Card sx={{ textAlign: 'center', py: 6 }}>
                    <CardContent>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                            Belum ada data siswa
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Klik tombol + untuk menambahkan siswa baru
                        </Typography>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={3}>
                    {students.map((student) => (
                        <Grid item xs={12} sm={6} md={4} key={student._id}>
                            <StudentCard 
                                student={student} 
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                    <Pagination
                        count={totalPages}
                        page={page}
                        onChange={handlePageChange}
                        color="primary"
                        showFirstButton
                        showLastButton
                    />
                </Box>
            )}

            {/* Edit Dialog */}
            <Dialog 
                open={openEditDialog} 
                onClose={() => setOpenEditDialog(false)}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Edit Data Siswa</DialogTitle>
                <DialogContent>
                    {editStudent && (
                        <StudentForm 
                            student={editStudent}
                            onStudentAdded={handleStudentUpdated}
                            isEdit={true}
                        />
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
            >
                <DialogTitle>Konfirmasi Hapus</DialogTitle>
                <DialogContent>
                    <Typography>
                        Apakah Anda yakin ingin menghapus siswa <strong>{deleteStudent?.fullName}</strong>?
                        Tindakan ini tidak dapat dibatalkan.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDeleteDialog(false)}>
                        Batal
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained">
                        Hapus
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudentList;