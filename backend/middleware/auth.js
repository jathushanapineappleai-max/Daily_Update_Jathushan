const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "Token is not valid" });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({ message: "Account is deactivated" });
    }

    // Check if user account is locked
    if (user.isLocked) {
      return res
        .status(401)
        .json({
          message: "Account is locked due to too many failed login attempts",
        });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    res.status(401).json({ message: "Token is not valid" });
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

// Role hierarchy check - allows higher roles to access lower role functions
const authorizeHierarchy = (minimumRole) => {
  const roleHierarchy = {
    resident: 1,
    council: 2,
    treasurer: 3,
    secretary: 3,
    president: 4,
    administrator: 5,
  };

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const userRoleLevel = roleHierarchy[req.user.role] || 0;
    const requiredRoleLevel = roleHierarchy[minimumRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return res.status(403).json({
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

// Check if user can modify specific resource (own data or higher role)
const canModifyUser = async (req, res, next) => {
  try {
    const targetUserId = req.params.id || req.params.userId;
    const currentUser = req.user;

    // Users can always modify their own data
    if (currentUser._id.toString() === targetUserId) {
      return next();
    }

    // Check role hierarchy for modifying other users
    const roleHierarchy = {
      resident: 1,
      council: 2,
      treasurer: 3,
      secretary: 3,
      president: 4,
      administrator: 5,
    };

    const targetUser = await User.findById(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const currentUserLevel = roleHierarchy[currentUser.role] || 0;
    const targetUserLevel = roleHierarchy[targetUser.role] || 0;

    if (currentUserLevel <= targetUserLevel) {
      return res.status(403).json({
        message: "Cannot modify user with equal or higher role",
      });
    }

    next();
  } catch (error) {
    console.error("canModifyUser middleware error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Session timeout check
const checkSessionTimeout = (req, res, next) => {
  const sessionTimeout = 15 * 60 * 1000; // 15 minutes in milliseconds
  const lastActivity = req.user.lastActivity;
  const now = new Date();

  if (lastActivity && now - lastActivity > sessionTimeout) {
    return res.status(401).json({
      message: "Session expired due to inactivity",
      code: "SESSION_TIMEOUT",
    });
  }

  // Update last activity
  User.findByIdAndUpdate(req.user._id, { lastActivity: now }).exec();
  next();
};

module.exports = {
  auth,
  authorize,
  authorizeHierarchy,
  canModifyUser,
  checkSessionTimeout,
};
