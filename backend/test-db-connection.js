const mysql = require('mysql2/promise');
require('dotenv').config();

async function testAndCreateDatabase() {
  let connection;
  
  try {
    console.log('Attempting to connect to MySQL server...');
    
    // Connect to MySQL server without specifying a database
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || '',
    });
    
    console.log('✅ Connected to MySQL server');
    
    // Check if database exists
    const [rows] = await connection.execute(
      "SELECT SCHEMA_NAME FROM information_schema.SCHEMATA WHERE SCHEMA_NAME = ?",
      [process.env.DB_NAME || 'pai_erp_dev']
    );
    
    if (rows.length === 0) {
      // Database doesn't exist, create it
      console.log('❌ Database does not exist, creating it...');
      await connection.execute(`CREATE DATABASE ${process.env.DB_NAME || 'pai_erp_dev'}`);
      console.log('✅ Database created successfully');
    } else {
      console.log('✅ Database already exists');
    }
    
    // Close connection
    await connection.end();
    console.log('✅ Disconnected from MySQL server');
    
  } catch (error) {
    console.error('❌ Error connecting to MySQL:', error.message);
    console.error('Please ensure MySQL is installed and running on your system.');
    console.error('You may need to:');
    console.error('1. Install MySQL Server');
    console.error('2. Start the MySQL service');
    console.error('3. Verify the connection details in your .env file');
    
    if (connection) {
      await connection.end();
    }
    
    process.exit(1);
  }
}

testAndCreateDatabase();