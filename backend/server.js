const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");
const http = require("http");
const socketIo = require("socket.io");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const server = http.createServer(app);

// Trust proxy for rate limiting behind nginx
app.set("trust proxy", 1);

// Socket.IO setup with CORS
const io = socketIo(server, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? [
            "https://dev.spantower27.org",
            "https://spantower27.org",
            "https://www.spantower27.org",
          ]
        : ["http://localhost:3000", "http://127.0.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Initialize notification service with Socket.IO
const notificationService = require("./services/notificationService");
notificationService.initialize(io);

// Security middleware
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        imgSrc: ["'self'", "data:", "https://res.cloudinary.com"],
        scriptSrc: ["'self'"],
        connectSrc: ["'self'"],
      },
    },
  })
);

// Rate limiting - More permissive for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 1000 requests for dev, 100 for production
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use("/api/", limiter);



// CORS configuration
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? ["https://dev.spantower27.org", "https://spantower27.org"]
      : ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true,
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Logging middleware
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// MongoDB connection
const connectDB = require('./config/database');
connectDB();

// Initialize recurring transaction job
const recurringTransactionJob = require('./jobs/recurringTransactionJob');
recurringTransactionJob.init();
recurringTransactionJob.start();

// Socket.IO authentication middleware
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const User = require("./models/User");
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      return next(new Error("Authentication error"));
    }

    socket.userId = user._id.toString();
    socket.userRole = user.role;
    next();
  } catch (error) {
    next(new Error("Authentication error"));
  }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.userId} (${socket.userRole})`);

  // Join user-specific room
  socket.join(`user_${socket.userId}`);

  // Join role-specific room
  socket.join(`role_${socket.userRole}`);

  // Handle user activity updates
  socket.on("user_activity", async () => {
    try {
      const User = require("./models/User");
      await User.findByIdAndUpdate(socket.userId, {
        lastActivity: new Date(),
      });
    } catch (error) {
      console.error("Failed to update user activity:", error);
    }
  });

  // Handle meeting attendance updates
  socket.on("meeting_attendance", async (data) => {
    try {
      const { meetingId, status } = data;
      const Meeting = require("./models/Meeting");
      const meeting = await Meeting.findById(meetingId);

      if (meeting) {
        await meeting.updateAttendeeStatus(socket.userId, status);

        // Notify organizer about attendance update
        const notification = {
          type: "attendance_update",
          title: "Attendance Update",
          message: `Attendance status updated for ${meeting.title}`,
          data: { meetingId, status },
          timestamp: new Date(),
        };

        io.to(`user_${meeting.organizer}`).emit("notification", notification);
      }
    } catch (error) {
      console.error("Failed to handle meeting attendance:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.userId}`);
  });
});

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/meetings", require("./routes/meetings"));
app.use("/api/finances", require("./routes/finances"));
app.use("/api/reports", require("./routes/reports"));
app.use("/api/maintenance", require("./routes/maintenance"));
app.use("/api/announcements", require("./routes/announcements"));
app.use("/api/documents", require("./routes/documents"));
app.use("/api/vendors", require("./routes/vendors"));
app.use("/api/units", require("./routes/units"));
app.use("/api/unit-maintenance", require("./routes/unitMaintenance"));

// Health check endpoint (must be before static file serving)
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// Serve static files from React build in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/build", "index.html"));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something went wrong!",
    error:
      process.env.NODE_ENV === "development"
        ? err.message
        : "Internal server error",
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// const PORT = process.env.PORT || 5001;
// const HOST = process.env.HOST || '127.0.0.1'; // Bind to localhost only for security

// server.listen(PORT, HOST, () => {
//   console.log(`Server running in ${process.env.NODE_ENV} mode on ${HOST}:${PORT}`);
//   console.log(`Socket.IO server initialized`);
// });

const PORT = process.env.PORT || 5000;
// Do not restrict HOST unless you’re behind a reverse proxy (e.g., nginx)
server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`Socket.IO server initialized`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully...");
  server.close(() => {
    console.log("Process terminated");
    mongoose.connection.close();
  });
});

module.exports = app;
