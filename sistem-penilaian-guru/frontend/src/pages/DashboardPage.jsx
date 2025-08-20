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

const StatCard = ({ title, value, icon, color = 'primary' }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="h2">
            {value}
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}.light`,
            borderRadius: '50%',
            p: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {React.cloneElement(icon, { sx: { color: `${color}.main` } })}
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
        
        // Fetch dashboard statistics
        const statsResponse = await api.get('/dashboard/stats');
        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }

        // Fetch recent grades for chart
        const gradesResponse = await api.get('/grades?limit=10');
        if (gradesResponse.data.success) {
          setRecentGrades(gradesResponse.data.data.grades || []);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

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
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Selamat datang, {user?.name}! Berikut adalah ringkasan sistem penilaian Anda.
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
            title="Total Nilai"
            value={stats.totalGrades}
            icon={<Assessment />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Rata-rata Nilai"
            value={stats.averageGrade ? stats.averageGrade.toFixed(1) : '0'}
            icon={<TrendingUp />}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Mata Pelajaran"
            value={stats.totalSubjects}
            icon={<School />}
            color="warning"
          />
        </Grid>
      </Grid>

      {/* Charts and Recent Activity */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Grafik Nilai Terbaru
            </Typography>
            {recentGrades.length > 0 ? (
              <GradeChart grades={recentGrades} />
            ) : (
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="300px"
              >
                <Typography color="textSecondary">
                  Belum ada data nilai untuk ditampilkan
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Aktivitas Terbaru
            </Typography>
            <Box>
              {recentGrades.slice(0, 5).map((grade, index) => (
                <Box
                  key={grade._id || index}
                  sx={{
                    py: 1,
                    borderBottom: index < 4 ? '1px solid #e0e0e0' : 'none',
                  }}
                >
                  <Typography variant="body2" component="div">
                    <strong>{grade.studentName || 'Siswa'}</strong>
                  </Typography>
                  <Typography variant="caption" color="textSecondary">
                    {grade.subject} - Nilai: {grade.grade}
                  </Typography>
                </Box>
              ))}
              {recentGrades.length === 0 && (
                <Typography color="textSecondary" variant="body2">
                  Belum ada aktivitas penilaian
                </Typography>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default DashboardPage;