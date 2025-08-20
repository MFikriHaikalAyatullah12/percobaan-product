const Grade = require('../models/Grade');
const Student = require('../models/Student');
const mongoose = require('mongoose');
const { validationResult } = require('express-validator');

// Get all grades for a teacher
exports.getAllGrades = async (req, res) => {
    try {
        const { 
            page = 1, 
            limit = 10, 
            subject = '', 
            class: className = '', 
            academicYear = '', 
            semester = '',
            gradeType = '',
            studentId = ''
        } = req.query;
        
        // Build query
        let query = { teacherId: req.userId };
        
        if (subject) query.subject = subject;
        if (className) query.class = className;
        if (academicYear) query.academicYear = academicYear;
        if (semester) query.semester = semester;
        if (gradeType) query.gradeType = gradeType;
        if (studentId) query.studentId = studentId;

        // Calculate pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);
        
        const grades = await Grade.find(query)
            .sort({ date: -1, createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('studentId', 'fullName nis class')
            .populate('teacherId', 'fullName username');

        const total = await Grade.countDocuments(query);
        const totalPages = Math.ceil(total / parseInt(limit));

        res.status(200).json({
            success: true,
            message: 'Grades retrieved successfully',
            data: {
                grades,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages,
                    totalGrades: total,
                    hasNextPage: parseInt(page) < totalPages,
                    hasPrevPage: parseInt(page) > 1
                }
            }
        });

    } catch (error) {
        console.error('Get grades error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving grades',
            error: error.message
        });
    }
};

// Get single grade by ID
exports.getGradeById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const grade = await Grade.findOne({
            _id: id,
            teacherId: req.userId
        })
        .populate('studentId', 'fullName nis class email')
        .populate('teacherId', 'fullName username');

        if (!grade) {
            return res.status(404).json({
                success: false,
                message: 'Grade not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Grade retrieved successfully',
            data: { grade }
        });

    } catch (error) {
        console.error('Get grade error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving grade',
            error: error.message
        });
    }
};

// Create new grade
exports.createGrade = async (req, res) => {
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
            studentId,
            subject,
            gradeType,
            score,
            maxScore = 100,
            weight = 1,
            class: className,
            academicYear,
            semester,
            date,
            description,
            notes
        } = req.body;

        // Verify student belongs to this teacher
        const student = await Student.findOne({
            _id: studentId,
            teacherId: req.userId,
            isActive: true
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found or does not belong to this teacher'
            });
        }

        // Validate score
        if (score < 0 || score > maxScore) {
            return res.status(400).json({
                success: false,
                message: `Score must be between 0 and ${maxScore}`
            });
        }

        // Create new grade
        const newGrade = new Grade({
            studentId,
            teacherId: req.userId,
            subject,
            gradeType,
            score,
            maxScore,
            weight,
            class: className || student.class,
            academicYear: academicYear || student.academicYear,
            semester,
            date: date || new Date(),
            description,
            notes
        });

        await newGrade.save();
        await newGrade.populate('studentId', 'fullName nis class');
        await newGrade.populate('teacherId', 'fullName username');

        res.status(201).json({
            success: true,
            message: 'Grade created successfully',
            data: { grade: newGrade }
        });

    } catch (error) {
        console.error('Create grade error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating grade',
            error: error.message
        });
    }
};

// Update grade
exports.updateGrade = async (req, res) => {
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

        // Find grade
        const grade = await Grade.findOne({
            _id: id,
            teacherId: req.userId
        });

        if (!grade) {
            return res.status(404).json({
                success: false,
                message: 'Grade not found'
            });
        }

        // Validate score if being updated
        if (updateData.score !== undefined) {
            const maxScore = updateData.maxScore || grade.maxScore;
            if (updateData.score < 0 || updateData.score > maxScore) {
                return res.status(400).json({
                    success: false,
                    message: `Score must be between 0 and ${maxScore}`
                });
            }
        }

        // Update grade
        Object.assign(grade, updateData);
        await grade.save();
        await grade.populate('studentId', 'fullName nis class');
        await grade.populate('teacherId', 'fullName username');

        res.status(200).json({
            success: true,
            message: 'Grade updated successfully',
            data: { grade }
        });

    } catch (error) {
        console.error('Update grade error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating grade',
            error: error.message
        });
    }
};

// Delete grade
exports.deleteGrade = async (req, res) => {
    try {
        const { id } = req.params;
        
        const grade = await Grade.findOne({
            _id: id,
            teacherId: req.userId
        });

        if (!grade) {
            return res.status(404).json({
                success: false,
                message: 'Grade not found'
            });
        }

        await Grade.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: 'Grade deleted successfully'
        });

    } catch (error) {
        console.error('Delete grade error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting grade',
            error: error.message
        });
    }
};

// Get grades by student
exports.getGradesByStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { subject, academicYear, semester } = req.query;

        // Verify student belongs to this teacher
        const student = await Student.findOne({
            _id: studentId,
            teacherId: req.userId,
            isActive: true
        });

        if (!student) {
            return res.status(404).json({
                success: false,
                message: 'Student not found or does not belong to this teacher'
            });
        }

        let query = { studentId, teacherId: req.userId };
        if (subject) query.subject = subject;
        if (academicYear) query.academicYear = academicYear;
        if (semester) query.semester = semester;

        const grades = await Grade.find(query)
            .sort({ date: -1 })
            .populate('teacherId', 'fullName username');

        // Calculate statistics
        const stats = await Grade.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalGrades: { $sum: 1 },
                    averageScore: { $avg: '$score' },
                    highestScore: { $max: '$score' },
                    lowestScore: { $min: '$score' },
                    subjects: { $addToSet: '$subject' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Student grades retrieved successfully',
            data: {
                student: {
                    id: student._id,
                    fullName: student.fullName,
                    nis: student.nis,
                    class: student.class
                },
                grades,
                statistics: stats[0] || {
                    totalGrades: 0,
                    averageScore: 0,
                    highestScore: 0,
                    lowestScore: 0,
                    subjects: []
                }
            }
        });

    } catch (error) {
        console.error('Get grades by student error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving student grades',
            error: error.message
        });
    }
};

