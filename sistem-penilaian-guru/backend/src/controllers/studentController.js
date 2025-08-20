const Student = require('../models/Student');
const User = require('../models/User');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// Get all students for a teacher
exports.getAllStudents = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', class: className = '', academicYear = '' } = req.query;
        
        // Build query
        let query = { teacherId: req.userId, isActive: true };
        
        if (search) {
            query.$or = [
                { fullName: { $regex: search, $options: 'i' } },
                { nis: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }
        
        if (className) {
            query.class = className;
        }
        
        if (academicYear) {
            query.academicYear = academicYear;
        }

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        const students = await Student.find(query)
            .sort({ fullName: 1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('teacherId', 'fullName username');

        const total = await Student.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        res.status(200).json({
            success: true,
            message: 'Students retrieved successfully',
            data: {
                students,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalStudents: total,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Get students error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving students',
            error: error.message
        });
    }
};

// Get single student by ID
exports.getStudentById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const student = await Student.findOne({
            _id: id,
            teacherId: req.userId,
            isActive: true
        }).populate('teacherId', 'fullName username');

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Student retrieved successfully',
            data: { student }
        });

    } catch (error) {
        console.error('Get student error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving student',
            error: error.message
        });
    }
};

// Create new student
exports.createStudent = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const {
            nis,
            fullName,
            email,
            phoneNumber,
            dateOfBirth,
            gender,
            address,
            class: className,
            academicYear,
            subjects
        } = req.body;

        // Check if NIS already exists
        const existingStudent = await Student.findOne({ nis });
        if (existingStudent) {
            return res.status(400).json({
                success: false,
                message: 'Student with this NIS already exists'
            });
        }

        // Check if email already exists (if provided)
        if (email) {
            const existingEmail = await Student.findOne({ email });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Student with this email already exists'
                });
            }
        }

        // Create new student
        const newStudent = new Student({
            nis,
            fullName,
            email,
            phoneNumber,
            dateOfBirth,
            gender,
            address,
            class: className,
            academicYear,
            teacherId: req.userId,
            subjects: subjects || []
        });

        await newStudent.save();
        await newStudent.populate('teacherId', 'fullName username');

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: { student: newStudent }
        });

    } catch (error) {
        console.error('Create student error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating student',
            error: error.message
        });
    }
};

// Update student
exports.updateStudent = async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors',
                errors: errors.array()
            });
        }

        const { id } = req.params;
        const updateData = req.body;

        // Find student
        const student = await Student.findOne({
            _id: id,
            teacherId: req.userId,
            isActive: true
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Check if NIS is being updated and already exists
        if (updateData.nis && updateData.nis !== student.nis) {
            const existingNIS = await Student.findOne({ 
                nis: updateData.nis, 
                _id: { $ne: id } 
            });
            if (existingNIS) {
                return res.status(400).json({
                    success: false,
                    message: 'Student with this NIS already exists'
                });
            }
        }

        // Check if email is being updated and already exists
        if (updateData.email && updateData.email !== student.email) {
            const existingEmail = await Student.findOne({ 
                email: updateData.email, 
                _id: { $ne: id } 
            });
            if (existingEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Student with this email already exists'
                });
            }
        }

        // Update student
        Object.assign(student, updateData);
        await student.save();
        await student.populate('teacherId', 'fullName username');

        res.status(200).json({
            success: true,
            message: 'Student updated successfully',
            data: { student }
        });

    } catch (error) {
        console.error('Update student error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating student',
            error: error.message
        });
    }
};

// Delete student (soft delete)
exports.deleteStudent = async (req, res) => {
    try {
        const { id } = req.params;
        
        const student = await Student.findOne({
            _id: id,
            teacherId: req.userId,
            isActive: true
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found'
            });
        }

        // Soft delete
        student.isActive = false;
        await student.save();

        res.status(200).json({
            success: true,
            message: 'Student deleted successfully'
        });

    } catch (error) {
        console.error('Delete student error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting student',
            error: error.message
        });
    }
};

// Get students by class
exports.getStudentsByClass = async (req, res) => {
    try {
        const { className } = req.params;
        const { academicYear } = req.query;
        
        let query = { 
            teacherId: req.userId, 
            class: className, 
            isActive: true 
        };
        
        if (academicYear) {
            query.academicYear = academicYear;
        }

        const students = await Student.find(query)
            .sort({ fullName: 1 })
            .populate('teacherId', 'fullName username');

        res.status(200).json({
            success: true,
            message: 'Students retrieved successfully',
            data: { 
                students,
                count: students.length,
                class: className
            }
        });

    } catch (error) {
        console.error('Get students by class error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving students by class',
            error: error.message
        });
    }
};

// Get student statistics
exports.getStudentStats = async (req, res) => {
    try {
        const teacherId = req.userId;

        const stats = await Student.aggregate([
            { $match: { teacherId: mongoose.Types.ObjectId(teacherId), isActive: true } },
            {
                $group: {
                    _id: null,
                    totalStudents: { $sum: 1 },
                    maleStudents: { $sum: { $cond: [{ $eq: ['$gender', 'male'] }, 1, 0] } },
                    femaleStudents: { $sum: { $cond: [{ $eq: ['$gender', 'female'] }, 1, 0] } },
                    classes: { $addToSet: '$class' },
                    academicYears: { $addToSet: '$academicYear' }
                }
            }
        ]);

        const classStats = await Student.aggregate([
            { $match: { teacherId: mongoose.Types.ObjectId(teacherId), isActive: true } },
            {
                $group: {
                    _id: '$class',
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            message: 'Student statistics retrieved successfully',
            data: {
                overview: stats[0] || {
                    totalStudents: 0,
                    maleStudents: 0,
                    femaleStudents: 0,
                    classes: [],
                    academicYears: []
                },
                classBreakdown: classStats
            }
        });

    } catch (error) {
        console.error('Get student stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving student statistics',
            error: error.message
        });
    }
};