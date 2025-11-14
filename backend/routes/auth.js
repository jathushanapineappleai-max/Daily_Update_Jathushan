// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const crypto = require('crypto');
// const rateLimit = require('express-rate-limit');

// const User = require('../models/User');
// const { auth, authorize } = require('../middleware/auth');
// const { 
//   validateUserLogin, 
//   validateUserRegistration, 
//   validateProfileUpdate,
//   validatePasswordChange,
//   sanitizeInput 
// } = require('../middleware/validation');

// // Rate limiting for login attempts
// const loginLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 5, // limit each IP to 5 login requests per hour
//   message: 'Too many login attempts, please try again later.',
//   skipSuccessfulRequests: true
// });

// // @route   POST /api/auth/register
// // @desc    Register user (invitation-based)
// // @access  Public (with valid invitation token)
// router.post('/register', validateUserRegistration, sanitizeInput, async (req, res) => {
//   try {
//     const { firstName, lastName, email, password, unitNumber, phone, invitationToken } = req.body;

//     // Check if invitation token is valid
//     const hashedToken = crypto.createHash('sha256').update(invitationToken).digest('hex');
//     const invitingUser = await User.findOne({
//       invitationToken: hashedToken,
//       invitationExpires: { $gt: Date.now() }
//     });

//     if (!invitingUser) {
//       return res.status(400).json({ message: 'Invalid or expired invitation token' });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//       return res.status(400).json({ message: 'User already exists with this email' });
//     }

//     // Create user
//     const user = new User({
//       firstName,
//       lastName,
//       email,
//       password,
//       unitNumber,
//       phone,
//       invitedBy: invitingUser._id,
//       role: 'resident' // Default role
//     });

//     await user.save();

//     // Clear invitation token
//     invitingUser.invitationToken = undefined;
//     invitingUser.invitationExpires = undefined;
//     await invitingUser.save();

//     res.status(201).json({
//       message: 'User registered successfully. Please verify your email.',
//       userId: user._id
//     });

//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Server error during registration' });
//   }
// });

// // @route   POST /api/auth/login
// // @desc    Login user
// // @access  Public
// router.post('/login', loginLimiter, validateUserLogin, sanitizeInput, async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Find user and include password for comparison
//     const user = await User.findOne({ email }).select('+password');
//     if (!user) {
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Check if account is locked
//     if (user.isLocked) {
//       return res.status(423).json({ 
//         message: 'Account is locked due to too many failed login attempts. Please try again later.' 
//       });
//     }

//     // Check if account is active
//     if (!user.isActive) {
//       return res.status(401).json({ message: 'Account is deactivated' });
//     }

//     // Validate password
//     const isMatch = await user.comparePassword(password);
//     if (!isMatch) {
//       // Increment login attempts
//       await user.incLoginAttempts();
//       return res.status(400).json({ message: 'Invalid credentials' });
//     }

//     // Reset login attempts on successful login
//     if (user.loginAttempts > 0) {
//       await user.resetLoginAttempts();
//     }

//     // Update last login
//     user.lastLogin = new Date();
//     user.lastActivity = new Date();
//     await user.save();

//     // Create JWT payload
//     const payload = {
//       id: user._id,
//       email: user.email,
//       role: user.role
//     };

//     // Sign JWT
//     const token = jwt.sign(payload, process.env.JWT_SECRET, {
//       expiresIn: process.env.JWT_EXPIRE || '15m'
//     });

//     // Remove password from response
//     const userResponse = user.toObject();
//     delete userResponse.password;

//     res.json({
//       success: true,
//       token,
//       user: userResponse
//     });

//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error during login' });
//   }
// });

// // @route   GET /api/auth/me
// // @desc    Get current user
// // @access  Private
// router.get('/me', auth, async (req, res) => {
//   try {
//     const user = await User.findById(req.user._id).select('-password');
//     res.json(user);
//   } catch (error) {
//     console.error('Get user error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   PUT /api/auth/profile
// // @desc    Update user profile
// // @access  Private
// router.put('/profile', auth, validateProfileUpdate, sanitizeInput, async (req, res) => {
//   try {
//     const { firstName, lastName, phone, unitNumber, preferences } = req.body;

