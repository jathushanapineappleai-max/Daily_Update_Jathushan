const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const Announcement = require('../models/Announcement');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected for seeding...');
  } catch (error) {
    console.error('Database connection error:', error);
    process.exit(1);
  }
};

const seedUsers = async () => {
  try {
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      console.log('Users already exist, skipping user seeding...');
      return;
    }

    const users = [
      {
        firstName: 'System',
        lastName: 'Administrator',
        email: process.env.ADMIN_EMAIL || 'admin@spantower27.org',
        password: process.env.ADMIN_PASSWORD || 'AdminPassword123!',
        role: 'administrator',
        isActive: true,
        isEmailVerified: true,
        unitNumber: 'ADMIN'
      },
      {
        firstName: 'Rajesh',
        lastName: 'Kumar',
        email: 'president@spantower27.org',
        password: 'President123!',
        role: 'president',
        isActive: true,
        isEmailVerified: true,
        unitNumber: '101',
        phone: '+94771234567'
      },
      {
        firstName: 'Priya',
        lastName: 'Fernando',
        email: 'secretary@spantower27.org',
        password: 'Secretary123!',
        role: 'secretary',
        isActive: true,
        isEmailVerified: true,
        unitNumber: '102',
        phone: '+94772345678'
      },
      {
        firstName: 'Sunil',
        lastName: 'Perera',
        email: 'treasurer@spantower27.org',
        password: 'Treasurer123!',
        role: 'treasurer',
        isActive: true,
        isEmailVerified: true,
        unitNumber: '103',
        phone: '+94773456789'
      },
      {
        firstName: 'Nimal',
        lastName: 'Silva',
        email: 'council1@spantower27.org',
        password: 'Council123!',
        role: 'council',
        isActive: true,
        isEmailVerified: true,
        unitNumber: '201',
        phone: '+94774567890'
      },
      {
        firstName: 'Kamala',
        lastName: 'Jayawardena',
        email: 'resident1@spantower27.org',
        password: 'Resident123!',
        role: 'resident',
        isActive: true,
        isEmailVerified: true,
        unitNumber: '301',
        phone: '+94775678901'
      }
    ];

    console.log('Creating users...');
    for (const userData of users) {
      const user = new User(userData);
      await user.save();
      console.log(`Created user: ${user.email} (${user.role})`);
    }

    console.log('Users seeded successfully!');
  } catch (error) {
    console.error('Error seeding users:', error);
  }
};

const seedAnnouncements = async () => {
  try {
    // Check if announcements already exist
    const existingAnnouncements = await Announcement.countDocuments();
    if (existingAnnouncements > 0) {
      console.log('Announcements already exist, skipping announcement seeding...');
      return;
    }

    // Get the administrator user to be the author
    const admin = await User.findOne({ role: 'administrator' });
    if (!admin) {
      console.log('No administrator found, skipping announcement seeding...');
      return;
    }

    const announcements = [
      {
        title: 'Welcome to Span Tower 27 Management System',
        content: 'We are pleased to introduce our new digital management system for Span Tower 27. This platform will help us communicate more effectively, manage finances transparently, and streamline maintenance requests. Please explore the system and update your profile information.',
        priority: 'high',
        category: 'general',
        status: 'published',
        author: admin._id,
        visibility: {
          isPublic: true,
          roles: ['resident', 'council', 'treasurer', 'secretary', 'president', 'administrator']
        },
        isPinned: true,
        tags: ['welcome', 'system', 'introduction']
      },
      {
        title: 'Monthly Maintenance Fee Payment Reminder',
        content: 'This is a reminder that monthly maintenance fees are due by the 5th of each month. Please ensure timely payment to avoid late fees. You can now view your payment history and outstanding amounts through this system.',
        priority: 'medium',
        category: 'financial',
        status: 'published',
        author: admin._id,
        visibility: {
          isPublic: true,
          roles: ['resident', 'council', 'treasurer', 'secretary', 'president', 'administrator']
        },
        tags: ['payment', 'maintenance', 'reminder']
      },
      {
        title: 'Elevator Maintenance Schedule',
        content: 'Please be informed that elevator maintenance will be conducted on the first Sunday of every month from 9:00 AM to 12:00 PM. During this time, one elevator will be out of service. We apologize for any inconvenience.',
        priority: 'medium',
        category: 'maintenance',
        status: 'published',
        author: admin._id,
        visibility: {
          isPublic: true,
          roles: ['resident', 'council', 'treasurer', 'secretary', 'president', 'administrator']
        },
        tags: ['elevator', 'maintenance', 'schedule']
      },
      {
        title: 'Security Guidelines and Visitor Policy',
        content: 'For the safety and security of all residents, please ensure that all visitors are registered at the security desk. Visitors should provide valid identification and the unit number they are visiting. Residents will be contacted for verification.',
        priority: 'high',
        category: 'security',
        status: 'published',
        author: admin._id,
        visibility: {
          isPublic: true,
          roles: ['resident', 'council', 'treasurer', 'secretary', 'president', 'administrator']
        },
        tags: ['security', 'visitors', 'policy']
      },
      {
        title: 'Community Hall Booking Procedure',
        content: 'The community hall is available for resident events and gatherings. To book the hall, please submit a request through the system at least 7 days in advance. A refundable security deposit is required. Contact the management for more details.',
        priority: 'low',
        category: 'general',
        status: 'published',
        author: admin._id,
        visibility: {
          isPublic: true,
          roles: ['resident', 'council', 'treasurer', 'secretary', 'president', 'administrator']
        },
        tags: ['community', 'hall', 'booking', 'events']
      }
    ];

    console.log('Creating announcements...');
    for (const announcementData of announcements) {
      const announcement = new Announcement(announcementData);
      await announcement.save();
      console.log(`Created announcement: ${announcement.title}`);
    }

    console.log('Announcements seeded successfully!');
  } catch (error) {
    console.error('Error seeding announcements:', error);
  }
};

const seedDatabase = async () => {
  try {
    await connectDB();
    
    console.log('Starting database seeding...');
    
    await seedUsers();
    await seedAnnouncements();
    
    console.log('Database seeding completed successfully!');
    
    // Display login credentials
    console.log('\n=== DEFAULT LOGIN CREDENTIALS ===');
    console.log('Administrator:');
    console.log(`  Email: ${process.env.ADMIN_EMAIL || 'admin@spantower27.org'}`);
    console.log(`  Password: ${process.env.ADMIN_PASSWORD || 'AdminPassword123!'}`);
    console.log('\nPresident:');
    console.log('  Email: president@spantower27.org');
    console.log('  Password: President123!');
    console.log('\nSecretary:');
    console.log('  Email: secretary@spantower27.org');
    console.log('  Password: Secretary123!');
    console.log('\nTreasurer:');
    console.log('  Email: treasurer@spantower27.org');
    console.log('  Password: Treasurer123!');
    console.log('\nCouncil Member:');
    console.log('  Email: council1@spantower27.org');
    console.log('  Password: Council123!');
    console.log('\nResident:');
    console.log('  Email: resident1@spantower27.org');
    console.log('  Password: Resident123!');
    console.log('\n=== IMPORTANT: Change these passwords after first login! ===\n');
    
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedDatabase();
}

module.exports = { seedDatabase };
