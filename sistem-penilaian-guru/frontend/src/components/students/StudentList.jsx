import React, { useState, useEffect } from 'react';
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

            const response = await api.get(`/students?${params}`);
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
                                <MenuItem value="X">Kelas X</MenuItem>
                                <MenuItem value="XI">Kelas XI</MenuItem>
                                <MenuItem value="XII">Kelas XII</MenuItem>
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