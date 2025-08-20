const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    nis: {
        type: String,
        required: [true, 'NIS is required'],
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: [true, 'Full name is required'],
        trim: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    dateOfBirth: {
        type: Date
    },
    gender: {
        type: String,
        enum: ['male', 'female'],
        required: true
    },
    address: {
        type: String,
        trim: true
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
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Teacher ID is required']
    },
    subjects: [{
        subjectName: {
            type: String,
            required: true,
            trim: true
        },
        teacherId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    enrollmentDate: {
        type: Date,
        default: Date.now
    },
    graduationDate: {
        type: Date
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

// Virtual for age calculation
studentSchema.virtual('age').get(function() {
    if (this.dateOfBirth) {
        const today = new Date();
        const birthDate = new Date(this.dateOfBirth);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    }
    return null;
});

// Index for better query performance
studentSchema.index({ teacherId: 1, class: 1 });
studentSchema.index({ nis: 1 });
studentSchema.index({ fullName: 'text' });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;