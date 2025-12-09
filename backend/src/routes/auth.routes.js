const express = require('express');
const { 
  login, 
  forgotPassword, 
  verifyOtp, 
  resetPassword, 
  changePassword,
  getMe
} = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

// Public routes
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);

// Private routes
router.post('/change-password', protect, changePassword);
router.get('/me', protect, getMe);

module.exports = router;