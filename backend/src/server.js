const app = require("./app");   // ✅ CORRECT PATH
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

// ✅ Connect Database First
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 PAI ERP Server running on port ${PORT}`);
  });

  // Handle graceful shutdown
  process.on('SIGTERM', () => {
    console.log('SIGTERM received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });

  process.on('SIGINT', () => {
    console.log('SIGINT received, shutting down gracefully');
    server.close(() => {
      console.log('Process terminated');
    });
  });
}).catch((error) => {
  console.error("❌ Failed to start server due to database connection issue:", error.message);
  console.log("Please check your database configuration and ensure MySQL is running.");
  process.exit(1);
});