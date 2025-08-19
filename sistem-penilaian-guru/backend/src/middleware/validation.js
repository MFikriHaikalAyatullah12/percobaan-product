const { body, validationResult } = require('express-validator');

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
};