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
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Chip,
  LinearProgress,
} from '@mui/material';
import {
  People,
  Assessment,
  TrendingUp,
  School,
  Star,
  Warning,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../services/api';
import GradeChart from '../components/dashboard/GradeChart';

const StatCard = ({ title, value, icon, color = 'primary', subtitle }) => (
  <Card 
    sx={{ 
      height: '100%',
      background: `linear-gradient(135deg, ${color === 'primary' ? '#1976d2' : color === 'success' ? '#2e7d32' : color === 'warning' ? '#ed6c02' : '#9c27b0'} 0%, ${color === 'primary' ? '#42a5f5' : color === 'success' ? '#66bb6a' : color === 'warning' ? '#ffb74d' : '#ba68c8'} 100%)`,
      color: 'white',
      boxShadow: 3,
      transition: 'transform 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6
      }
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="inherit" gutterBottom variant="body2" sx={{ opacity: 0.9 }}>
            {title}
          </Typography>
          <Typography variant="h3" component="h2" fontWeight="bold">
            {value}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ opacity: 0.8, mt: 1 }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '50%',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon, { sx: { color: 'white', fontSize: 40 } })}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalGrades: 0,
    averageGrade: 0,
    totalSubjects: 0,
  });
  const [recentGrades, setRecentGrades] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Fetch students untuk statistik
        const studentsResponse = await api.get('/students');
        const students = studentsResponse.data?.data?.students || [];
        
        // Fetch grades untuk statistik
        const gradesResponse = await api.get('/grades');
        const grades = gradesResponse.data?.data?.grades || [];
        
        // Hitung statistik
        const totalStudents = students.length;
        const totalGrades = grades.length;
        const averageGrade = grades.length > 0 
          ? grades.reduce((sum, grade) => sum + (grade.score || 0), 0) / grades.length
          : 0;
        
        setStats({
          totalStudents,
          totalGrades,
          averageGrade,
          totalSubjects: user?.subjects?.length || 0,
        });
        
        setRecentGrades(grades.slice(0, 10));
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        // Set default values jika error
        setStats({
          totalStudents: 0,
          totalGrades: 0,
          averageGrade: 0,
          totalSubjects: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <Container>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="400px"
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold" color="primary">
          Dashboard Sistem Penilaian
        </Typography>
        <Typography variant="h6" color="textSecondary">
          Selamat datang, {user?.fullName || user?.username}! 👋
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mt: 1 }}>
          Berikut adalah ringkasan aktivitas penilaian Anda hari ini
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Siswa"
            value={stats.totalStudents || 0}
            subtitle="Siswa aktif"
            icon={<People />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Nilai"
            value={stats.totalGrades || 0}
            subtitle="Nilai terinput"
            icon={<Assessment />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rata-rata Nilai"
            value={stats.averageGrade ? Math.round(stats.averageGrade * 10) / 10 : 0}
            subtitle="Nilai keseluruhan"
            icon={<TrendingUp />}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Mata Pelajaran"
            value={stats.totalSubjects || 0}
            subtitle="Subjek diajar"
            icon={<School />}
            color="secondary"
          />
        </Grid>
      </Grid>

      {/* Main Content Grid */}
      <Grid container spacing={3}>
        {/* Chart Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              📊 Grafik Perkembangan Nilai
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {recentGrades.length > 0 ? (
              <GradeChart data={recentGrades} />
            ) : (
              <Box 
                display="flex" 
                flexDirection="column" 
                alignItems="center" 
                justifyContent="center" 
                height={300}
              >
                <Assessment sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="textSecondary">
                  Belum ada data nilai
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Mulai input nilai siswa untuk melihat grafik
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              📝 Aktivitas Terbaru
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List sx={{ maxHeight: 300, overflow: 'auto' }}>
              {recentGrades.length > 0 ? (
                recentGrades.slice(0, 5).map((grade, index) => (
                  <ListItem key={index} divider>
                    <ListItemIcon>
                      <Star color={grade.score >= 80 ? 'success' : grade.score >= 70 ? 'warning' : 'error'} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2" fontWeight="medium">
                            {grade.studentName || 'Siswa'}
                          </Typography>
                          <Chip 
                            label={grade.score || 0} 
                            size="small" 
                            color={grade.score >= 80 ? 'success' : grade.score >= 70 ? 'warning' : 'error'} 
                          />
                        </Box>
                      }
                      secondary={
                        <Box>
                          <Typography variant="caption" color="textSecondary">
                            {grade.subject || 'Mata Pelajaran'}
                          </Typography>
                          <br />
                          <Typography variant="caption" color="textSecondary">
                            {grade.date ? new Date(grade.date).toLocaleDateString('id-ID') : 'Hari ini'}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))
              ) : (
                <Box 
                  display="flex" 
                  flexDirection="column" 
                  alignItems="center" 
                  justifyContent="center" 
                  height={200}
                >
                  <Schedule sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="textSecondary" align="center">
                    Belum ada aktivitas terbaru
                  </Typography>
                </Box>
              )}
            </List>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3, borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              🚀 Aksi Cepat
            </Typography>
            <Divider sx={{ mb: 3 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-2px)', 
                      boxShadow: 4 
                    } 
                  }}
                  onClick={() => window.location.href = '/students'}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <People sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Kelola Siswa
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Tambah & edit data siswa
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-2px)', 
                      boxShadow: 4 
                    } 
                  }}
                  onClick={() => window.location.href = '/grades'}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <Assessment sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Input Nilai
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Masukkan nilai siswa
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-2px)', 
                      boxShadow: 4 
                    } 
                  }}
                  onClick={() => window.location.href = '/profile'}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <School sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Profil Saya
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Kelola profil guru
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              
              <Grid item xs={12} sm={6} md={3}>
                <Card 
                  sx={{ 
                    cursor: 'pointer', 
                    transition: 'all 0.2s',
                    '&:hover': { 
                      transform: 'translateY(-2px)', 
                      boxShadow: 4 
                    } 
                  }}
                >
                  <CardContent sx={{ textAlign: 'center', py: 3 }}>
                    <TrendingUp sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                    <Typography variant="h6" fontWeight="bold">
                      Laporan
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Lihat laporan nilai
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;
