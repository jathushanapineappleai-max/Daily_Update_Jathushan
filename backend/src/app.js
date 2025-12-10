const express = require("express");
require("dotenv").config();

const { sequelize } = require("./models");

// Route files
const authRoutes = require('./routes/auth.routes');
const attendanceRoutes = require('./routes/attendance.routes');

const app = express();
app.use(express.json());

// Enable CORS for frontend
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

// ✅ Sync DB (Safe Mode)
sequelize.sync({ alter: false });

// ✅ Test Route
app.get("/", (req, res) => {
  res.send("PAI ERP Backend Running ✅");
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

// Mount routers
app.use('/api/auth', authRoutes);
app.use('/api/attendance', attendanceRoutes);

module.exports = app;