const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');
const { authenticate } = require('../middleware/auth');
const { 
    validateCreateGrade, 
    validateUpdateGrade, 
    validateMongoId,
    validate 
} = require('../middleware/validation');

// All grade routes require authentication
router.use(authenticate);

// Get all grades with filtering and pagination
router.get('/', gradeController.getAllGrades);

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

// Update a grade
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