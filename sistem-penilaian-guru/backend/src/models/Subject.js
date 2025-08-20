const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Subject name is required'],
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: [true, 'Subject code is required'],
        unique: true,
        trim: true,
        uppercase: true
    },
    description: {
        type: String,
        trim: true
    },
    credits: {
        type: Number,
        default: 1,
        min: [1, 'Credits must be at least 1']
    },
    category: {
        type: String,
        enum: ['core', 'elective', 'extracurricular'],
        default: 'core'
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    classes: [{
        type: String,
        trim: true
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index for better query performance
subjectSchema.index({ name: 'text', code: 'text' });
subjectSchema.index({ teachers: 1 });

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
