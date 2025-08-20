const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { authenticate, requireTeacher } = require('../middleware/auth');
const { 
    validateCreateGrade, 
    validateUpdateGrade, 
    validateMongoId,
    validateStudentId,
    validatePagination,
    validateAcademicYearQuery,
    validateSemesterQuery,
    validate 
} = require('../middleware/validation');

// All grade routes require authentication and teacher role
router.use(authenticate);
router.use(requireTeacher);

// Get all grades with filtering and pagination
router.get('/', 
    validate(validatePagination),
    validate(validateAcademicYearQuery),
    validate(validateSemesterQuery),
    gradeController.getAllGrades
);

// Get grade statistics dashboard
router.get('/stats', 
    validate(validateAcademicYearQuery),
    validate(validateSemesterQuery),
    gradeController.getGradeStats
);

// Get grades by student
router.get('/student/:studentId', 
    validate(validateStudentId),
    validate(validateAcademicYearQuery),
    validate(validateSemesterQuery),
    gradeController.getGradesByStudent
);

// Get grades by subject
router.get('/subject/:subject', 
    validate(validateAcademicYearQuery),
    validate(validateSemesterQuery),
    gradeController.getGradesBySubject
);

// Bulk create grades
router.post('/bulk', gradeController.bulkCreateGrades);

// Get a specific grade by ID
router.get('/:id', 
    validate(validateMongoId), 
    gradeController.getGradeById
);

// Create a new grade
router.post('/', 
    validate(validateCreateGrade), 
    gradeController.createGrade
);

// Update an existing grade
router.put('/:id', 
    validate(validateMongoId),
    validate(validateUpdateGrade), 
    gradeController.updateGrade
);

// Delete a grade
router.delete('/:id', 
    validate(validateMongoId), 
    gradeController.deleteGrade
);

module.exports = router;