//     const user = await User.findById(req.user._id);
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Update fields
//     if (firstName) user.firstName = firstName;
//     if (lastName) user.lastName = lastName;
//     if (phone) user.phone = phone;
//     if (unitNumber) user.unitNumber = unitNumber;
//     if (preferences) user.preferences = { ...user.preferences, ...preferences };

//     await user.save();

//     const updatedUser = await User.findById(user._id).select('-password');
//     res.json(updatedUser);

//   } catch (error) {
//     console.error('Profile update error:', error);
//     res.status(500).json({ message: 'Server error during profile update' });
//   }
// });

// // @route   PUT /api/auth/change-password
// // @desc    Change user password
// // @access  Private
// router.put('/change-password', auth, validatePasswordChange, sanitizeInput, async (req, res) => {
//   try {
//     const { currentPassword, newPassword } = req.body;

//     const user = await User.findById(req.user._id).select('+password');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found' });
//     }

//     // Verify current password
//     const isMatch = await user.comparePassword(currentPassword);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Current password is incorrect' });
//     }

//     // Update password
//     user.password = newPassword;
//     await user.save();

//     res.json({ message: 'Password changed successfully' });

//   } catch (error) {
//     console.error('Password change error:', error);
//     res.status(500).json({ message: 'Server error during password change' });
//   }
// });

// // @route   POST /api/auth/forgot-password
// // @desc    Send password reset email
// // @access  Public
// router.post('/forgot-password', sanitizeInput, async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) {
//       // Don't reveal if user exists or not
//       return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
//     }

//     // Generate reset token
//     const resetToken = user.generatePasswordResetToken();
//     await user.save();

//     // TODO: Send email with reset token
//     // For now, just return success message
//     res.json({ 
//       message: 'If an account with that email exists, a password reset link has been sent.',
//       // In development, include the token
//       ...(process.env.NODE_ENV === 'development' && { resetToken })
//     });

//   } catch (error) {
//     console.error('Forgot password error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/auth/reset-password/:token
// // @desc    Reset password with token
// // @access  Public
// router.post('/reset-password/:token', sanitizeInput, async (req, res) => {
//   try {
//     const { password } = req.body;
//     const { token } = req.params;

//     // Hash token to compare with stored hash
//     const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

//     const user = await User.findOne({
//       passwordResetToken: hashedToken,
//       passwordResetExpires: { $gt: Date.now() }
//     });

//     if (!user) {
//       return res.status(400).json({ message: 'Invalid or expired reset token' });
//     }

//     // Update password
//     user.password = password;
//     user.passwordResetToken = undefined;
//     user.passwordResetExpires = undefined;
//     await user.save();

//     res.json({ message: 'Password reset successfully' });

//   } catch (error) {
//     console.error('Reset password error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// // @route   POST /api/auth/logout
// // @desc    Logout user
// // @access  Private
// router.post('/logout', auth, async (req, res) => {
//   try {
//     // In a more complex setup, you might want to blacklist the token
//     // For now, just return success
//     res.json({ message: 'Logged out successfully' });
//   } catch (error) {
//     console.error('Logout error:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;



const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const { auth } = require('../middleware/auth');
const { 
  validateUserLogin, 
  validateUserRegistration, 
  validateProfileUpdate,
  validatePasswordChange,
  sanitizeInput 
} = require('../middleware/validation');

const authController = require('../controllers/authController');

// Rate limiting for login - More permissive for development
const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: process.env.NODE_ENV === 'production' ? 5 : 100, // 100 attempts for dev, 5 for production
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
});

// Routes
router.post('/register', validateUserRegistration, sanitizeInput, authController.registerUser);
router.post('/login', loginLimiter, validateUserLogin, sanitizeInput, authController.loginUser);
router.get('/me', auth, authController.getCurrentUser);
router.put('/profile', auth, validateProfileUpdate, sanitizeInput, authController.updateProfile);
router.put('/change-password', auth, validatePasswordChange, sanitizeInput, authController.changePassword);
router.post('/forgot-password', sanitizeInput, authController.forgotPassword);
router.post('/reset-password/:token', sanitizeInput, authController.resetPassword);
router.post('/logout', auth, authController.logoutUser);

module.exports = router;
