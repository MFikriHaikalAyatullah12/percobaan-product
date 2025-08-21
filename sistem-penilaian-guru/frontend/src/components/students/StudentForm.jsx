import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Alert,
  CircularProgress,
  Paper,
  Divider,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const StudentForm = ({ student, onStudentAdded, isEdit = false }) => {
    const [formData, setFormData] = useState({
        nis: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        class: '',
        academicYear: '',
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isEdit && student) {
            setFormData({
                nis: student.nis || '',
                fullName: student.fullName || '',
                email: student.email || '',
                phoneNumber: student.phoneNumber || '',
                dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
                gender: student.gender || '',
                address: student.address || '',
                class: student.class || '',
                academicYear: student.academicYear || '',
            });
        }
    }, [isEdit, student]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = async () => {
        const newErrors = {};
        
        if (!formData.nis.trim()) {
            newErrors.nis = 'NIS wajib diisi';
        }
        
        if (!formData.fullName.trim()) {
            newErrors.fullName = 'Nama lengkap wajib diisi';
        }
        
        if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';
        }
        
        if (!formData.gender) {
            newErrors.gender = 'Jenis kelamin wajib dipilih';
        }
        
        if (!formData.class.trim()) {
            newErrors.class = 'Kelas wajib diisi';
        }
        
        if (!formData.academicYear.trim()) {
            newErrors.academicYear = 'Tahun ajaran wajib diisi';
        }

        // Validasi kapasitas kelas (maksimal 35 siswa per kelas)
        if (formData.class && (!isEdit || (isEdit && student.class !== formData.class))) {
            try {
                const response = await api.get(`/students?class=${formData.class}&limit=100`);
                if (response.data.success) {
                    const currentClassCount = response.data.data.students?.length || 0;
                    if (currentClassCount >= 35) {
                        newErrors.class = `Kelas ${formData.class} SD sudah penuh (maksimal 35 siswa)`;
                    }
                }
            } catch (error) {
                console.error('Error checking class capacity:', error);
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const isValid = await validateForm();
        if (!isValid) {
            toast.error('Mohon periksa kembali data yang diisi');
            return;
        }

        setLoading(true);
        
        try {
            let response;
            if (isEdit) {
                response = await api.put(`/students/${student._id}`, formData);
                toast.success('Data siswa berhasil diperbarui');
            } else {
                response = await api.post('/students', formData);
                toast.success('Siswa berhasil ditambahkan');
            }
            
            if (response.data.success) {
                // Reset form if not editing
                if (!isEdit) {
                    setFormData({
                        nis: '',
                        fullName: '',
                        email: '',
                        phoneNumber: '',
                        dateOfBirth: '',
                        gender: '',
                        address: '',
                        class: '',
                        academicYear: '',
                    });
                }
                
                if (onStudentAdded) {
                    onStudentAdded();
                }
            }
        } catch (error) {
            console.error('Error saving student:', error);
            const errorMessage = error.response?.data?.message || 
                                error.response?.data?.errors?.[0]?.msg || 
                                'Gagal menyimpan data siswa';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const currentYear = new Date().getFullYear();
    const academicYears = [
        `${currentYear-1}/${currentYear}`,
        `${currentYear}/${currentYear+1}`,
        `${currentYear+1}/${currentYear+2}`
    ];

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                <PersonIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                    {isEdit ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
                </Typography>
            </Box>
            
            <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom>
                        📝 Informasi Dasar
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="NIS (Nomor Induk Siswa)"
                        name="nis"
                        value={formData.nis}
                        onChange={handleChange}
                        error={!!errors.nis}
                        helperText={errors.nis}
                        placeholder="Contoh: 1234567890"
                        variant="outlined"
                    />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Nama Lengkap"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        placeholder="Contoh: Ahmad Fauzi"
                        variant="outlined"
                    />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        placeholder="Contoh: ahmad@email.com"
                        variant="outlined"
                    />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Nomor Telepon"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Contoh: 081234567890"
                        variant="outlined"
                    />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <TextField
                        fullWidth
                        label="Tanggal Lahir"
                        name="dateOfBirth"
                        type="date"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        variant="outlined"
                    />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.gender}>
                        <InputLabel>Jenis Kelamin</InputLabel>
                        <Select
                            name="gender"
                            value={formData.gender}
                            label="Jenis Kelamin"
                            onChange={handleChange}
                        >
                            <MenuItem value="male">Laki-laki</MenuItem>
                            <MenuItem value="female">Perempuan</MenuItem>
                        </Select>
                        {errors.gender && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                {errors.gender}
                            </Typography>
                        )}
                    </FormControl>
                </Grid>
                
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="Alamat"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Contoh: Jl. Pendidikan No. 123, Jakarta"
                        variant="outlined"
                        multiline
                        rows={2}
                    />
                </Grid>

                {/* Academic Information */}
                <Grid item xs={12}>
                    <Typography variant="subtitle1" fontWeight="bold" color="primary" gutterBottom sx={{ mt: 2 }}>
                        🎓 Informasi Akademik
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.class}>
                        <InputLabel>Kelas</InputLabel>
                        <Select
                            name="class"
                            value={formData.class}
                            label="Kelas"
                            onChange={handleChange}
                        >
                            <MenuItem value="1">Kelas 1 SD</MenuItem>
                            <MenuItem value="2">Kelas 2 SD</MenuItem>
                            <MenuItem value="3">Kelas 3 SD</MenuItem>
                            <MenuItem value="4">Kelas 4 SD</MenuItem>
                            <MenuItem value="5">Kelas 5 SD</MenuItem>
                            <MenuItem value="6">Kelas 6 SD</MenuItem>
                        </Select>
                        {errors.class && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                {errors.class}
                            </Typography>
                        )}
                    </FormControl>
                </Grid>
                
                <Grid item xs={12} md={6}>
                    <FormControl fullWidth error={!!errors.academicYear}>
                        <InputLabel>Tahun Ajaran</InputLabel>
                        <Select
                            name="academicYear"
                            value={formData.academicYear}
                            label="Tahun Ajaran"
                            onChange={handleChange}
                        >
                            {academicYears.map((year) => (
                                <MenuItem key={year} value={year}>{year}</MenuItem>
                            ))}
                        </Select>
                        {errors.academicYear && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                                {errors.academicYear}
                            </Typography>
                        )}
                    </FormControl>
                </Grid>
                
                {/* Submit Button */}
                <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                            disabled={loading}
                            size="large"
                            sx={{ px: 4 }}
                        >
                            {loading ? 'Menyimpan...' : (isEdit ? 'Perbarui' : 'Simpan')}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default StudentForm;
