const express = require("express");
require("dotenv").config();

const { sequelize } = require("./models");

// Route files
const authRoutes = require('./routes/auth.routes');
const attendanceRoutes = require('./routes/attendance.routes');
const sidebarRoutes = require('./routes/sidebar.routes');
const employeeRoutes = require('./routes/employee.routes');

// Leave Management Routes (from teammate's code)
const leaveRoutes = require('./routes/leave.routes');
const leavereqRoutes = require('./routes/leavereq.routes');
const leaveBalanceRoutes = require('./routes/leavebalance.routes');

// Rules & Regulations Routes (from teammate's code)
const ruleCategoryRoutes = require('./routes/rulecategory.routes');
const ruleRoutes = require('./routes/rule.routes');
const roleRoutes = require('./routes/role.routes');

const app = express();
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - IP: ${req.ip}`);
  next();
});

// Enhanced CORS for frontend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
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
sequelize.sync({ alter: false });

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/sidebar', sidebarRoutes);
app.use('/api/employees', employeeRoutes);

// Leave Management Routes
app.use('/api', leaveRoutes);
app.use('/api', leavereqRoutes);
app.use('/api/leave-balance', leaveBalanceRoutes);

// Rules & Regulations Routes
app.use('/api', ruleCategoryRoutes);
app.use('/api', ruleRoutes);
app.use('/roles', roleRoutes);

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
      tables: tables.length
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