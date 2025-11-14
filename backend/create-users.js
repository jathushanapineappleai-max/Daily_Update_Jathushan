const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function createInitialUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spantower27');
    console.log('✅ Connected to MongoDB');
    
    const User = require('./models/User');
    
    // Check if any users exist
    const userCount = await User.countDocuments();
    console.log(`📊 Current user count: ${userCount}`);
    
    if (userCount > 0) {
      console.log('⚠️ Users already exist in database');
      const users = await User.find({}).select('firstName lastName email role isActive');
      console.log('📋 Existing users:');
      users.forEach(user => {
        console.log(`- ${user.firstName} ${user.lastName} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
      });
      process.exit(0);
    }
    
    console.log('👤 Creating initial users...');
    
    // Create admin user
    const adminUser = new User({
      firstName: 'System',
      lastName: 'Administrator',
      email: 'admin@spantower27.org',
      password: 'AdminPassword123!',
      role: 'administrator',
      isActive: true,
      isEmailVerified: true
    });
    
    await adminUser.save();
    console.log('✅ Admin user created');
    
    // Create secretary user
    const secretaryUser = new User({
      firstName: 'Test',
      lastName: 'Secretary',
      email: 'secretary@spantower27.org',
      password: 'SecretaryPass123!',
      role: 'secretary',
      isActive: true,
      isEmailVerified: true
    });
    
    await secretaryUser.save();
    console.log('✅ Secretary user created');
    
    // Create president user
    const presidentUser = new User({
      firstName: 'Test',
      lastName: 'President',
      email: 'president@spantower27.org',
      password: 'PresidentPass123!',
      role: 'president',
      isActive: true,
      isEmailVerified: true
    });
    
    await presidentUser.save();
    console.log('✅ President user created');
    
    // Create resident user
    const residentUser = new User({
      firstName: 'Test',
      lastName: 'Resident',
      email: 'resident@spantower27.org',
      password: 'ResidentPass123!',
      role: 'resident',
      unitNumber: '101',
      phone: '+1234567890',
      isActive: true,
      isEmailVerified: true
    });
    
    await residentUser.save();
    console.log('✅ Resident user created');
    
    console.log('\n🎉 All users created successfully!');
    console.log('\n📋 Login Credentials:');
    console.log('👑 Administrator:');
    console.log('   Email: admin@spantower27.org');
    console.log('   Password: AdminPassword123!');
    console.log('\n📝 Secretary:');
    console.log('   Email: secretary@spantower27.org');
    console.log('   Password: SecretaryPass123!');
    console.log('\n🏛️ President:');
    console.log('   Email: president@spantower27.org');
    console.log('   Password: PresidentPass123!');
    console.log('\n🏠 Resident:');
    console.log('   Email: resident@spantower27.org');
    console.log('   Password: ResidentPass123!');
    
    console.log('\n🌐 You can now login at: https://www.spantower27.org');
    
  } catch (error) {
    console.error('❌ Error creating users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

createInitialUsers();
