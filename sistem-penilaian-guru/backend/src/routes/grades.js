const express = require('express');
const router = express.Router();
const gradeController = require('../controllers/gradeController');

// Get all grades
router.get('/', gradeController.getAllGrades);

// Get a specific grade by ID
router.get('/:id', gradeController.getGradeById);

// Create a new grade
router.post('/', gradeController.createGrade);

// Update an existing grade
router.put('/:id', gradeController.updateGrade);

// Delete a grade
router.delete('/:id', gradeController.deleteGrade);

module.exports = router;