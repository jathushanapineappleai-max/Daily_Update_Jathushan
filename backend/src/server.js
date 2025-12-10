const app = require("./app");   // ✅ CORRECT PATH
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  console.error('Stack:', err.stack);
  // Don't exit, just log the error
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit, just log the error
});

// ✅ Connect Database First
connectDB().then(() => {
  const server = app.listen(PORT, () => {
    console.log(`🚀 PAI ERP Server running on port ${PORT}`);
  });

  // Handle graceful shutdown
  const shutdown = () => {
    console.log('Shutting down gracefully...');
    server.close(() => {
      console.log('Process terminated');
    });
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

}).catch((error) => {
  console.error("❌ Failed to start server due to database connection issue:", error.message);
  console.log("Please check your database configuration and ensure MySQL is running.");
  // Remove process.exit(1) to prevent forced termination
  // This allows the process to stay alive so we can see what's happening
});