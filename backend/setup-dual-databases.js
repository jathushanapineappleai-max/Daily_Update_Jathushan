const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Database configurations
const databases = {
  production: {
    uri: 'mongodb://admin:SecurePassword123!@localhost:27017/spantower27_prod?authSource=admin',
    name: 'Production'
  },
  development: {
    uri: 'mongodb://admin:SecurePassword123!@localhost:27017/spantower27_dev?authSource=admin',
    name: 'Development'
  }
};

// User schema (simplified for this script)
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  role: { 
    type: String, 
    enum: ['administrator', 'president', 'secretary', 'treasurer', 'council', 'resident'],
    default: 'resident'
  },
  unitNumber: String,
  phone: String,
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  loginAttempts: { type: Number, default: 0 },
  lockUntil: Date,
  lastLogin: Date,
  lastActivity: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Virtual for isLocked
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Default users to create
const defaultUsers = [
  {
    firstName: 'System',
    lastName: 'Administrator',
    email: 'admin@spantower27.org',
    password: 'AdminPassword123!',
    role: 'administrator',
    unitNumber: 'ADMIN',
    phone: '+1234567890',
    isEmailVerified: true
  },
  {
    firstName: 'Board',
    lastName: 'President',
    email: 'president@spantower27.org',
    password: 'President123!',
    role: 'president',
    unitNumber: 'PRES',
    phone: '+1234567891',
    isEmailVerified: true
  },
  {
    firstName: 'Board',
    lastName: 'Secretary',
    email: 'secretary@spantower27.org',
    password: 'Secretary123!',
    role: 'secretary',
    unitNumber: 'SEC',
    phone: '+1234567892',
    isEmailVerified: true
  },
  {
    firstName: 'Board',
    lastName: 'Treasurer',
    email: 'treasurer@spantower27.org',
    password: 'Treasurer123!',
    role: 'treasurer',
    unitNumber: 'TREAS',
    phone: '+1234567893',
    isEmailVerified: true
  },
  {
    firstName: 'Test',
    lastName: 'Resident',
    email: 'resident@spantower27.org',
    password: 'Resident123!',
    role: 'resident',
    unitNumber: '101',
    phone: '+1234567894',
    isEmailVerified: true
  }
];

async function setupDatabase(dbConfig) {
  console.log(`\n🔧 Setting up ${dbConfig.name} Database...`);
  console.log(`📍 URI: ${dbConfig.uri.replace(/\/\/.*@/, '//***:***@')}`);
  
  try {
    // Connect to database
    await mongoose.connect(dbConfig.uri);
    console.log(`✅ Connected to ${dbConfig.name} database`);
    
    // Create User model
    const User = mongoose.model('User', userSchema);
    
    // Clear existing users (optional - comment out if you want to keep existing data)
    // await User.deleteMany({});
    // console.log(`🗑️  Cleared existing users in ${dbConfig.name}`);
    
    // Create default users
    for (const userData of defaultUsers) {
      try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: userData.email });
        
        if (existingUser) {
          console.log(`👤 User ${userData.email} already exists - updating password`);
          existingUser.password = userData.password;
          existingUser.isActive = true;
          existingUser.loginAttempts = 0;
          existingUser.lockUntil = undefined;
          await existingUser.save();
          console.log(`✅ Updated ${userData.email}`);
        } else {
          const user = new User(userData);
          await user.save();
          console.log(`✅ Created ${userData.email} (${userData.role})`);
        }
      } catch (error) {
        console.error(`❌ Error with user ${userData.email}:`, error.message);
      }
    }
    
    // Test login for admin user
    console.log(`\n🔑 Testing admin login in ${dbConfig.name}...`);
    const admin = await User.findOne({ email: 'admin@spantower27.org' }).select('+password');
    if (admin) {
      const isValid = await admin.comparePassword('AdminPassword123!');
      console.log(`   Admin login test: ${isValid ? '✅ SUCCESS' : '❌ FAILED'}`);
    }
    
    await mongoose.disconnect();
    console.log(`🔌 Disconnected from ${dbConfig.name} database`);
    
  } catch (error) {
    console.error(`❌ Error setting up ${dbConfig.name} database:`, error.message);
    await mongoose.disconnect();
  }
}

async function main() {
  console.log('🚀 Setting up Dual Database Configuration for SpanTower27');
  console.log('📊 This will ensure both Production and Development databases have proper user data');
  
  // Setup both databases
  for (const [key, dbConfig] of Object.entries(databases)) {
    await setupDatabase(dbConfig);
  }
  
  console.log('\n🎉 Database setup completed!');
  console.log('\n📋 Login Credentials for both databases:');
  console.log('👑 Administrator: admin@spantower27.org / AdminPassword123!');
  console.log('🏛️  President: president@spantower27.org / President123!');
  console.log('📝 Secretary: secretary@spantower27.org / Secretary123!');
  console.log('💰 Treasurer: treasurer@spantower27.org / Treasurer123!');
  console.log('🏠 Resident: resident@spantower27.org / Resident123!');
  
  console.log('\n🌐 URLs:');
  console.log('🔴 Production: https://www.spantower27.org (Port 5001)');
  console.log('🟡 Development: https://dev.spantower27.org (Port 5000)');
  
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
