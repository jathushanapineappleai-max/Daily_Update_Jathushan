# Installation Guide - MERN Condominium Management System

This guide will help you set up the Span Tower 27 Condominium Management System on your local development environment.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js** (v16.0.0 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download here](https://git-scm.com/)
- **MongoDB Atlas Account** - [Sign up here](https://www.mongodb.com/cloud/atlas)

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mern-condominium-management
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install all dependencies (backend + frontend)
npm run install-all
```

### 3. Environment Setup

#### Backend Environment Configuration

1. Navigate to the backend directory:
```bash
cd backend
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Edit the `.env` file with your configuration:
```env
# Environment Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/condominium_management?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_very_long_and_random
JWT_REFRESH_SECRET=your_super_secret_refresh_jwt_key_here_make_it_very_long_and_random
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Email Configuration (Optional for development)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=noreply@spantower27.org

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Admin Configuration
ADMIN_EMAIL=admin@spantower27.org
ADMIN_PASSWORD=AdminPassword123!
```

### 4. MongoDB Atlas Setup

1. **Create a MongoDB Atlas Account**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Sign up for a free account

2. **Create a New Cluster**
   - Click "Build a Database"
   - Choose "Shared" (free tier)
   - Select your preferred cloud provider and region
   - Click "Create Cluster"

3. **Configure Database Access**
   - Go to "Database Access" in the left sidebar
   - Click "Add New Database User"
   - Create a username and password
   - Set privileges to "Read and write to any database"

4. **Configure Network Access**
   - Go to "Network Access" in the left sidebar
   - Click "Add IP Address"
   - For development, you can add "0.0.0.0/0" (allow access from anywhere)
   - For production, add only your server's IP address

5. **Get Connection String**
   - Go to "Clusters" and click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `condominium_management`

### 5. Seed the Database

```bash
# From the root directory
cd backend
npm run seed
```

This will create default users and sample data. The script will display the login credentials for different roles.

### 6. Start the Development Servers

#### Option 1: Start Both Servers Simultaneously (Recommended)
```bash
# From the root directory
npm run dev
```

#### Option 2: Start Servers Individually
```bash
# Terminal 1 - Backend (from root directory)
npm run server

# Terminal 2 - Frontend (from root directory)
npm run client
```

### 7. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/api/health

## Default Login Credentials

After seeding the database, you can use these credentials to test different roles:

### Administrator
- **Email**: admin@spantower27.org
- **Password**: AdminPassword123!

### President
- **Email**: president@spantower27.org
- **Password**: President123!

### Secretary
- **Email**: secretary@spantower27.org
- **Password**: Secretary123!

### Treasurer
- **Email**: treasurer@spantower27.org
- **Password**: Treasurer123!

### Council Member
- **Email**: council1@spantower27.org
- **Password**: Council123!

### Resident
- **Email**: resident1@spantower27.org
- **Password**: Resident123!

> **⚠️ Important**: Change these passwords after first login in production!

## Development Scripts

### Root Directory Scripts
```bash
npm run dev          # Start both backend and frontend
npm run server       # Start backend only
npm run client       # Start frontend only
npm run build        # Build frontend for production
npm run install-all  # Install all dependencies
```

### Backend Scripts
```bash
npm start           # Start production server
npm run dev         # Start development server with nodemon
npm run seed        # Seed database with sample data
npm test            # Run tests
npm run test:watch  # Run tests in watch mode
```

### Frontend Scripts
```bash
npm start           # Start development server
npm run build       # Build for production
npm test            # Run tests
npm run eject       # Eject from Create React App (not recommended)
```

## Troubleshooting

### Common Issues

#### 1. MongoDB Connection Error
```
Error: MongoNetworkError: failed to connect to server
```
**Solution**: 
- Check your MongoDB Atlas connection string
- Ensure your IP address is whitelisted in MongoDB Atlas
- Verify your database user credentials

#### 2. Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
- Kill the process using the port: `npx kill-port 5000`
- Or change the PORT in your `.env` file

#### 3. JWT Secret Error
```
Error: secretOrPrivateKey has a value of "undefined"
```
**Solution**:
- Ensure JWT_SECRET is set in your `.env` file
- Make sure the `.env` file is in the backend directory

#### 4. CORS Error
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**:
- Ensure FRONTEND_URL is correctly set in your `.env` file
- Check that the frontend is running on the expected port

### Getting Help

If you encounter issues not covered here:

1. Check the console logs for detailed error messages
2. Ensure all environment variables are correctly set
3. Verify that all dependencies are installed
4. Make sure MongoDB Atlas is properly configured

## Next Steps

After successful installation:

1. **Explore the Application**: Navigate through different user roles to understand the system
2. **Read the Documentation**: Check the README.md for feature details
3. **Development**: Start implementing Phase 1 features (Authentication System)
4. **Testing**: Write and run tests for your implementations

## Production Deployment

For production deployment instructions, see the deployment section in the main README.md file.

---

**Need Help?** Contact the development team at info@spantower27.org
