const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    console.log('🔗 Attempting to connect to MongoDB...');
    console.log('📍 Connection string:', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'NOT FOUND');

    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      family: 4, // Use IPv4, skip trying IPv6
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    
    // Set up connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('Mongoose connected to MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Mongoose connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Mongoose disconnected from MongoDB');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('MongoDB connection closed through app termination');
      process.exit(0);
    });

    return conn;
  } catch (error) {
    console.error('Database connection error:', error.message);

    // If it's an SSL error, try to provide helpful information
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.error('🔒 SSL/TLS Connection Issue Detected');
      console.error('💡 This might be due to:');
      console.error('   - Network connectivity issues');
      console.error('   - MongoDB Atlas IP whitelist restrictions');
      console.error('   - SSL certificate problems');
      console.error('   - Firewall blocking the connection');
    }

    // Don't exit immediately, let the app try to reconnect
    console.error('⚠️  Will attempt to reconnect when needed...');
    throw error;
  }
};

module.exports = connectDB;
