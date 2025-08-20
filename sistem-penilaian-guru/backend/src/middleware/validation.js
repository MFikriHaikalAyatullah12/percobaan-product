const { body, param, query, validationResult } = require('express-validator');

// Validation middleware
exports.validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    };
};

// User/Auth validations
exports.validateRegister = [
    body('username')
        .isLength({ min: 3, max: 30 })
        .withMessage('Username must be between 3 and 30 characters')
        .matches(/^[a-zA-Z0-9_]+$/)
        .withMessage('Username can only contain letters, numbers, and underscores'),
    
    body('email')
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    
    body('fullName')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s\.\,\-\']+$/)
        .withMessage('Full name can only contain letters, spaces, dots, commas, hyphens, and apostrophes'),
    
    body('subjects')
        .optional()
        .isArray()
        .withMessage('Subjects must be an array')
];

exports.validateLogin = [
    body('username')
        .notEmpty()
        .withMessage('Username or email is required'),
    
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

exports.validateUpdateProfile = [
    body('fullName')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('subjects')
        .optional()
        .isArray()
        .withMessage('Subjects must be an array')
];

exports.validateChangePassword = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number')
];

// Student validations
exports.validateCreateStudent = [
    body('nis')
        .isLength({ min: 5, max: 20 })
        .withMessage('NIS must be between 5 and 20 characters')
        .matches(/^[0-9]+$/)
        .withMessage('NIS can only contain numbers'),
    
    body('fullName')
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Full name can only contain letters and spaces'),
    
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('phoneNumber')
        .optional()
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage('Invalid phone number format'),
    
    body('dateOfBirth')
        .optional()
        .isISO8601()
        .withMessage('Date of birth must be a valid date'),
    
    body('gender')
        .isIn(['male', 'female'])
        .withMessage('Gender must be either male or female'),
    
    body('class')
        .notEmpty()
        .withMessage('Class is required')
        .isLength({ min: 1, max: 10 })
        .withMessage('Class must be between 1 and 10 characters'),
    
    body('academicYear')
        .notEmpty()
        .withMessage('Academic year is required')
        .matches(/^\d{4}\/\d{4}$/)
        .withMessage('Academic year must be in format YYYY/YYYY (e.g., 2024/2025)')
];

exports.validateUpdateStudent = [
    body('nis')
        .optional()
        .isLength({ min: 5, max: 20 })
        .withMessage('NIS must be between 5 and 20 characters')
        .matches(/^[0-9]+$/)
        .withMessage('NIS can only contain numbers'),
    
    body('fullName')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Full name must be between 2 and 100 characters'),
    
    body('email')
        .optional()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail(),
    
    body('phoneNumber')
        .optional()
        .matches(/^[0-9+\-\s()]+$/)
        .withMessage('Invalid phone number format'),
    
    body('dateOfBirth')
        .optional()
        .isISO8601()
        .withMessage('Date of birth must be a valid date'),
    
    body('gender')
        .optional()
        .isIn(['male', 'female'])
        .withMessage('Gender must be either male or female'),
    
    body('class')
        .optional()
        .isLength({ min: 1, max: 10 })
        .withMessage('Class must be between 1 and 10 characters'),
    
    body('academicYear')
        .optional()
        .matches(/^\d{4}\/\d{4}$/)
        .withMessage('Academic year must be in format YYYY/YYYY')
];

// Grade validations
exports.validateCreateGrade = [
    body('studentId')
        .isMongoId()
        .withMessage('Valid student ID is required'),
    
    body('subject')
        .notEmpty()
        .withMessage('Subject is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Subject must be between 2 and 100 characters'),
    
    body('gradeType')
        .isIn(['quiz', 'assignment', 'midterm', 'final', 'participation', 'project'])
        .withMessage('Invalid grade type'),
    
    body('score')
        .isNumeric()
        .withMessage('Score must be a number')
        .custom((value, { req }) => {
            const maxScore = req.body.maxScore || 100;
            if (value < 0 || value > maxScore) {
                throw new Error(`Score must be between 0 and ${maxScore}`);
            }
            return true;
        }),
    
    body('maxScore')
        .optional()
        .isNumeric({ min: 1 })
        .withMessage('Max score must be at least 1'),
    
    body('weight')
        .optional()
        .isNumeric({ min: 0 })
        .withMessage('Weight must be a positive number'),
    
    body('semester')
        .isIn(['1', '2'])
        .withMessage('Semester must be either 1 or 2'),
    
    body('academicYear')
        .optional()
        .matches(/^\d{4}\/\d{4}$/)
        .withMessage('Academic year must be in format YYYY/YYYY'),
    
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid date')
];

exports.validateUpdateGrade = [
    body('score')
        .optional()
        .isNumeric()
        .withMessage('Score must be a number'),
    
    body('maxScore')
        .optional()
        .isNumeric({ min: 1 })
        .withMessage('Max score must be at least 1'),
    
    body('weight')
        .optional()
        .isNumeric({ min: 0 })
        .withMessage('Weight must be a positive number'),
    
    body('gradeType')
        .optional()
        .isIn(['quiz', 'assignment', 'midterm', 'final', 'participation', 'project'])
        .withMessage('Invalid grade type'),
    
    body('semester')
        .optional()
        .isIn(['1', '2'])
        .withMessage('Semester must be either 1 or 2'),
    
    body('date')
        .optional()
        .isISO8601()
        .withMessage('Date must be a valid date')
];

// Parameter validations
exports.validateMongoId = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format')
];

exports.validateStudentId = [
    param('studentId')
        .isMongoId()
        .withMessage('Invalid student ID format')
];

// Query validations
exports.validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100')
];

// Legacy validation for backward compatibility
const validateUserRegistration = [
    body('username')
        .isString()
        .withMessage('Username must be a string')
        .notEmpty()
        .withMessage('Username is required'),
    body('email')
        .isEmail()
        .withMessage('Email is not valid')
        .notEmpty()
        .withMessage('Email is required'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .notEmpty()
        .withMessage('Password is required'),
];

const validateUserLogin = [
    body('email')
        .isEmail()
        .withMessage('Email is not valid')
        .notEmpty()
        .withMessage('Email is required'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateRequest,
    ...exports
};