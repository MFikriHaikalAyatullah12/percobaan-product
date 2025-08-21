import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  Paper,
  Chip,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  IconButton,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  School as SchoolIcon,
  Groups as GroupsIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { api } from '../services/api';
import StudentList from '../components/students/StudentList';
import GradeList from '../components/grades/GradeList';
import toast from 'react-hot-toast';

const ClassroomDetailPage = () => {
  const { grade } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({
    totalStudents: 0,
    averageGrade: 0,
    subjects: 8,
    capacity: 35
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    fetchClassroomData();
  }, [grade]);

  const fetchClassroomData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch students for this class
      const studentsResponse = await api.get(`/students/demo?class=${grade}&limit=100`);
      if (studentsResponse.data.success) {
        const classStudents = studentsResponse.data.data.students || [];
        setStudents(classStudents);
        
        // Calculate stats
        setStats({
          totalStudents: classStudents.length,
          averageGrade: 85.5, // This could be calculated from actual grades
          subjects: subjects.length,
          capacity: 35
        });
      }
    } catch (error) {
      console.error('Error fetching classroom data:', error);
      setError('Gagal memuat data kelas');
      toast.error('Gagal memuat data kelas');
    } finally {
      setLoading(false);
    }
  };

  const getCapacityStatus = () => {
    const percentage = (stats.totalStudents / stats.capacity) * 100;
    if (percentage >= 100) return { color: '#f44336', text: 'Penuh', status: 'full' };
    if (percentage >= 80) return { color: '#ff9800', text: 'Hampir Penuh', status: 'warning' };
    return { color: '#4caf50', text: 'Tersedia', status: 'normal' };
  };

  const capacityInfo = getCapacityStatus();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box display="flex" alignItems="center" gap={2} mb={2}>
          <IconButton 
            onClick={handleBackToDashboard}
            sx={{ 
              backgroundColor: 'primary.main',
              color: 'white',
              '&:hover': { backgroundColor: 'primary.dark' }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1" fontWeight="bold" color="primary">
            📚 Room Kelas {grade} SD
          </Typography>
          <Chip 
            label={capacityInfo.text}
            sx={{ 
              backgroundColor: capacityInfo.color,
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>
        <Typography variant="body1" color="textSecondary">
          Kelola data siswa dan nilai untuk Kelas {grade} SD
        </Typography>
      </Box>

      {/* Statistics Cards */}
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
                    {stats.totalStudents}
                  </Typography>
                  <Typography variant="body2">
                    Total Siswa
                  </Typography>
                </Box>
                <PeopleIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {stats.capacity - stats.totalStudents}
                  </Typography>
                  <Typography variant="body2">
                    Slot Tersisa
                  </Typography>
                </Box>
                <GroupsIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {stats.subjects}
                  </Typography>
                  <Typography variant="body2">
                    Mata Pelajaran
                  </Typography>
                </Box>
                <SchoolIcon sx={{ fontSize: 40, opacity: 0.8 }} />
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
                    {stats.averageGrade}
                  </Typography>
                  <Typography variant="body2">
                    Rata-rata Nilai
                  </Typography>
                </Box>
                <TrendingUpIcon sx={{ fontSize: 40, opacity: 0.8 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Capacity Bar */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          📊 Kapasitas Kelas
        </Typography>
        <Box sx={{ mb: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="body1" fontWeight="medium">
              Kelas {grade} SD
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stats.totalStudents}/{stats.capacity} siswa ({((stats.totalStudents / stats.capacity) * 100).toFixed(1)}%)
            </Typography>
          </Box>
          <Box 
            sx={{ 
              width: '100%', 
              height: 12, 
              backgroundColor: '#f0f0f0',
              borderRadius: 6,
              overflow: 'hidden'
            }}
          >
            <Box 
              sx={{ 
                width: `${Math.min((stats.totalStudents / stats.capacity) * 100, 100)}%`,
                height: '100%',
                backgroundColor: capacityInfo.color,
                transition: 'width 0.3s ease'
              }}
            />
          </Box>
        </Box>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab 
            label="👥 Data Siswa" 
            icon={<PeopleIcon />}
            iconPosition="start"
          />
          <Tab 
            label="📊 Nilai & Rapor" 
            icon={<AssessmentIcon />}
            iconPosition="start"
          />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      <Box>
        {activeTab === 0 && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                👥 Daftar Siswa Kelas {grade} SD
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Kelola data siswa dalam kelas ini. Maksimal {stats.capacity} siswa per kelas.
              </Typography>
            </Box>
            <StudentList />
          </Paper>
        )}

        {activeTab === 1 && (
          <Paper sx={{ p: 3 }}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                📊 Nilai & Rapor Kelas {grade} SD
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Input dan kelola nilai untuk {subjects.length} mata pelajaran SD.
              </Typography>
            </Box>
            
            {/* Subjects List */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
              {subjects.map((subject, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ 
                    border: '2px solid #e0e0e0',
                    '&:hover': { 
                      borderColor: 'primary.main',
                      boxShadow: 2 
                    }
                  }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography variant="body2" fontWeight="medium">
                        📘 {subject}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            
            <GradeList />
          </Paper>
        )}
      </Box>

      {/* Quick Actions */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              🚀 Aksi Cepat
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PeopleIcon />}
                onClick={() => navigate(`/students?class=${grade}`)}
                sx={{ mb: 2 }}
              >
                Kelola Siswa Kelas {grade}
              </Button>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AssessmentIcon />}
                onClick={() => navigate(`/grades?class=${grade}`)}
              >
                Input Nilai Kelas {grade}
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              📋 Informasi Kelas
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                • Kapasitas maksimal: {stats.capacity} siswa
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                • Siswa terdaftar: {stats.totalStudents} siswa
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                • Mata pelajaran: {stats.subjects} mapel
              </Typography>
              <Typography variant="body2" color="text.secondary">
                • Status: {capacityInfo.text}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ClassroomDetailPage;
