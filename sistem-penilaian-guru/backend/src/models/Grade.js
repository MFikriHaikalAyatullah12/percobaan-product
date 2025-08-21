const mongoose = require('mongoose');

const gradeSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: [true, 'Student ID is required']
    },
    subject: {
        type: String,
        required: [true, 'Subject is required'],
        enum: [
            'Matematika',
            'Bahasa Indonesia', 
            'IPA (Ilmu Pengetahuan Alam)',
            'IPS (Ilmu Pengetahuan Sosial)',
            'Bahasa Inggris',
            'Pendidikan Jasmani',
            'Seni Budaya',
            'Pendidikan Agama'
        ],
        trim: true
    },
    grade: {
        type: Number,
        required: [true, 'Grade is required'],
        min: [0, 'Grade cannot be negative'],
        max: [100, 'Grade cannot exceed 100']
    },
    semester: {
        type: String,
        required: [true, 'Semester is required'],
        enum: ['1', '2']
    },
    academicYear: {
        type: String,
        required: [true, 'Academic year is required'],
        default: '2024/2025',
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
}, {
    timestamps: true
});

// Index untuk mencegah duplikasi nilai pada siswa yang sama di mata pelajaran dan semester yang sama
gradeSchema.index({ studentId: 1, subject: 1, semester: 1, academicYear: 1 }, { unique: true });

// Virtual untuk menghitung grade letter
gradeSchema.virtual('letterGrade').get(function() {
    const grade = this.grade;
    if (grade >= 85) return 'A';
    if (grade >= 70) return 'B';
    if (grade >= 55) return 'C';
    return 'D';
});

// Static method untuk validasi grade
gradeSchema.statics.validateGrade = function(grade) {
    if (grade < 0 || grade > 100) {
        throw new Error('Grade must be between 0 and 100');
    }
    return true;
};

const Grade = mongoose.model('Grade', gradeSchema);

module.exports = Grade;