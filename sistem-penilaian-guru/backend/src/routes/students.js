const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authenticate, requireTeacher } = require('../middleware/auth');
const { 
    validateCreateStudent, 
    validateUpdateStudent, 
    validateMongoId,
    validatePagination,
    validateClassQuery,
    validateAcademicYearQuery,
    validate 
} = require('../middleware/validation');

// All student routes require authentication and teacher role
router.use(authenticate);
router.use(requireTeacher);

// Get all students with filtering and pagination
router.get('/', 
    validate(validatePagination), 
    studentController.getAllStudents
);

// Get student statistics
router.get('/stats', studentController.getStudentStats);

// Get students by class
router.get('/class/:className', 
    validate(validateClassQuery),
    validate(validateAcademicYearQuery),
    studentController.getStudentsByClass
);

// Get a single student by ID
router.get('/:id', 
    validate(validateMongoId), 
    studentController.getStudentById
);

// Create a new student
router.post('/', 
    validate(validateCreateStudent), 
    studentController.createStudent
);

// Update a student by ID
router.put('/:id', 
    validate(validateMongoId),
    validate(validateUpdateStudent), 
    studentController.updateStudent
);

// Delete a student by ID (soft delete)
router.delete('/:id', 
    validate(validateMongoId), 
    studentController.deleteStudent
);

module.exports = router;