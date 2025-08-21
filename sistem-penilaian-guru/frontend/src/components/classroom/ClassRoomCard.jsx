import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  Chip,
  LinearProgress,
  IconButton,
} from '@mui/material';
import {
  Groups as GroupsIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Assessment as AssessmentIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const ClassRoomCard = ({ 
  grade, 
  studentCount = 0, 
  maxCapacity = 35,
  onViewStudents,
  onManageGrades 
}) => {
  const navigate = useNavigate();
  const percentage = (studentCount / maxCapacity) * 100;
  
  const getStatusColor = () => {
    if (percentage >= 100) return '#f44336'; // Red
    if (percentage >= 80) return '#ff9800';  // Orange
    return '#4caf50'; // Green
  };

  const getStatusText = () => {
    if (percentage >= 100) return 'Penuh';
    if (percentage >= 80) return 'Hampir Penuh';
    return 'Tersedia';
  };

  const handleViewStudents = () => {
    navigate(`/students?class=${grade}`);
  };

  const handleManageGrades = () => {
    navigate(`/grades?class=${grade}`);
  };

  const handleViewDetail = () => {
    navigate(`/classroom/${grade}`);
  };

  return (
    <Card 
      sx={{ 
        height: '100%',
        background: `linear-gradient(135deg, ${getStatusColor()}20 0%, ${getStatusColor()}10 100%)`,
        border: `2px solid ${getStatusColor()}40`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6,
          border: `2px solid ${getStatusColor()}60`,
        }
      }}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight="bold" color="primary">
            📚 Kelas {grade} SD
          </Typography>
          <Chip 
            label={getStatusText()}
            size="small"
            sx={{ 
              backgroundColor: getStatusColor(),
              color: 'white',
              fontWeight: 'bold'
            }}
          />
        </Box>

        {/* Student Count */}
        <Box mb={2}>
          <Box display="flex" alignItems="center" mb={1}>
            <GroupsIcon sx={{ mr: 1, color: 'text.secondary' }} />
            <Typography variant="h6" fontWeight="bold">
              {studentCount} / {maxCapacity} Siswa
            </Typography>
          </Box>
          
          {/* Progress Bar */}
          <Box sx={{ width: '100%' }}>
            <LinearProgress 
              variant="determinate" 
              value={Math.min(percentage, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getStatusColor(),
                  borderRadius: 4,
                }
              }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
              {percentage.toFixed(1)}% dari kapasitas
            </Typography>
          </Box>
        </Box>

        {/* Quick Stats */}
        <Box 
          sx={{ 
            p: 1.5, 
            backgroundColor: 'rgba(255,255,255,0.7)', 
            borderRadius: 2,
            mb: 1
          }}
        >
          <Typography variant="body2" color="text.secondary">
            🎯 Kapasitas: {maxCapacity - studentCount} slot tersisa
          </Typography>
          <Typography variant="body2" color="text.secondary">
            📊 Status: {getStatusText()}
          </Typography>
        </Box>
      </CardContent>

      <CardActions sx={{ pt: 0, px: 2, pb: 2, flexDirection: 'column', gap: 1 }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<ViewIcon />}
          onClick={handleViewDetail}
          sx={{ 
            background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
            }
          }}
        >
          Detail Room Kelas
        </Button>
        
        <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={handleViewStudents}
            sx={{ 
              borderColor: getStatusColor(),
              color: getStatusColor(),
              '&:hover': {
                backgroundColor: `${getStatusColor()}10`,
                borderColor: getStatusColor(),
              }
            }}
          >
            Kelola Siswa
          </Button>
          
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AssessmentIcon />}
            onClick={handleManageGrades}
            sx={{ 
              borderColor: getStatusColor(),
              color: getStatusColor(),
              '&:hover': {
                backgroundColor: `${getStatusColor()}10`,
                borderColor: getStatusColor(),
              }
            }}
          >
            Nilai
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};

export default ClassRoomCard;
