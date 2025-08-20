const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student ID is required']
    },
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Teacher ID is required']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        trim: true
    },
    gradeType: {
        type: String,
        enum: ['quiz', 'assignment', 'midterm', 'final', 'participation', 'project'],
        required: [true, 'Grade type is required']
    },
    score: {
        type: Number,
        required: [true, 'Score is required'],
        min: [0, 'Score cannot be negative'],
        max: [100, 'Score cannot exceed 100']
    },
    maxScore: {
        type: Number,
        default: 100,
        min: [1, 'Max score must be at least 1']
    },
    weight: {
        type: Number,
        default: 1,
        min: [0, 'Weight cannot be negative']
    },
    class: {
        type: String,
        required: [true, 'Class is required'],
        trim: true
    },
    academicYear: {
        type: String,
        required: [true, 'Academic year is required'],
        trim: true
    },
    semester: {
        type: String,
        enum: ['1', '2'],
        required: [true, 'Semester is required']
    },
    date: {
        type: Date,
        default: Date.now
    },
    description: {
        type: String,
        trim: true
    },
    notes: {
        type: String,
        trim: true
    },
    isPublished: {
        type: Boolean,
        default: false
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

// Virtual for percentage calculation
gradeSchema.virtual('percentage').get(function() {
    return (this.score / this.maxScore) * 100;
});

// Virtual for letter grade
gradeSchema.virtual('letterGrade').get(function() {
    const percentage = this.percentage;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
});

// Index for better query performance
gradeSchema.index({ studentId: 1, subject: 1, academicYear: 1 });
gradeSchema.index({ teacherId: 1, class: 1 });
gradeSchema.index({ subject: 1, gradeType: 1 });

// Static method to validate score
gradeSchema.statics.validateScore = function(score, maxScore = 100) {
    if (score < 0 || score > maxScore) {
        throw new Error(`Score must be between 0 and ${maxScore}`);
    }
    return true;
};

// Method to calculate weighted score
gradeSchema.methods.getWeightedScore = function() {
    return (this.score / this.maxScore) * this.weight;
};

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;