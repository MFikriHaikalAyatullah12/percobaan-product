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
  Autocomplete,
} from '@mui/material';
import {
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { api } from '../../services/api';
import toast from 'react-hot-toast';

const GradeForm = ({ 
  selectedGrade, 
  students, 
  subjects, 
  onGradeSubmitted, 
  classFilter 
}) => {
    const [formData, setFormData] = useState({
        studentId: '',
        subject: '',
        grade: '',
        semester: '',
        academicYear: '2024/2025',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    // Filter students based on class if classFilter exists
    const filteredStudents = classFilter 
        ? students.filter(student => student.class === classFilter || student.grade === classFilter)
        : students;

    useEffect(() => {
        if (selectedGrade) {
            setFormData({
                studentId: selectedGrade.studentId || '',
                subject: selectedGrade.subject || '',
                grade: selectedGrade.grade?.toString() || '',
                semester: selectedGrade.semester || '',
                academicYear: selectedGrade.academicYear || '2024/2025',
                description: selectedGrade.description || ''
            });
        }
    }, [selectedGrade]);

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

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.studentId) {
            newErrors.studentId = 'Siswa wajib dipilih';
        }
        
        if (!formData.subject) {
            newErrors.subject = 'Mata pelajaran wajib dipilih';
        }
        
        if (!formData.grade) {
            newErrors.grade = 'Nilai wajib diisi';
        } else {
            const gradeValue = parseFloat(formData.grade);
            if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
                newErrors.grade = 'Nilai harus berupa angka antara 0-100';
            }
        }
        
        if (!formData.semester) {
            newErrors.semester = 'Semester wajib dipilih';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Mohon periksa kembali data yang diisi');
            return;
        }

        setLoading(true);
        
        try {
            const submitData = {
                ...formData,
                grade: parseFloat(formData.grade)
            };

            let response;
            if (selectedGrade) {
                response = await api.put(`/grades/${selectedGrade._id}`, submitData);
                toast.success('Nilai berhasil diperbarui');
            } else {
                response = await api.post('/grades', submitData);
                toast.success('Nilai berhasil ditambahkan');
            }
            
            if (response.data.success) {
                onGradeSubmitted();
            }
            
        } catch (error) {
            console.error('Error submitting grade:', error);
            
            if (error.response?.status === 404) {
                toast.error('Endpoint grades belum tersedia. Silakan hubungi developer.');
            } else {
                toast.error(error.response?.data?.message || 'Gagal menyimpan nilai');
            }
        } finally {
            setLoading(false);
        }
    };

    const selectedStudent = filteredStudents.find(s => s._id === formData.studentId);

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            {filteredStudents.length === 0 ? (
                <Alert severity="warning" sx={{ mb: 3 }}>
                    {classFilter 
                        ? `Belum ada siswa di Kelas ${classFilter} SD. Silakan tambah siswa terlebih dahulu.`
                        : 'Belum ada data siswa. Silakan tambah siswa terlebih dahulu.'
                    }
                </Alert>
            ) : (
                <>
                    <Grid container spacing={3}>
                        {/* Student Selection */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={!!errors.studentId}>
                                <Autocomplete
                                    value={selectedStudent || null}
                                    onChange={(event, newValue) => {
                                        setFormData(prev => ({
                                            ...prev,
                                            studentId: newValue?._id || ''
                                        }));
                                        if (errors.studentId) {
                                            setErrors(prev => ({ ...prev, studentId: '' }));
                                        }
                                    }}
                                    options={filteredStudents}
                                    getOptionLabel={(option) => 
                                        `${option.fullName} - ${option.nis} (Kelas ${option.class || option.grade} SD)`
                                    }
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label="Pilih Siswa"
                                            error={!!errors.studentId}
                                            helperText={errors.studentId}
                                        />
                                    )}
                                />
                            </FormControl>
                        </Grid>

                        {/* Subject Selection */}
                        <Grid item xs={12} md={6}>
                            <FormControl fullWidth error={!!errors.subject}>
                                <InputLabel>Mata Pelajaran</InputLabel>
                                <Select
                                    name="subject"
                                    value={formData.subject}
                                    label="Mata Pelajaran"
                                    onChange={handleChange}
                                >
                                    {subjects.map((subject) => (
                                        <MenuItem key={subject} value={subject}>
                                            {subject}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.subject && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                                        {errors.subject}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Grade Input */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                name="grade"
                                label="Nilai (0-100)"
                                type="number"
                                value={formData.grade}
                                onChange={handleChange}
                                error={!!errors.grade}
                                helperText={errors.grade}
                                inputProps={{ min: 0, max: 100 }}
                            />
                        </Grid>

                        {/* Semester Selection */}
                        <Grid item xs={12} md={4}>
                            <FormControl fullWidth error={!!errors.semester}>
                                <InputLabel>Semester</InputLabel>
                                <Select
                                    name="semester"
                                    value={formData.semester}
                                    label="Semester"
                                    onChange={handleChange}
                                >
                                    <MenuItem value="1">Semester 1</MenuItem>
                                    <MenuItem value="2">Semester 2</MenuItem>
                                </Select>
                                {errors.semester && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1 }}>
                                        {errors.semester}
                                    </Typography>
                                )}
                            </FormControl>
                        </Grid>

                        {/* Academic Year */}
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                name="academicYear"
                                label="Tahun Ajaran"
                                value={formData.academicYear}
                                onChange={handleChange}
                            />
                        </Grid>

                        {/* Description */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                name="description"
                                label="Keterangan (Opsional)"
                                multiline
                                rows={3}
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Catatan tambahan tentang nilai ini..."
                            />
                        </Grid>
                    </Grid>

                    {/* Action Buttons */}
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="outlined"
                            startIcon={<CancelIcon />}
                            onClick={() => onGradeSubmitted()}
                            disabled={loading}
                        >
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                            disabled={loading}
                        >
                            {loading ? 'Menyimpan...' : (selectedGrade ? 'Update Nilai' : 'Simpan Nilai')}
                        </Button>
                    </Box>
                </>
            )}
        </Box>
    );
};

export default GradeForm;