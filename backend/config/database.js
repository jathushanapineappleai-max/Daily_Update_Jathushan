// config/database.js
require('dotenv').config();

module.exports = {
  development: {
    username: 'root',
    password: '', // your MySQL password
    database: 'pai_erp_dev',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  test: {
    username: 'root',
    password: '',
    database: 'pai_erp_test',
    host: '127.0.0.1',
    dialect: 'mysql'
  },
  production: {
    use_env_variable: 'DATABASE_URL', // For deployment (e.g., Render, Railway)
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};