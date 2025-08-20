import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Divider,
} from '@mui/material';
import {
  MoreVert as MoreVertIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  CalendarToday as CalendarIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from '@mui/icons-material';

const StudentCard = ({ student, onEdit, onDelete }) => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        onEdit(student);
        handleMenuClose();
    };

    const handleDelete = () => {
        onDelete(student);
        handleMenuClose();
    };

    const getInitials = (name) => {
        return name
            ?.split(' ')
            .map(word => word[0])
            .join('')
            .substring(0, 2)
            .toUpperCase() || 'NA';
    };

    const getGenderColor = (gender) => {
        switch (gender) {
            case 'male':
                return '#1976d2';
            case 'female':
                return '#d32f2f';
            default:
                return '#757575';
        }
    };

    return (
        <Card 
            sx={{ 
                height: '100%',
                transition: 'all 0.2s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                },
                borderRadius: 2,
                position: 'relative',
            }}
        >
            <CardContent sx={{ p: 3 }}>
                {/* Header with Avatar and Menu */}
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                            sx={{ 
                                bgcolor: getGenderColor(student.gender),
                                width: 50,
                                height: 50,
                                fontSize: '1.2rem',
                                fontWeight: 'bold'
                            }}
                        >
                            {getInitials(student.fullName)}
                        </Avatar>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" sx={{ lineHeight: 1.2 }}>
                                {student.fullName || 'Nama Belum Diisi'}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                NIS: {student.nis || '-'}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <IconButton
                        aria-label="more options"
                        onClick={handleMenuClick}
                        size="small"
                    >
                        <MoreVertIcon />
                    </IconButton>
                </Box>

                <Divider sx={{ mb: 2 }} />

                {/* Student Info */}
                <Box sx={{ space: 1.5 }}>
                    {/* Class and Academic Year */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                        <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="textSecondary">
                            Kelas {student.class || '-'} • {student.academicYear || '-'}
                        </Typography>
                    </Box>

                    {/* Email */}
                    {student.email && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="textSecondary" sx={{ 
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {student.email}
                            </Typography>
                        </Box>
                    )}

                    {/* Phone */}
                    {student.phoneNumber && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="textSecondary">
                                {student.phoneNumber}
                            </Typography>
                        </Box>
                    )}

                    {/* Date of Birth */}
                    {student.dateOfBirth && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                            <CalendarIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="body2" color="textSecondary">
                                {new Date(student.dateOfBirth).toLocaleDateString('id-ID')}
                            </Typography>
                        </Box>
                    )}

                    {/* Gender Chip */}
                    <Box sx={{ mt: 2 }}>
                        <Chip 
                            label={student.gender === 'male' ? 'Laki-laki' : student.gender === 'female' ? 'Perempuan' : 'Tidak Diketahui'}
                            size="small"
                            color={student.gender === 'male' ? 'primary' : student.gender === 'female' ? 'secondary' : 'default'}
                            variant="outlined"
                        />
                    </Box>

                    {/* Address */}
                    {student.address && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="caption" color="textSecondary" fontWeight="bold">
                                Alamat:
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                lineHeight: 1.4,
                                mt: 0.5
                            }}>
                                {student.address}
                            </Typography>
                        </Box>
                    )}
                </Box>
            </CardContent>

            {/* Menu */}
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleMenuClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
                <MenuItem onClick={handleEdit}>
                    <EditIcon sx={{ mr: 1, fontSize: 20 }} />
                    Edit
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <DeleteIcon sx={{ mr: 1, fontSize: 20 }} />
                    Hapus
                </MenuItem>
            </Menu>
        </Card>
    );
};

export default StudentCard;