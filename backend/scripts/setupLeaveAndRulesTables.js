// scripts/setupLeaveAndRulesTables.js
// Run with: node scripts/setupLeaveAndRulesTables.js

require('dotenv').config();
const { sequelize } = require('../src/models');

const setupTables = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');

    // Add leave_type column to leave_type table if it doesn't exist
    console.log('\n📝 Updating leave_type table...');
    try {
      await sequelize.query(`
        ALTER TABLE leave_type 
        ADD COLUMN IF NOT EXISTS leave_type VARCHAR(50) NULL AFTER leave_name
      `);
      console.log('✅ leave_type column added/verified');
    } catch (err) {
      if (err.message.includes('Duplicate column')) {
        console.log('ℹ️  leave_type column already exists');
      } else {
        console.log('⚠️  Note:', err.message);
      }
    }

    // Create rule_category table if not exists
    console.log('\n📝 Creating/verifying rule_category table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS rule_category (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT NULL
      )
    `);
    console.log('✅ rule_category table ready');

    // Create rule table if not exists
    console.log('\n📝 Creating/verifying rule table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS rule (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        rule_text TEXT NOT NULL,
        status ENUM('active', 'halt', 'inactive') DEFAULT 'active',
        FOREIGN KEY (category_id) REFERENCES rule_category(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ rule table ready');

    // Create role_rule junction table if not exists
    console.log('\n📝 Creating/verifying role_rule table...');
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS role_rule (
        role_id INT NOT NULL,
        rule_category_id INT NOT NULL,
        PRIMARY KEY (role_id, rule_category_id),
        FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
        FOREIGN KEY (rule_category_id) REFERENCES rule_category(id) ON DELETE CASCADE
      )
    `);
    console.log('✅ role_rule table ready');

    // Insert sample data for leave_type
    console.log('\n📝 Inserting sample leave types...');
    const [existingLeaveTypes] = await sequelize.query('SELECT COUNT(*) as count FROM leave_type');
    if (existingLeaveTypes[0].count === 0) {
      await sequelize.query(`
        INSERT INTO leave_type (leave_name, leave_type, day_count, requires_proof) VALUES
        ('Annual Leave', 'annual', 14, 0),
        ('Sick Leave', 'sick', 14, 1),
        ('Casual Leave', 'casual', 7, 0),
        ('Maternity Leave', 'maternity', 90, 1),
        ('Paternity Leave', 'paternity', 14, 1)
      `);
      console.log('✅ Sample leave types inserted');
    } else {
      console.log('ℹ️  Leave types already exist, skipping insert');
    }

    // Insert sample rule categories
    console.log('\n📝 Inserting sample rule categories...');
    const [existingCategories] = await sequelize.query('SELECT COUNT(*) as count FROM rule_category');
    if (existingCategories[0].count === 0) {
      await sequelize.query(`
        INSERT INTO rule_category (name, description) VALUES
        ('Attendance Policy', 'Rules related to employee attendance and punctuality'),
        ('Leave Policy', 'Rules governing leave applications and approvals'),
        ('Code of Conduct', 'General workplace behavior and ethics guidelines'),
        ('IT Security Policy', 'Rules for handling company data and IT resources'),
        ('Dress Code', 'Guidelines for appropriate workplace attire')
      `);
      console.log('✅ Sample rule categories inserted');
    } else {
      console.log('ℹ️  Rule categories already exist, skipping insert');
    }

    // Insert sample rules
    console.log('\n📝 Inserting sample rules...');
    const [existingRules] = await sequelize.query('SELECT COUNT(*) as count FROM rule');
    if (existingRules[0].count === 0) {
      await sequelize.query(`
        INSERT INTO rule (category_id, rule_text, status) VALUES
        (1, 'Employees must check in before 9:00 AM', 'active'),
        (1, 'Late arrivals exceeding 3 times per month will result in salary deduction', 'active'),
        (1, 'Employees must check out after completing 8 hours of work', 'active'),
        (2, 'Leave requests must be submitted at least 3 days in advance', 'active'),
        (2, 'Sick leave exceeding 2 days requires medical certificate', 'active'),
        (2, 'Annual leave cannot exceed 5 consecutive working days without manager approval', 'active'),
        (3, 'Employees must maintain professional behavior at all times', 'active'),
        (3, 'Harassment of any kind is strictly prohibited', 'active'),
        (4, 'Company data must not be shared with external parties without authorization', 'active'),
        (4, 'Personal devices must be registered with IT before accessing company network', 'active'),
        (5, 'Business casual attire is required on weekdays', 'active'),
        (5, 'Casual dress is permitted on Fridays', 'active')
      `);
      console.log('✅ Sample rules inserted');
    } else {
      console.log('ℹ️  Rules already exist, skipping insert');
    }

    console.log('\n✅ Database setup complete!');
    console.log('\n📊 Summary of tables:');
    
    const [tables] = await sequelize.query('SHOW TABLES');
    console.log('Tables in database:', tables.map(t => Object.values(t)[0]).join(', '));

    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error.message);
    process.exit(1);
  }
};

setupTables();
