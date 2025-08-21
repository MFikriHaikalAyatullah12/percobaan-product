import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  People,
  Assessment,
  TrendingUp,
  School,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import GradeChart from '../components/dashboard/GradeChart';
import ClassRoomCard from '../components/classroom/ClassRoomCard';
import ClassroomManagement from '../components/classroom/ClassroomManagement';

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color === 'primary' ? '#1976d2' : color === 'success' ? '#2e7d32' : color === 'warning' ? '#ed6c02' : '#9c27b0'} 0%, ${color === 'primary' ? '#42a5f5' : color === 'success' ? '#66bb6a' : color === 'warning' ? '#ffb74d' : '#ba68c8'} 100%)`,
      color: 'white',
      boxShadow: 3,
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 1 }}>
            {value}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
        </Box>
        <Box sx={{ fontSize: '3rem', opacity: 0.8 }}>
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalSubjects: 0,
    totalGrades: 0,
    averageGrade: 0,
    classDistribution: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch students data
      const studentsResponse = await api.get('/students/demo?limit=1000');
      const students = studentsResponse.data.data?.students || [];
      
      // Calculate statistics
      const totalStudents = students.length;
      const classDistribution = {};
      
      // Count students per class
      students.forEach(student => {
        const grade = student.class || student.grade;
        if (grade) {
          classDistribution[grade] = (classDistribution[grade] || 0) + 1;
        }
      });
      
      setStats({
        totalStudents,
        totalSubjects: 8, // Static for SD subjects
        totalGrades: students.length * 8, // Approximate
        averageGrade: 85.2, // This could be calculated from actual grades
        classDistribution
      });
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
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
      {/* Welcome Section */}
      <Box 
        sx={{ 
          mb: 4, 
          p: 4,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: 3,
          color: 'white',
          textAlign: 'center',
          boxShadow: 3
        }}
      >
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
          🎓 Selamat Datang di Website Penilaian Guru! 🎓
        </Typography>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium', mb: 1 }}>
          Halo, {user?.fullName || 'User'}! 👋
        </Typography>
        <Typography variant="h6" sx={{ opacity: 0.9 }}>
          Kelola data siswa SD, nilai, dan laporan dengan mudah dan efisien
        </Typography>
        <Typography variant="body1" sx={{ mt: 2, opacity: 0.8 }}>
          📚 Sistem manajemen pendidikan untuk Sekolah Dasar (SD) kelas 1-6
        </Typography>
        <Typography variant="body1" sx={{ mt: 1, opacity: 0.8, fontStyle: 'italic' }}>
          ✨ "Mendidik adalah pekerjaan hati, bukan sekedar mengajar mata pelajaran" ✨
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Siswa"
            value={stats.totalStudents}
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mata Pelajaran"
            value={stats.totalSubjects}
            icon={<School />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Nilai"
            value={stats.totalGrades.toLocaleString()}
            icon={<Assessment />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rata-rata Kelas"
            value={stats.averageGrade}
            icon={<TrendingUp />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Class Distribution and Chart */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '350px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              📊 Distribusi Siswa per Kelas SD
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[1, 2, 3, 4, 5, 6].map(grade => {
                const count = stats.classDistribution[grade.toString()] || 0;
                const percentage = stats.totalStudents > 0 ? (count / stats.totalStudents * 100) : 0;
                const capacityPercentage = (count / 35) * 100;
                
                return (
                  <Box key={grade} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body2" fontWeight="medium">
                        Kelas {grade} SD
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {count}/35 siswa ({capacityPercentage.toFixed(1)}%)
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        height: 8, 
                        backgroundColor: '#f0f0f0',
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: `${Math.min(capacityPercentage, 100)}%`,
                          height: '100%',
                          backgroundColor: capacityPercentage >= 100 ? '#f44336' : 
                                         capacityPercentage >= 80 ? '#ff9800' : '#4caf50',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '350px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              📈 Grafik Nilai Siswa
            </Typography>
            <Box sx={{ mt: 2, height: '280px' }}>
              <GradeChart />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Room Kelas SD Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          🏫 Room Kelas SD - Akses & Kelola Data Siswa
        </Typography>
        <Grid container spacing={3}>
          {[1, 2, 3, 4, 5, 6].map(grade => {
            const studentCount = stats.classDistribution[grade.toString()] || 0;
            
            return (
              <Grid item xs={12} sm={6} md={4} key={grade}>
                <ClassRoomCard
                  grade={grade}
                  studentCount={studentCount}
                  maxCapacity={35}
                />
              </Grid>
            );
          })}
        </Grid>
      </Box>

      {/* Classroom Management Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
          📊 Manajemen Classroom - Monitoring & Kontrol
        </Typography>
        <ClassroomManagement />
      </Box>

      {/* Charts and Statistics */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '350px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              � Distribusi Siswa per Kelas
            </Typography>
            <Box sx={{ mt: 2 }}>
              {[1, 2, 3, 4, 5, 6].map(grade => {
                const count = stats.classDistribution[grade.toString()] || 0;
                const capacityPercentage = (count / 35) * 100;
                
                return (
                  <Box key={grade} sx={{ mb: 2 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="body1" fontWeight="medium">
                        Kelas {grade} SD
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {count}/35 siswa
                      </Typography>
                    </Box>
                    <Box 
                      sx={{ 
                        width: '100%', 
                        height: 8, 
                        backgroundColor: '#f0f0f0',
                        borderRadius: 4,
                        overflow: 'hidden'
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: `${Math.min(capacityPercentage, 100)}%`,
                          height: '100%',
                          backgroundColor: capacityPercentage >= 100 ? '#f44336' : 
                                         capacityPercentage >= 80 ? '#ff9800' : '#4caf50',
                          transition: 'width 0.3s ease'
                        }}
                      />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '350px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              📈 Grafik Nilai Siswa
            </Typography>
            <Box sx={{ mt: 2, height: '280px' }}>
              <GradeChart />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Quick Info */}
      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '200px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              🚀 Aksi Cepat
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                • Klik "Kelola Siswa" untuk menambah/edit data siswa
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Klik "Nilai" untuk input nilai per kelas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Sistem otomatis cek kapasitas 35 siswa/kelas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Data tersimpan otomatis di database
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '200px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
              📋 Info Sistem SD
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                • Kapasitas maksimal: 35 siswa per kelas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Total kelas tersedia: 6 kelas (1-6 SD)
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Mata pelajaran: 8 mapel wajib SD
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                • Room kelas dapat diakses langsung
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
