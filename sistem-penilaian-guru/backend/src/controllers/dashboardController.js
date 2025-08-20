const Student = require('../models/Student');
const Grade = require('../models/Grade');
const Subject = require('../models/Subject');
const mongoose = require('mongoose');

// Get dashboard overview for teacher
exports.getDashboardOverview = async (req, res) => {
    try {
        const teacherId = req.userId;
        const { academicYear, semester } = req.query;

        // Build base query
        let gradeQuery = { teacherId: mongoose.Types.ObjectId(teacherId) };
        let studentQuery = { teacherId: mongoose.Types.ObjectId(teacherId), isActive: true };

        if (academicYear) {
            gradeQuery.academicYear = academicYear;
            studentQuery.academicYear = academicYear;
        }
        if (semester) {
            gradeQuery.semester = semester;
        }

        // Get student statistics
        const studentStats = await Student.aggregate([
            { $match: studentQuery },
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

        // Get grade statistics
        const gradeStats = await Grade.aggregate([
            { $match: gradeQuery },
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

        // Get recent grades (last 10)
        const recentGrades = await Grade.find(gradeQuery)
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('studentId', 'fullName nis class')
            .select('subject gradeType score maxScore date');

        // Get class performance
        const classPerformance = await Grade.aggregate([
            { $match: gradeQuery },
            {
                $group: {
                    _id: '$class',
                    averageScore: { $avg: '$score' },
                    totalGrades: { $sum: 1 },
                    students: { $addToSet: '$studentId' }
                }
            },
            {
                $project: {
                    class: '$_id',
                    averageScore: { $round: ['$averageScore', 2] },
                    totalGrades: 1,
                    studentCount: { $size: '$students' }
                }
            },
            { $sort: { averageScore: -1 } }
        ]);

        // Get subject performance
        const subjectPerformance = await Grade.aggregate([
            { $match: gradeQuery },
            {
                $group: {
                    _id: '$subject',
                    averageScore: { $avg: '$score' },
                    totalGrades: { $sum: 1 },
                    highestScore: { $max: '$score' },
                    lowestScore: { $min: '$score' }
                }
            },
            {
                $project: {
                    subject: '$_id',
                    averageScore: { $round: ['$averageScore', 2] },
                    totalGrades: 1,
                    highestScore: 1,
                    lowestScore: 1
                }
            },
            { $sort: { averageScore: -1 } }
        ]);

        // Get grade distribution
        const gradeDistribution = await Grade.aggregate([
            { $match: gradeQuery },
            {
                $bucket: {
                    groupBy: { $multiply: [{ $divide: ['$score', '$maxScore'] }, 100] },
                    boundaries: [0, 60, 70, 80, 90, 100],
                    default: 'Other',
                    output: {
                        count: { $sum: 1 },
                        students: { $addToSet: '$studentId' }
                    }
                }
            },
            {
                $project: {
                    range: '$_id',
                    count: 1,
                    uniqueStudents: { $size: '$students' }
                }
            }
        ]);

        // Get top performing students
        const topStudents = await Grade.aggregate([
            { $match: gradeQuery },
            {
                $group: {
                    _id: '$studentId',
                    averageScore: { $avg: { $multiply: [{ $divide: ['$score', '$maxScore'] }, 100] } },
                    totalGrades: { $sum: 1 }
                }
            },
            {
                $match: { totalGrades: { $gte: 3 } } // At least 3 grades
            },
            { $sort: { averageScore: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'students',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'student'
                }
            },
            { $unwind: '$student' },
            {
                $project: {
                    studentId: '$_id',
                    fullName: '$student.fullName',
                    nis: '$student.nis',
                    class: '$student.class',
                    averageScore: { $round: ['$averageScore', 2] },
                    totalGrades: 1
                }
            }
        ]);

        res.status(200).json({
            success: true,
            message: 'Dashboard overview retrieved successfully',
            data: {
                overview: {
                    students: studentStats[0] || {
                        totalStudents: 0,
                        maleStudents: 0,
                        femaleStudents: 0,
                        classes: [],
                        academicYears: []
                    },
                    grades: gradeStats[0] || {
                        totalGrades: 0,
                        averageScore: 0,
                        highestScore: 0,
                        lowestScore: 0,
                        subjects: []
                    }
                },
                recentGrades,
                classPerformance,
                subjectPerformance,
                gradeDistribution,
                topStudents
            }
        });

    } catch (error) {
        console.error('Get dashboard overview error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving dashboard overview',
            error: error.message
        });
    }
};

// Get monthly grade trends
exports.getGradeTrends = async (req, res) => {
    try {
        const teacherId = req.userId;
        const { academicYear, subject } = req.query;

        let query = { teacherId: mongoose.Types.ObjectId(teacherId) };
        if (academicYear) query.academicYear = academicYear;
        if (subject) query.subject = subject;

        const trends = await Grade.aggregate([
            { $match: query },
            {
                $group: {
                    _id: {
                        year: { $year: '$date' },
                        month: { $month: '$date' }
                    },
                    averageScore: { $avg: '$score' },
                    totalGrades: { $sum: 1 },
                    uniqueStudents: { $addToSet: '$studentId' }
                }
            },
            {
                $project: {
                    year: '$_id.year',
                    month: '$_id.month',
                    averageScore: { $round: ['$averageScore', 2] },
                    totalGrades: 1,
                    studentCount: { $size: '$uniqueStudents' }
                }
            },
            { $sort: { year: 1, month: 1 } },
            { $limit: 12 } // Last 12 months
        ]);

        res.status(200).json({
            success: true,
            message: 'Grade trends retrieved successfully',
            data: { trends }
        });

    } catch (error) {
        console.error('Get grade trends error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving grade trends',
            error: error.message
        });
    }
};

// Get class comparison
exports.getClassComparison = async (req, res) => {
    try {
        const teacherId = req.userId;
        const { academicYear, semester, subject } = req.query;

        let query = { teacherId: mongoose.Types.ObjectId(teacherId) };
        if (academicYear) query.academicYear = academicYear;
        if (semester) query.semester = semester;
        if (subject) query.subject = subject;

        const comparison = await Grade.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$class',
                    averageScore: { $avg: '$score' },
                    totalGrades: { $sum: 1 },
                    highestScore: { $max: '$score' },
                    lowestScore: { $min: '$score' },
                    students: { $addToSet: '$studentId' },
                    subjects: { $addToSet: '$subject' }
                }
            },
            {
                $project: {
                    class: '$_id',
                    averageScore: { $round: ['$averageScore', 2] },
                    totalGrades: 1,
                    highestScore: 1,
                    lowestScore: 1,
                    studentCount: { $size: '$students' },
                    subjectCount: { $size: '$subjects' }
                }
            },
            { $sort: { averageScore: -1 } }
        ]);

        res.status(200).json({
            success: true,
            message: 'Class comparison retrieved successfully',
            data: { comparison }
        });

    } catch (error) {
        console.error('Get class comparison error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving class comparison',
            error: error.message
        });
    }
};

