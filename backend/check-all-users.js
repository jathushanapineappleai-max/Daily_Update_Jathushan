const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function checkAllUsers() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/spantower27');
    console.log('✅ Connected to MongoDB');
    
    const User = require('./models/User');
    
    // Define all required users with their credentials
    const requiredUsers = [
      {
        firstName: 'System',
        lastName: 'Administrator',
        email: 'admin@spantower27.org',
        password: 'AdminPassword123!',
        role: 'administrator'
      },
      {
        firstName: 'Test',
        lastName: 'President',
        email: 'president@spantower27.org',
        password: 'President123!',
        role: 'president'
      },
      {
        firstName: 'Test',
        lastName: 'Secretary',
        email: 'secretary@spantower27.org',
        password: 'Secretary123!',
        role: 'secretary'
      },
      {
        firstName: 'Test',
        lastName: 'Treasurer',
        email: 'treasurer@spantower27.org',
        password: 'Treasurer123!',
        role: 'treasurer'
      },
      {
        firstName: 'Test',
        lastName: 'Council',
        email: 'council1@spantower27.org',
        password: 'Council123!',
        role: 'council'
      },
      {
        firstName: 'Test',
        lastName: 'Resident',
        email: 'resident1@spantower27.org',
        password: 'Resident123!',
        role: 'resident',
        unitNumber: '101',
        phone: '+1234567890'
      }
    ];
    
    console.log('👥 Checking and creating users...\n');
    
    for (const userData of requiredUsers) {
      console.log(`🔍 Checking: ${userData.email}`);
      
      // Check if user exists
      let user = await User.findOne({ email: userData.email }).select('+password');
      
      if (user) {
        console.log(`   ✅ User exists: ${user.firstName} ${user.lastName}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   👤 Role: ${user.role}`);
        console.log(`   🟢 Active: ${user.isActive}`);
        
        // Test current password
        try {
          const isValidPassword = await user.comparePassword(userData.password);
          if (isValidPassword) {
            console.log(`   🔑 Password: ✅ Correct`);
          } else {
            console.log(`   🔑 Password: ❌ Incorrect - Updating...`);
            user.password = userData.password;
            await user.save();
            console.log(`   🔧 Password updated successfully`);
          }
        } catch (error) {
          console.log(`   🔑 Password: ❌ Error testing - Updating...`);
          user.password = userData.password;
          await user.save();
          console.log(`   🔧 Password updated successfully`);
        }
        
        // Update role if different
        if (user.role !== userData.role) {
          console.log(`   🔄 Role changed from ${user.role} to ${userData.role}`);
          user.role = userData.role;
          await user.save();
        }
        
      } else {
        console.log(`   ❌ User not found - Creating...`);
        
        // Create new user
        user = new User({
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          role: userData.role,
          unitNumber: userData.unitNumber || null,
          phone: userData.phone || null,
          isActive: true,
          isEmailVerified: true
        });
        
        await user.save();
        console.log(`   ✅ User created successfully`);
        console.log(`   👤 Name: ${user.firstName} ${user.lastName}`);
        console.log(`   📧 Email: ${user.email}`);
        console.log(`   👤 Role: ${user.role}`);
      }
      
      console.log(''); // Empty line for readability
    }
    
    console.log('🎉 All users checked and configured!\n');
    
    // Display final summary
    console.log('📋 LOGIN CREDENTIALS SUMMARY:');
    console.log('=' .repeat(50));
    
    for (const userData of requiredUsers) {
      console.log(`👤 ${userData.role.toUpperCase()}:`);
      console.log(`   Email: ${userData.email}`);
      console.log(`   Password: ${userData.password}`);
      console.log('');
    }
    
    console.log('🌐 You can now login at: https://www.spantower27.org');
    console.log('✅ All credentials should work correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

checkAllUsers();
