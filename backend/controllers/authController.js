const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');

// Register user
exports.registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password, unitNumber, phone, invitationToken } = req.body;

    const hashedToken = crypto.createHash('sha256').update(invitationToken).digest('hex');
    const invitingUser = await User.findOne({
      invitationToken: hashedToken,
      invitationExpires: { $gt: Date.now() }
    });

    if (!invitingUser) return res.status(400).json({ message: 'Invalid or expired invitation token' });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });

    const user = new User({
      firstName,
      lastName,
      email,
      password,
      unitNumber,
      phone,
      invitedBy: invitingUser._id,
      role: 'resident'
    });

    await user.save();

    invitingUser.invitationToken = undefined;
    invitingUser.invitationExpires = undefined;
    await invitingUser.save();

    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      userId: user._id
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    if (user.isLocked) return res.status(423).json({ message: 'Account is locked due to too many failed login attempts. Please try again later.' });
    if (!user.isActive) return res.status(401).json({ message: 'Account is deactivated' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.loginAttempts > 0) await user.resetLoginAttempts();

    user.lastLogin = new Date();
    user.lastActivity = new Date();
    await user.save();

    const payload = { id: user._id, email: user.email, role: user.role };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE || '15m' });

    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({ success: true, token, user: userResponse });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update profile
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone, unitNumber, preferences } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (unitNumber) user.unitNumber = unitNumber;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);

  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};

// Change password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ message: 'Current password is incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Server error during password change' });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });

    const resetToken = user.generatePasswordResetToken();
    await user.save();

    res.json({ 
      message: 'If an account with that email exists, a password reset link has been sent.',
      ...(process.env.NODE_ENV === 'development' && { resetToken })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } });

    if (!user) return res.status(400).json({ message: 'Invalid or expired reset token' });

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    res.json({ message: 'Password reset successfully' });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout
exports.logoutUser = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
