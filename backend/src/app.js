const express = require("express");
require("dotenv").config();

const { sequelize } = require("./models");

// Route files - Import one by one to avoid conflicts
const authRoutes = require('./routes/auth.routes');
console.log("✓ authRoutes loaded successfully:", typeof authRoutes);

const attendanceRoutes = require('./routes/attendance.routes');
console.log("✓ attendanceRoutes loaded successfully:", typeof attendanceRoutes);

const sidebarRoutes = require('./routes/sidebar.routes');
console.log("✓ sidebarRoutes loaded successfully:", typeof sidebarRoutes);

const employeeRoutes = require('./routes/employee.routes');
console.log("✓ employeeRoutes loaded successfully:", typeof employeeRoutes);

// Leave Management Routes (from teammate's code)
const leaveRoutes = require('./routes/leave.routes');
console.log("✓ leaveRoutes loaded successfully:", typeof leaveRoutes);

const leavereqRoutes = require('./routes/leavereq.routes');
console.log("✓ leavereqRoutes loaded successfully:", typeof leavereqRoutes);

const leaveBalanceRoutes = require('./routes/leavebalance.routes');
console.log("✓ leaveBalanceRoutes loaded successfully:", typeof leaveBalanceRoutes);

// Rules & Regulations Routes (from teammate's code)
const ruleCategoryRoutes = require('./routes/rulecategory.routes');
console.log("✓ ruleCategoryRoutes loaded successfully:", typeof ruleCategoryRoutes);

const ruleRoutes = require('./routes/rule.routes');
console.log("✓ ruleRoutes loaded successfully:", typeof ruleRoutes);

const roleRoutes = require('./routes/role.routes');
console.log("✓ roleRoutes loaded successfully:", typeof roleRoutes);

const app = express();
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// Enhanced CORS for frontend
app.use((req, res, next) => {
  // For development, allow all origins
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-User-ID, X-User-Role, X-Employee-ID');
  res.header('Access-Control-Allow-Credentials', true);
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// ✅ Sync DB (Safe Mode)
// Disabled automatic sync to prevent 'too many keys' error
// Models should be managed through migrations
// sequelize.sync({ alter: false });

// Mount routers - only if they are valid Express Routers
if (authRoutes && typeof authRoutes === 'function' && typeof authRoutes.use === 'function') {
  app.use('/api/auth', authRoutes);
  console.log("✓ Mounted authRoutes");
} else {
  console.error("✗ authRoutes is not a valid router", typeof authRoutes);
}

if (attendanceRoutes && typeof attendanceRoutes === 'function' && typeof attendanceRoutes.use === 'function') {
  app.use('/api/attendance', attendanceRoutes);
  console.log("✓ Mounted attendanceRoutes");
} else {
  console.error("✗ attendanceRoutes is not a valid router", typeof attendanceRoutes);
}

if (sidebarRoutes && typeof sidebarRoutes === 'function' && typeof sidebarRoutes.use === 'function') {
  app.use('/api/sidebar', sidebarRoutes);
  console.log("✓ Mounted sidebarRoutes");
} else {
  console.error("✗ sidebarRoutes is not a valid router", typeof sidebarRoutes);
}

if (employeeRoutes && typeof employeeRoutes === 'function' && typeof employeeRoutes.use === 'function') {
  app.use('/api/employees', employeeRoutes);
  console.log("✓ Mounted employeeRoutes");
} else {
  console.error("✗ employeeRoutes is not a valid router", typeof employeeRoutes);
}

// Leave Management Routes
if (leaveRoutes && typeof leaveRoutes === 'function' && typeof leaveRoutes.use === 'function') {
  app.use('/api', leaveRoutes);
  console.log("✓ Mounted leaveRoutes");
} else {
  console.error("✗ leaveRoutes is not a valid router", typeof leaveRoutes);
}

if (leavereqRoutes && typeof leavereqRoutes === 'function' && typeof leavereqRoutes.use === 'function') {
  app.use('/api', leavereqRoutes);
  console.log("✓ Mounted leavereqRoutes");
} else {
  console.error("✗ leavereqRoutes is not a valid router", typeof leavereqRoutes);
}

if (leaveBalanceRoutes && typeof leaveBalanceRoutes === 'function' && typeof leaveBalanceRoutes.use === 'function') {
  app.use('/api/leave-balance', leaveBalanceRoutes);
  console.log("✓ Mounted leaveBalanceRoutes");
} else {
  console.error("✗ leaveBalanceRoutes is not a valid router", typeof leaveBalanceRoutes);
}

// Rules & Regulations Routes
if (ruleCategoryRoutes && typeof ruleCategoryRoutes === 'function' && typeof ruleCategoryRoutes.use === 'function') {
  app.use('/api', ruleCategoryRoutes);
  console.log("✓ Mounted ruleCategoryRoutes");
} else {
  console.error("✗ ruleCategoryRoutes is not a valid router", typeof ruleCategoryRoutes);
}

if (ruleRoutes && typeof ruleRoutes === 'function' && typeof ruleRoutes.use === 'function') {
  app.use('/api', ruleRoutes);
  console.log("✓ Mounted ruleRoutes");
} else {
  console.error("✗ ruleRoutes is not a valid router", typeof ruleRoutes);
}

if (roleRoutes && typeof roleRoutes === 'function' && typeof roleRoutes.use === 'function') {
  app.use('/roles', roleRoutes);
  console.log("✓ Mounted roleRoutes");
} else {
  console.error("✗ roleRoutes is not a valid router", typeof roleRoutes);
}

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("PAI ERP Backend Running ✅");
});

// ✅ Simple test route for sidebar
app.get("/api/test-sidebar", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Sidebar route is working"
  });
});

// ✅ Database Connection Test Route
app.get("/api/test-db", async (req, res) => {
  try {
    // Test the database connection
    await sequelize.authenticate();
    
    // Get database name from the connection
    const dbName = sequelize.config.database;
    
    // Get list of tables
    const tables = await sequelize.getQueryInterface().showAllSchemas();
    
    res.status(200).json({
      message: "✅ Database connection successful!",
      database: dbName,
      connection: true,
      tables: tables.length,
      version: process.env.PROJECT_VERSION || '1.0.0'
    });
  } catch (error) {
    res.status(500).json({
      message: "❌ Database connection failed",
      error: error.message,
      connection: false
    });
  }
});

module.exports = app;