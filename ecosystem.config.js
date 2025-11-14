module.exports = {
  apps: [
    {
      name: 'spantower27-prod-backend',
      script: './backend/server.js',
      cwd: '/var/www/SpanTower27',
      
      // Environment configuration
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      
      // Process management
      instances: 1,
      exec_mode: 'cluster',
      watch: false,
      ignore_watch: ['node_modules', 'logs', '.git'],
      
      // Memory and performance
      max_memory_restart: '1G',
      min_uptime: '10s',
      max_restarts: 10,
      
      // Logging
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log',
      log_file: './logs/backend-combined.log',
      time: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      
      // Auto-restart configuration
      autorestart: true,
      restart_delay: 4000,
      
      // Health monitoring
      health_check_grace_period: 3000,
      
      // Environment variables for production
      env_file: './backend/.env'
    }
  ],

  // Deployment configuration
  deploy: {
    production: {
      user: 'root',
      host: 'www.spantower27.org',
      ref: 'origin/main',
      repo: 'https://github.com/your-repo/SpanTower27.git',
      path: '/var/www/SpanTower27',
      'pre-deploy-local': '',
      'post-deploy': 'npm install --production && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      'post-setup': 'npm install --production'
    }
  }
};
