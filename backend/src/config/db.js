const { Sequelize } = require("sequelize");
require("dotenv").config(); // Load .env variables

// ✅ Create Sequelize Instance
const sequelize = new Sequelize(
  process.env.DB_NAME || "pai_erp_dev",   // Default to pai_erp_dev
  process.env.DB_USER || "root",          // Default to root
  process.env.DB_PASS || "",              // Default to empty password
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",    // ✅ Works for both MySQL & MariaDB
    logging: false,
    pool: {
      max: 10,           // max connections
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+05:30",  // Sri Lanka timezone (optional but recommended)
  }
);

// ✅ Database Connection Test
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PAI ERP Database connected successfully!");
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    // Instead of exiting, throw the error so it can be handled by the caller
    throw error;
  }
};

module.exports = {
  sequelize,
  connectDB,
};