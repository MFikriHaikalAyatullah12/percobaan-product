import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CardActionArea,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';

const ClassroomManagement = () => {
  const navigate = useNavigate();
  const [classroomStats, setClassroomStats] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [loading, setLoading] = useState(true);

  const MAX_CAPACITY = 35;
  const TOTAL_CLASSES = 6;

  useEffect(() => {
    fetchClassroomData();
  }, []);

  const fetchClassroomData = async () => {
    try {
      setLoading(true);
      
      // Fetch all students data
      const response = await api.get('/students/demo?limit=1000');
      if (response.data.success) {
        const allStudents = response.data.data?.students || [];
        
        // Group students by class
        const classData = [];
        for (let grade = 1; grade <= TOTAL_CLASSES; grade++) {
          const classStudents = allStudents.filter(student => 
            student.grade === grade.toString() || student.class === grade.toString()
          );
          
          const studentCount = classStudents.length;
          const percentage = (studentCount / MAX_CAPACITY) * 100;
          
          classData.push({
            grade,
            studentCount,
            percentage,
            availableSlots: MAX_CAPACITY - studentCount,
            status: getClassStatus(percentage),
            students: classStudents
          });
        }
        
        setClassroomStats(classData);
      }
    } catch (error) {
      console.error('Error fetching classroom data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getClassStatus = (percentage) => {
    if (percentage >= 100) return { color: '#f44336', text: 'Penuh', level: 'full' };
    if (percentage >= 80) return { color: '#ff9800', text: 'Hampir Penuh', level: 'warning' };
    if (percentage >= 50) return { color: '#2196f3', text: 'Normal', level: 'normal' };
    return { color: '#4caf50', text: 'Tersedia', level: 'available' };
  };

  const handleViewClassDetail = (classData) => {
    navigate(`/classroom/${classData.grade}`);
  };

  const handleManageStudents = (grade) => {
    navigate(`/students?class=${grade}`);
  };

  const handleManageGrades = (grade) => {
    navigate(`/grades?class=${grade}`);
  };

  const handleShowClassInfo = (classData) => {
    setSelectedClass(classData);
    setOpenDialog(true);
  };

  const getTotalStats = () => {
    const totalStudents = classroomStats.reduce((sum, cls) => sum + cls.studentCount, 0);
    const totalCapacity = TOTAL_CLASSES * MAX_CAPACITY;
    const overallPercentage = totalCapacity > 0 ? (totalStudents / totalCapacity) * 100 : 0;
    
    return {
      totalStudents,
      totalCapacity,
      overallPercentage,
      availableSlots: totalCapacity - totalStudents
    };
  };

  const stats = getTotalStats();

  if (loading) {
    return (
      <Box p={3}>
        <Typography variant="h6">Memuat data classroom...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Overall Statistics */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)',
            color: 'white',
            height: '120px'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.totalStudents}
                  </Typography>
                  <Typography variant="body2">
                    Total Siswa SD
                  </Typography>
                </Box>
                <GroupsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #2e7d32 0%, #66bb6a 100%)',
            color: 'white',
            height: '120px'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.availableSlots}
                  </Typography>
                  <Typography variant="body2">
                    Slot Tersedia
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #ed6c02 0%, #ffb74d 100%)',
            color: 'white',
            height: '120px'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {TOTAL_CLASSES}
                  </Typography>
                  <Typography variant="body2">
                    Total Kelas SD
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={3}>
          <Card sx={{ 
            background: 'linear-gradient(135deg, #9c27b0 0%, #ba68c8 100%)',
            color: 'white',
            height: '120px'
          }}>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {stats.overallPercentage.toFixed(1)}%
                  </Typography>
                  <Typography variant="body2">
                    Kapasitas Terisi
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Classroom Table */}
      <Paper sx={{ mb: 4 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            📊 Status Room Kelas SD
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Monitoring kapasitas dan status setiap kelas SD (1-6)
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell><strong>Kelas</strong></TableCell>
                  <TableCell><strong>Jumlah Siswa</strong></TableCell>
                  <TableCell><strong>Kapasitas</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell><strong>Aksi</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {classroomStats.map((classData) => (
                  <TableRow key={classData.grade}>
                    <TableCell>
                      <Typography variant="body2" fontWeight="bold">
                        📚 Kelas {classData.grade} SD
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2">
                          {classData.studentCount}/{MAX_CAPACITY} siswa
                        </Typography>
                        <LinearProgress 
                          variant="determinate" 
                          value={Math.min(classData.percentage, 100)}
                          sx={{
                            height: 6,
                            borderRadius: 3,
                            mt: 1,
                            backgroundColor: '#f0f0f0',
                            '& .MuiLinearProgress-bar': {
                              backgroundColor: classData.status.color,
                              borderRadius: 3,
                            }
                          }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {classData.availableSlots} slot tersisa
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={classData.status.text}
                        size="small"
                        sx={{ 
                          backgroundColor: classData.status.color,
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => handleViewClassDetail(classData)}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          Detail
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleManageStudents(classData.grade)}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          Siswa
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => handleManageGrades(classData.grade)}
                          sx={{ fontSize: '0.75rem' }}
                        >
                          Nilai
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Paper>

      {/* Clickable Class Cards */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🏫 Akses Cepat Room Kelas - Klik untuk Kelola
        </Typography>
        <Grid container spacing={3}>
          {classroomStats.map((classData) => (
            <Grid item xs={12} sm={6} md={4} key={classData.grade}>
              <Card 
                sx={{ 
                  background: `linear-gradient(135deg, ${classData.status.color}20 0%, ${classData.status.color}10 100%)`,
                  border: `2px solid ${classData.status.color}40`,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    border: `2px solid ${classData.status.color}`,
                  }
                }}
              >
                <CardActionArea 
                  onClick={() => handleViewClassDetail(classData)}
                  sx={{ height: '100%' }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Typography variant="h6" fontWeight="bold">
                        📚 Kelas {classData.grade} SD
                      </Typography>
                      <Chip 
                        label={classData.status.text}
                        size="small"
                        sx={{ 
                          backgroundColor: classData.status.color,
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </Box>
                    
                    <Typography variant="body2" color="text.secondary" mb={2}>
                      👥 {classData.studentCount}/{MAX_CAPACITY} siswa
                    </Typography>
                    
                    <LinearProgress 
                      variant="determinate" 
                      value={Math.min(classData.percentage, 100)}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: '#f0f0f0',
                        mb: 2,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: classData.status.color,
                          borderRadius: 4,
                        }
                      }}
                    />
                    
                    <Typography variant="caption" color="text.secondary" mb={1} display="block">
                      📊 {classData.percentage.toFixed(1)}% kapasitas
                    </Typography>
                    
                    <Typography variant="body2" 
                      sx={{ 
                        color: classData.status.color, 
                        fontWeight: 'medium',
                        textAlign: 'center',
                        mt: 2,
                        p: 1,
                        backgroundColor: `${classData.status.color}10`,
                        borderRadius: 1
                      }}
                    >
                      🖱️ Klik untuk kelola room kelas
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* Quick Actions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          🚀 Aksi Cepat
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate('/students')}
              sx={{ py: 1.5 }}
            >
              Kelola Semua Siswa
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/grades')}
              sx={{ py: 1.5 }}
            >
              Input Nilai Siswa
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => window.location.reload()}
              sx={{ py: 1.5 }}
            >
              Refresh Data
            </Button>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Button
              fullWidth
              variant="outlined"
              onClick={() => navigate('/dashboard')}
              sx={{ py: 1.5 }}
            >
              Kembali ke Dashboard
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {/* Class Info Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          📚 Informasi Kelas {selectedClass?.grade} SD
        </DialogTitle>
        <DialogContent>
          {selectedClass && (
            <Box>
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2">
                  Status: <strong>{selectedClass.status.text}</strong> - 
                  {selectedClass.studentCount}/{MAX_CAPACITY} siswa ({selectedClass.percentage.toFixed(1)}%)
                </Typography>
              </Alert>
              
              <Typography variant="h6" gutterBottom>
                📊 Statistik Kelas
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Jumlah siswa: {selectedClass.studentCount} siswa
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Kapasitas maksimal: {MAX_CAPACITY} siswa
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Slot tersisa: {selectedClass.availableSlots} slot
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                • Persentase terisi: {selectedClass.percentage.toFixed(1)}%
              </Typography>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>
            Tutup
          </Button>
          {selectedClass && (
            <Button 
              variant="contained" 
              onClick={() => {
                handleViewClassDetail(selectedClass);
                setOpenDialog(false);
              }}
            >
              Lihat Detail Kelas
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ClassroomManagement;
