const Grade = require('../models/Grade');

// Get all grades
exports.getAllGrades = async (req, res) => {
    try {
        const grades = await Grade.find();
        res.status(200).json(grades);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving grades', error });
    }
};

// Get a grade by ID
exports.getGradeById = async (req, res) => {
    try {
        const grade = await Grade.findById(req.params.id);
        if (!grade) {
            return res.status(404).json({ message: 'Grade not found' });
        }
        res.status(200).json(grade);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving grade', error });
    }
};

// Create a new grade
exports.createGrade = async (req, res) => {
    const newGrade = new Grade(req.body);
    try {
        const savedGrade = await newGrade.save();
        res.status(201).json(savedGrade);
    } catch (error) {
        res.status(400).json({ message: 'Error creating grade', error });
    }
};

// Update a grade by ID
exports.updateGrade = async (req, res) => {
    try {
        const updatedGrade = await Grade.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedGrade) {
            return res.status(404).json({ message: 'Grade not found' });
        }
        res.status(200).json(updatedGrade);
    } catch (error) {
        res.status(400).json({ message: 'Error updating grade', error });
    }
};

// Delete a grade by ID
exports.deleteGrade = async (req, res) => {
    try {
        const deletedGrade = await Grade.findByIdAndDelete(req.params.id);
        if (!deletedGrade) {
            return res.status(404).json({ message: 'Grade not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting grade', error });
    }
};