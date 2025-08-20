const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware to authenticate JWT token
exports.authenticate = async (req, res, next) => {
    try {
        let token;

        // Check for token in Authorization header
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // Check if token exists
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
            
            // Find user
            const user = await User.findById(decoded.id).select('-password');
            
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token. User not found.'
                });
            }

            if (!user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Account is deactivated.'
                });
            }

            // Add user to request object
            req.user = user;
            req.userId = user._id;
            
            next();
        } catch (tokenError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token.'
            });
        }

    } catch (error) {
        console.error('Authentication error:', error);
        return res.status(500).json({
            success: false,
            message: 'Server error during authentication.',
            error: error.message
        });
    }
};

// Middleware to check if user is a teacher
exports.requireTeacher = (req, res, next) => {
    if (req.user && req.user.role === 'teacher') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Teacher role required.'
        });
    }
};

// Middleware to check if user is an admin
exports.requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Admin role required.'
        });
    }
};

// Middleware to check if user is either teacher or admin
exports.requireTeacherOrAdmin = (req, res, next) => {
    if (req.user && (req.user.role === 'teacher' || req.user.role === 'admin')) {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Access denied. Teacher or Admin role required.'
        });
    }
};

// Optional authentication middleware (doesn't fail if no token)
exports.optionalAuth = async (req, res, next) => {
    try {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key');
                const user = await User.findById(decoded.id).select('-password');
                
                if (user && user.isActive) {
                    req.user = user;
                    req.userId = user._id;
                }
            } catch (tokenError) {
                // Invalid token, but continue without authentication
                console.log('Invalid token in optional auth:', tokenError.message);
            }
        }

        next();
    } catch (error) {
        console.error('Optional authentication error:', error);
        next(); // Continue even if there's an error
    }
};