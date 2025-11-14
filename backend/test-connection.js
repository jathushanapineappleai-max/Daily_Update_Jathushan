const mongoose = require('mongoose');
require('dotenv').config();

const testConnection = async () => {
  try {
    console.log('🔗 Testing MongoDB connection...');
    console.log('📍 Connection string:', process.env.MONGODB_URI ? process.env.MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@') : 'NOT FOUND');
    
    // Try with minimal options first
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });
    
    console.log('✅ MongoDB Connected successfully!');
    console.log('🏠 Host:', conn.connection.host);
    console.log('📊 Database:', conn.connection.name);
    console.log('🔌 Ready state:', conn.connection.readyState);
    
    // Test a simple operation
    const collections = await conn.connection.db.listCollections().toArray();
    console.log('📁 Collections found:', collections.length);
    
    await mongoose.connection.close();
    console.log('🔒 Connection closed successfully');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('IP') || error.message.includes('whitelist')) {
      console.log('\n🚨 IP WHITELIST ISSUE DETECTED!');
      console.log('💡 Solutions:');
      console.log('   1. Add your current IP to MongoDB Atlas Network Access');
      console.log('   2. Add 0.0.0.0/0 to allow access from anywhere (development only)');
      console.log('   3. Check if you\'re behind a VPN or proxy');
    }
    
    if (error.message.includes('SSL') || error.message.includes('TLS')) {
      console.log('\n🔒 SSL/TLS ISSUE DETECTED!');
      console.log('💡 Solutions:');
      console.log('   1. Check network connectivity');
      console.log('   2. Try different network (mobile hotspot)');
      console.log('   3. Check firewall settings');
    }
    
    process.exit(1);
  }
};

testConnection();
