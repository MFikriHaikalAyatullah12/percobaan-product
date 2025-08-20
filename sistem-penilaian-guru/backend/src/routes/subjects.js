const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const { authenticate, requireTeacher } = require('../middleware/auth');
const { 
    validateCreateSubject,
    validateMongoId,
    validate 
} = require('../middleware/validation');

// All subject routes require authentication and teacher role
router.use(authenticate);
router.use(requireTeacher);

// Get all subjects for a teacher
router.get('/', async (req, res) => {
    try {
        const { search = '', category = '' } = req.query;
        
        let query = { 
            $or: [
                { teachers: req.userId },
                { teachers: { $size: 0 } } // Public subjects
            ],
            isActive: true 
        };
        
        if (search) {
            query.$and = [
                query.$and || {},
                {
                    $or: [
                        { name: { $regex: search, $options: 'i' } },
                        { code: { $regex: search, $options: 'i' } }
                    ]
                }
            ];
        }
        
        if (category) {
            query.category = category;
        }

        const subjects = await Subject.find(query)
            .sort({ name: 1 })
            .populate('teachers', 'fullName username');

        res.status(200).json({
            success: true,
            message: 'Subjects retrieved successfully',
            data: { subjects }
        });

    } catch (error) {
        console.error('Get subjects error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving subjects',
            error: error.message
        });
    }
});

// Get single subject by ID
router.get('/:id', validate(validateMongoId), async (req, res) => {
    try {
        const { id } = req.params;
        
        const subject = await Subject.findOne({
            _id: id,
            $or: [
                { teachers: req.userId },
                { teachers: { $size: 0 } }
            ],
            isActive: true
        }).populate('teachers', 'fullName username');

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Subject retrieved successfully',
            data: { subject }
        });

    } catch (error) {
        console.error('Get subject error:', error);
        res.status(500).json({
            success: false,
            message: 'Error retrieving subject',
            error: error.message
        });
    }
});

// Create new subject
router.post('/', validate(validateCreateSubject), async (req, res) => {
    try {
        const { name, code, description, credits, category } = req.body;

        // Check if subject code already exists
        const existingSubject = await Subject.findOne({ code });
        if (existingSubject) {
            return res.status(400).json({
                success: false,
                message: 'Subject with this code already exists'
            });
        }

        // Create new subject
        const newSubject = new Subject({
            name,
            code,
            description,
            credits,
            category,
            teachers: [req.userId]
        });

        await newSubject.save();
        await newSubject.populate('teachers', 'fullName username');

        res.status(201).json({
            success: true,
            message: 'Subject created successfully',
            data: { subject: newSubject }
        });

    } catch (error) {
        console.error('Create subject error:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating subject',
            error: error.message
        });
    }
});

// Update subject
router.put('/:id', validate(validateMongoId), async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        // Find subject
        const subject = await Subject.findOne({
            _id: id,
            teachers: req.userId,
            isActive: true
        });

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found or you do not have permission to edit it'
            });
        }

        // Check if code is being updated and already exists
        if (updateData.code && updateData.code !== subject.code) {
            const existingCode = await Subject.findOne({ 
                code: updateData.code, 
                _id: { $ne: id } 
            });
            if (existingCode) {
                return res.status(400).json({
                    success: false,
                    message: 'Subject with this code already exists'
                });
            }
        }

        // Update subject
        Object.assign(subject, updateData);
        await subject.save();
        await subject.populate('teachers', 'fullName username');

        res.status(200).json({
            success: true,
            message: 'Subject updated successfully',
            data: { subject }
        });

    } catch (error) {
        console.error('Update subject error:', error);
        res.status(500).json({
            success: false,
            message: 'Error updating subject',
            error: error.message
        });
    }
});

// Delete subject (soft delete)
router.delete('/:id', validate(validateMongoId), async (req, res) => {
    try {
        const { id } = req.params;
        
        const subject = await Subject.findOne({
            _id: id,
            teachers: req.userId,
            isActive: true
        });

        if (!subject) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found or you do not have permission to delete it'
            });
        }

        // Soft delete
        subject.isActive = false;
        await subject.save();

        res.status(200).json({
            success: true,
            message: 'Subject deleted successfully'
        });

    } catch (error) {
        console.error('Delete subject error:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting subject',
            error: error.message
        });
    }
});

module.exports = router;
