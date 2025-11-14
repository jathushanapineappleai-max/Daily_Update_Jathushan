# MERN Condominium Management System - Span Tower 27

A comprehensive, secure, role-based condominium management web application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## 🏢 Project Overview

This system is designed for Span Tower 27, a luxury condominium located at No. 77, Angulana Station Road, Moratuwa. The application provides granular access controls for different user roles including Administrator, President, Secretary, Treasurer, Council Members, and Residents.

## 🚀 Features

### Phase 1: Authentication System & Role Management ✅ (In Progress)

- JWT Authentication with refresh tokens
- Role-based access control (RBAC)
- User registration via invitation system
- Login security features (rate limiting, account lockout)
- Profile management system
- Role-specific dashboards

### Phase 2: Communication Hub (Planned)

- Announcements system with priority tagging
- Meeting management with iCal integration
- Email and SMS notification system
- Real-time notifications

### Phase 3: Financial Management (Planned)

- Financial transaction management
- PDF report generation
- Vendor management portal
- Emergency alert system
- Document repository

### Phase 4: Maintenance System & Reporting (Planned)

- Maintenance request system
- Audit and activity logging
- Comprehensive reporting dashboard

### Phase 5: Security Hardening & Testing (Planned)

- XSS/CSRF protection
- Two-factor authentication (2FA)
- Unit testing implementation
- GDPR compliance
- Comprehensive documentation

## 🛠 Tech Stack

### Frontend

- **React 18+** with Redux Toolkit for state management
- **Material-UI (MUI)** for component library
- **React Router** for navigation
- **Axios** for API calls
- **Formik & Yup** for form handling and validation

### Backend

- **Express.js** with security middleware
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet, CORS, Morgan** for security and logging

### Security Features

- Password encryption with bcrypt
- JWT token-based authentication
- Rate limiting for API endpoints
- Input validation and sanitization
- XSS protection with DOMPurify
- Session timeout management

## 📁 Project Structure

```
├── backend/
│   ├── middleware/          # Authentication, validation, security
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── server.js           # Express server setup
│   └── package.json
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service functions
│   │   ├── store/          # Redux store and slices
│   │   └── App.js          # Main React component
│   └── package.json
├── package.json            # Root package.json for scripts
└── README.md
```

## 🚀 Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd mern-condominium-management

# 2. Install dependencies
npm run install-all

# 3. Set up environment (see INSTALLATION.md for details)
cd backend
cp .env.example .env
# Edit .env with your MongoDB Atlas URI

# 4. Seed the database
npm run seed

# 5. Start development servers
cd ..
npm run dev
```

**Access the application:**

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

**Default login credentials** (change after first login):

- Administrator: admin@spantower27.org / AdminPassword123!
- President: president@spantower27.org / President123!

📖 **For detailed setup instructions, see [INSTALLATION.md](INSTALLATION.md)**

## 🔧 Installation & Setup

### Prerequisites

- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Complete Setup Guide

For detailed installation instructions, environment configuration, and troubleshooting, please refer to our comprehensive [Installation Guide](INSTALLATION.md).

## 🌐 Environment Variables

Create a `.env` file in the `backend` directory:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FRONTEND_URL=http://localhost:3000
```

## 👥 User Roles & Permissions

### Role Hierarchy (1-5, higher number = more permissions)

1. **Resident** - Basic access to personal information and announcements
2. **Council Member** - Limited administrative access
3. **Secretary/Treasurer** - Meeting and financial management
4. **President** - Approval workflows and high-level management
5. **Administrator** - Full system access and user management

### Role-Specific Features

- **Administrator**: User management, system configuration
- **President**: Approval workflows, vendor management oversight
- **Secretary**: Meeting management, communication hub, user invitations
- **Treasurer**: Financial management, vendor enrollment, expense tracking
- **Council**: Limited access to reports and announcements
- **Residents**: Personal profile, announcements, maintenance requests

## 🔒 Security Features

- **Authentication**: JWT tokens with 15-minute expiration
- **Rate Limiting**: 5 login attempts per hour per IP
- **Account Lockout**: 2-hour lockout after 5 failed attempts
- **Password Policy**: Minimum 8 characters with complexity requirements
- **Input Sanitization**: DOMPurify for XSS prevention
- **HTTPS Enforcement**: Helmet middleware for security headers
- **Session Management**: Automatic timeout after 15 minutes of inactivity

## 📱 Responsive Design

The application is built with a mobile-first approach using Material-UI's responsive design system, ensuring optimal user experience across all devices.

## 🚀 Deployment

### Production Build

```bash
npm run build
```

### Deployment Targets

- **Development**: dev.spantower27.org
- **Production**: spantower27.org (planned)

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 📊 Current Status

- ✅ **Project Structure**: Complete
- ✅ **Backend Setup**: Complete
- ✅ **Frontend Setup**: Complete
- ✅ **Database Schemas**: Complete
- ✅ **Static Home Page**: Complete
- ✅ **Environment Configuration**: Complete
- ✅ **Database Seeding**: Complete
- ⏳ **Authentication System**: Ready for Implementation
- ⏳ **Role-based Dashboards**: Ready for Implementation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

**Span Tower 27 Development Team**

- Email: info@spantower27.org
- Website: https://dev.spantower27.org

---

**Built with ❤️ for the Span Tower 27 Community**
Administrator:
Email: admin@spantower27.org
Password: AdminPassword123!

President:
Email: president@spantower27.org
Password: President123!

Secretary:
Email: secretary@spantower27.org
Password: Secretary123!

Treasurer:
Email: treasurer@spantower27.org
Password: Treasurer123!

Council Member:
Email: council1@spantower27.org
Password: Council123!

Resident:
Email: resident1@spantower27.org
Password: Resident123!
