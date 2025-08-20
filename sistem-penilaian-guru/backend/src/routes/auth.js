const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { 
    validateRegister, 
    validateLogin, 
    validateUpdateProfile, 
    validateChangePassword,
    validate 
} = require('../middleware/validation');

// Public routes
router.post('/register', validate(validateRegister), authController.register);
router.post('/login', validate(validateLogin), authController.login);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.get('/profile', authController.getProfile);
router.put('/profile', validate(validateUpdateProfile), authController.updateProfile);
router.put('/change-password', validate(validateChangePassword), authController.changePassword);
router.post('/logout', authController.logout);

module.exports = router;