// Get student progress
exports.getStudentProgress = async (req, res) => {
    try {
        const { studentId } = req.params;
        const { subject, academicYear } = req.query;

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

        let query = { 
            studentId: mongoose.Types.ObjectId(studentId),
            teacherId: req.userId 
        };
        if (subject) query.subject = subject;
        if (academicYear) query.academicYear = academicYear;

        // Get grades over time
        const progress = await Grade.find(query)
            .sort({ date: 1 })
            .select('subject gradeType score maxScore date semester');

        // Calculate subject averages
        const subjectAverages = await Grade.aggregate([
            { $match: query },
            {
                $group: {
                    _id: '$subject',
                    averageScore: { $avg: { $multiply: [{ $divide: ['$score', '$maxScore'] }, 100] } },
                    totalGrades: { $sum: 1 },
                    highestScore: { $max: { $multiply: [{ $divide: ['$score', '$maxScore'] }, 100] } },
                    lowestScore: { $min: { $multiply: [{ $divide: ['$score', '$maxScore'] }, 100] } }
                }
            },
            {
                $project: {
                    subject: '$_id',
                    averageScore: { $round: ['$averageScore', 2] },
                    totalGrades: 1,
                    highestScore: { $round: ['$highestScore', 2] },
                    lowestScore: { $round: ['$lowestScore', 2] }
                }
            },
            { $sort: { averageScore: -1 } }
        ]);

        res.status(200).json({
            success: true,
            message: 'Student progress retrieved successfully',
            data: {
                student: {
                    id: student._id,
                    fullName: student.fullName,
                    nis: student.nis,
                    class: student.class
                },
                progress,
                subjectAverages
            }
        });

    } catch (error) {
        console.error('Get student progress error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving student progress',
            error: error.message
        });
    }
};
