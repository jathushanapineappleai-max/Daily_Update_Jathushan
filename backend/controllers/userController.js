const User = require('../models/User');
const crypto = require('crypto');
const notificationService = require('../services/notificationService');

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10, role, search } = req.query;
    let query = {};

    if (role) query.role = role;
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });

  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, phone, unitNumber, role, isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (unitNumber) user.unitNumber = unitNumber;

    if (req.user.hasRoleOrHigher('secretary')) {
      if (role) user.role = role;
      if (typeof isActive === 'boolean') user.isActive = isActive;
    }

    await user.save();
    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, unitNumber, phone, role, sendWelcomeEmail } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });

    const tempPassword = crypto.randomBytes(8).toString('hex');

    const user = new User({
      firstName,
      lastName,
      email,
      password: tempPassword,
      unitNumber,
      phone,
      role: role || 'resident',
      isActive: true,
      invitedBy: req.user._id
    });

    await user.save();

    if (sendWelcomeEmail !== false) {
      try {
        await notificationService.handleUserRegistration(user, tempPassword);
      } catch (emailError) {
        console.error('Failed to send welcome email:', emailError);
      }
    }

    const newUser = await User.findById(user._id).select('-password');
    res.status(201).json({
      user: newUser,
      tempPassword: sendWelcomeEmail === false ? tempPassword : undefined,
      message: 'User created successfully'
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error while creating user' });
  }
};

// Activate/Deactivate user
exports.activateUser = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (!isActive && user.role === 'administrator') {
      return res.status(403).json({ message: 'Cannot deactivate administrator accounts' });
    }

    user.isActive = isActive;
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json({
      user: updatedUser,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`
    });

  } catch (error) {
    console.error('Activate user error:', error);
    res.status(500).json({ message: 'Server error while updating user status' });
  }
};

// Change user role
exports.changeUserRole = async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const validRoles = ['resident', 'council', 'treasurer', 'secretary', 'president', 'administrator'];
    if (!validRoles.includes(role)) return res.status(400).json({ message: 'Invalid role specified' });
    if (role === 'administrator' && req.user.role !== 'administrator') {
      return res.status(403).json({ message: 'Only administrators can assign administrator role' });
    }

    if (user._id.toString() === req.user._id.toString()) {
      const roleHierarchy = {
        resident: 1, council: 2, treasurer: 3, secretary: 3, president: 4, administrator: 5
      };
      if (roleHierarchy[role] < roleHierarchy[req.user.role]) {
        return res.status(403).json({ message: 'Cannot downgrade your own role' });
      }
    }

    const oldRole = user.role;
    user.role = role;
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json({
      user: updatedUser,
      message: `User role changed from ${oldRole} to ${role} successfully`
    });

  } catch (error) {
    console.error('Change role error:', error);
    res.status(500).json({ message: 'Server error while changing user role' });
  }
};

// Reset user password
exports.resetPassword = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const tempPassword = crypto.randomBytes(8).toString('hex');
    user.password = tempPassword;
    await user.save();

    try {
      const resetToken = crypto.randomBytes(32).toString('hex');
      await notificationService.handlePasswordReset(user, resetToken);
    } catch (emailError) {
      console.error('Failed to send password reset email:', emailError);
    }

    res.json({
      message: 'Password reset successfully',
      tempPassword
    });

  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error while resetting password' });
  }
};

// Unlock user account
exports.unlockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json({
      user: updatedUser,
      message: 'User account unlocked successfully'
    });

  } catch (error) {
    console.error('Unlock user error:', error);
    res.status(500).json({ message: 'Server error while unlocking user' });
  }
};
