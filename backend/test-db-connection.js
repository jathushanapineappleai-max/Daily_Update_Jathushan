const { connectDB } = require('./src/config/db');

console.log('Testing database connection...');

connectDB()
  .then(() => {
    console.log('✅ Database connection successful!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  });