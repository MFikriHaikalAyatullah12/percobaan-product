const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { authenticate, requireTeacher } = require('../middleware/auth');
const { 
    validateStudentId,
    validateAcademicYearQuery,
    validateSemesterQuery,
    validate 
} = require('../middleware/validation');

// All dashboard routes require authentication and teacher role
router.use(authenticate);
router.use(requireTeacher);

// Get dashboard overview
router.get('/overview', 
    validate(validateAcademicYearQuery),
    validate(validateSemesterQuery),
    dashboardController.getDashboardOverview
);

// Get grade trends
router.get('/trends', 
    validate(validateAcademicYearQuery),
    dashboardController.getGradeTrends
);

// Get class comparison
router.get('/classes', 
    validate(validateAcademicYearQuery),
    validate(validateSemesterQuery),
    dashboardController.getClassComparison
);

// Get student progress
router.get('/student/:studentId/progress', 
    validate(validateStudentId),
    validate(validateAcademicYearQuery),
    dashboardController.getStudentProgress
);

module.exports = router;
