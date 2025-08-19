// This file contains functions for handling student-related operations.

const Student = require('../models/Student');

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json(students);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving students', error });
    }
};

// Get a student by ID
exports.getStudentById = async (req, res) => {
    const { id } = req.params;
    try {
        const student = await Student.findById(id);
        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving student', error });
    }
};

// Create a new student
exports.createStudent = async (req, res) => {
    const newStudent = new Student(req.body);
    try {
        const savedStudent = await newStudent.save();
        res.status(201).json(savedStudent);
    } catch (error) {
        res.status(400).json({ message: 'Error creating student', error });
    }
};

// Update a student by ID
exports.updateStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const updatedStudent = await Student.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(200).json(updatedStudent);
    } catch (error) {
        res.status(400).json({ message: 'Error updating student', error });
    }
};

// Delete a student by ID
exports.deleteStudent = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
            return res.status(404).json({ message: 'Student not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting student', error });
    }
};