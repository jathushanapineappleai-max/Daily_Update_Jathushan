const config = {
  development: {
    port: process.env.PORT || 5000,
    mongodb: {
      uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/condominium_dev',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET || 'dev_jwt_secret_key',
      refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_refresh_secret_key',
      expiresIn: process.env.JWT_EXPIRE || '15m',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
    },
    email: {
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      from: process.env.EMAIL_FROM || 'noreply@spantower27.org'
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET
    },
    cors: {
      origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
      credentials: true
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      loginWindowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000, // 1 hour
      loginMax: parseInt(process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS) || 5
    },
    fileUpload: {
      maxSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 10MB
      allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf,doc,docx').split(',')
    }
  },

  production: {
    port: process.env.PORT || 5000,
    mongodb: {
      uri: process.env.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        ssl: true,
        sslValidate: true
      }
    },
    jwt: {
      secret: process.env.JWT_SECRET,
      refreshSecret: process.env.JWT_REFRESH_SECRET,
      expiresIn: process.env.JWT_EXPIRE || '15m',
      refreshExpiresIn: process.env.JWT_REFRESH_EXPIRE || '7d'
    },
    email: {
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT || 587,
      secure: process.env.EMAIL_PORT == 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      },
      from: process.env.EMAIL_FROM
    },
    cloudinary: {
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      apiKey: process.env.CLOUDINARY_API_KEY,
      apiSecret: process.env.CLOUDINARY_API_SECRET
    },
    cors: {
      origin: ['https://dev.spantower27.org', 'https://spantower27.org'],
      credentials: true
    },
    rateLimit: {
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
      loginWindowMs: parseInt(process.env.LOGIN_RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000,
      loginMax: parseInt(process.env.LOGIN_RATE_LIMIT_MAX_ATTEMPTS) || 5
    },
    fileUpload: {
      maxSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024,
      allowedTypes: (process.env.ALLOWED_FILE_TYPES || 'jpg,jpeg,png,pdf,doc,docx').split(',')
    }
  },

  test: {
    port: process.env.PORT || 5001,
    mongodb: {
      uri: process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/condominium_test',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    },
    jwt: {
      secret: 'test_jwt_secret_key',
      refreshSecret: 'test_refresh_secret_key',
      expiresIn: '15m',
      refreshExpiresIn: '7d'
    },
    email: {
      host: 'localhost',
      port: 1025,
      secure: false,
      auth: null,
      from: 'test@spantower27.org'
    },
    cors: {
      origin: ['http://localhost:3000'],
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 1000, // Higher limit for testing
      loginWindowMs: 60 * 60 * 1000,
      loginMax: 50 // Higher limit for testing
    },
    fileUpload: {
      maxSize: 5 * 1024 * 1024, // 5MB for testing
      allowedTypes: ['jpg', 'jpeg', 'png', 'pdf']
    }
  }
};

const environment = process.env.NODE_ENV || 'development';

module.exports = config[environment];