// Get grades by subject
exports.getGradesBySubject = async (req, res) => {
    try {
        const { subject } = req.params;
        const { class: className, academicYear, semester } = req.query;

        let query = { teacherId: req.userId, subject };
        if (className) query.class = className;
        if (academicYear) query.academicYear = academicYear;
        if (semester) query.semester = semester;

        const grades = await Grade.find(query)
            .sort({ date: -1 })
            .populate('studentId', 'fullName nis class');

        // Calculate class statistics
        const stats = await Grade.aggregate([
            { $match: query },
            {
                $group: {
                    _id: null,
                    totalGrades: { $sum: 1 },
                    averageScore: { $avg: '$score' },
                    highestScore: { $max: '$score' },
                    lowestScore: { $min: '$score' },
                    uniqueStudents: { $addToSet: '$studentId' }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Subject grades retrieved successfully',
            data: {
                subject,
                grades,
                statistics: stats[0] ? {
                    ...stats[0],
                    uniqueStudents: stats[0].uniqueStudents.length
                } : {
                    totalGrades: 0,
                    averageScore: 0,
                    highestScore: 0,
                    lowestScore: 0,
                    uniqueStudents: 0
                }
            }
        });

    } catch (error) {
        console.error('Get grades by subject error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving subject grades',
            error: error.message
        });
    }
};

// Get grade statistics dashboard
exports.getGradeStats = async (req, res) => {
    try {
        const teacherId = req.userId;
        const { academicYear, semester } = req.query;

        let matchQuery = { teacherId: mongoose.Types.ObjectId(teacherId) };
        if (academicYear) matchQuery.academicYear = academicYear;
        if (semester) matchQuery.semester = semester;

        // Overall statistics
        const overallStats = await Grade.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: null,
                    totalGrades: { $sum: 1 },
                    averageScore: { $avg: '$score' },
                    highestScore: { $max: '$score' },
                    lowestScore: { $min: '$score' },
                    subjects: { $addToSet: '$subject' },
                    classes: { $addToSet: '$class' }
                }
            }
        ]);

        // Subject-wise statistics
        const subjectStats = await Grade.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$subject',
                    totalGrades: { $sum: 1 },
                    averageScore: { $avg: '$score' },
                    highestScore: { $max: '$score' },
                    lowestScore: { $min: '$score' }
                }
            },
            { $sort: { averageScore: -1 } }
        ]);

        // Class-wise statistics
        const classStats = await Grade.aggregate([
            { $match: matchQuery },
            {
                $group: {
                    _id: '$class',
                    totalGrades: { $sum: 1 },
                    averageScore: { $avg: '$score' },
                    uniqueStudents: { $addToSet: '$studentId' }
                }
            },
            {
                $project: {
                    _id: 1,
                    totalGrades: 1,
                    averageScore: 1,
                    studentCount: { $size: '$uniqueStudents' }
                }
            },
            { $sort: { averageScore: -1 } }
        ]);

        // Grade distribution
        const gradeDistribution = await Grade.aggregate([
            { $match: matchQuery },
            {
                $bucket: {
                    groupBy: '$score',
                    boundaries: [0, 60, 70, 80, 90, 100],
                    default: 'Other',
                    output: {
                        count: { $sum: 1 },
                        percentage: { $avg: '$score' }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Grade statistics retrieved successfully',
            data: {
                overall: overallStats[0] || {
                    totalGrades: 0,
                    averageScore: 0,
                    highestScore: 0,
                    lowestScore: 0,
                    subjects: [],
                    classes: []
                },
                bySubject: subjectStats,
                byClass: classStats,
                distribution: gradeDistribution
            }
        });

    } catch (error) {
        console.error('Get grade stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving grade statistics',
            error: error.message
        });
    }
};

// Bulk create grades (for multiple students at once)
exports.bulkCreateGrades = async (req, res) => {
    try {
        const { grades } = req.body; // Array of grade objects

        if (!Array.isArray(grades) || grades.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Grades array is required and cannot be empty'
            });
        }

        // Validate each grade and add teacher ID
        const processedGrades = [];
        const errors = [];

        for (let i = 0; i < grades.length; i++) {
            const gradeData = grades[i];
            
            // Verify student belongs to this teacher
            const student = await Student.findOne({
                _id: gradeData.studentId,
                teacherId: req.userId,
                isActive: true
            });

            if (!student) {
                errors.push(`Grade ${i + 1}: Student not found or does not belong to this teacher`);
                continue;
            }

            // Validate score
            const maxScore = gradeData.maxScore || 100;
            if (gradeData.score < 0 || gradeData.score > maxScore) {
                errors.push(`Grade ${i + 1}: Score must be between 0 and ${maxScore}`);
                continue;
            }

            processedGrades.push({
                ...gradeData,
                teacherId: req.userId,
                class: gradeData.class || student.class,
                academicYear: gradeData.academicYear || student.academicYear,
                date: gradeData.date || new Date()
            });
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Validation errors found',
                errors
            });
        }

        // Insert grades
        const createdGrades = await Grade.insertMany(processedGrades);

        res.status(201).json({
            success: true,
            message: `${createdGrades.length} grades created successfully`,
            data: { grades: createdGrades }
        });

    } catch (error) {
        console.error('Bulk create grades error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating grades',
            error: error.message
        });
    }
};