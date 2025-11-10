# PAI ERP - Quick Start Guide

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (for backend)
- Git

### Installation Steps

#### 1. Clone or Navigate to Project

```bash
cd "c:\Users\JATHU\Documents\PAI ERP"
```

#### 2. Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

The frontend will run on **http://localhost:3000**

#### 3. Backend Setup (In a new terminal)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# (Use notepad or any text editor)

# Start development server
npm run dev
```

The backend will run on **http://localhost:5000**

## 📁 Project Structure Overview

```
PAI-ERP/
├── frontend/          # React application (Port 3000)
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── modals/        # Modal dialogs
│   │   ├── pages/         # Page components
│   │   ├── sections/      # Feature sections (to be created)
│   │   └── assets/        # Images and icons (to be added)
│   └── package.json
│
└── backend/           # Node.js API (Port 5000)
    ├── config/        # Configuration files
    ├── models/        # Database models
    ├── routes/        # API routes
    ├── controllers/   # Business logic
    ├── middleware/    # Custom middleware
    ├── utils/         # Utility functions
    └── server.js      # Entry point
```

## 🎯 Current Features

### ✅ Implemented (Frontend)

1. **Navigation**
   - Sidebar with menu items
   - Header with user profile
   - Routing configured

2. **Pages** (Showing page names)
   - Admin Dashboard
   - Employees Management
   - Attendance Management
   - Leave Management
   - Recruitment Management
   - Reports & Analytics
   - Employee Profile

3. **Reusable Components**
   - SearchBar
   - Pagination
   - FilterDropdown
   - Breadcrumb
   - Notifications

4. **Buttons**
   - PrimaryButton
   - CancelButton
   - IconButton
   - ActionButton

5. **Modals**
   - DeleteConfirmModal
   - ToastModal
   - SuccessModal
   - UploadDocumentModal
   - GenerateReportModal

### ⏳ To Be Implemented

1. **Frontend**
   - Section components (employee forms, dashboards, etc.)
   - Chart.js/Recharts integration
   - API integration
   - Authentication UI

2. **Backend**
   - Database models
   - API routes
   - Authentication
   - Business logic

## 🔧 Available Scripts

### Frontend

```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
```

### Backend

```bash
npm run dev        # Start with nodemon (auto-reload)
npm start          # Start production server
```

## 📝 Environment Variables

### Backend (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/pai-erp
JWT_SECRET=your_secret_key_here
NODE_ENV=development
```

## 🎨 Tech Stack

### Frontend
- React 18
- React Router DOM v6
- Bootstrap 5
- Chart.js
- Recharts
- Axios

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- JWT
- bcryptjs

## 📚 Next Steps

1. **Add Assets**
   - Add logo to `frontend/src/assets/images/`
   - Add icons to `frontend/src/assets/icons/`

2. **Create Section Components**
   - Employee management forms
   - Dashboard widgets
   - Attendance tracking
   - Leave management

3. **Backend Development**
   - Set up MongoDB connection
   - Create database models
   - Implement API routes
   - Add authentication

4. **Integration**
   - Connect frontend to backend API
   - Implement authentication flow
   - Add data visualization

## 🐛 Troubleshooting

### Port Already in Use

If port 3000 or 5000 is already in use:

**Frontend:**
```bash
# Windows
set PORT=3001 && npm start

# Linux/Mac
PORT=3001 npm start
```

**Backend:**
Update PORT in `.env` file

### Module Not Found

```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### MongoDB Connection Error

Make sure MongoDB is running:
```bash
# Windows
net start MongoDB

# Linux/Mac
sudo systemctl start mongod
```

## 📞 Support

For issues or questions, refer to:
- README.md
- FOLDER_STRUCTURE.md
- Individual README files in backend folders

## 🎉 You're Ready!

Your PAI ERP project is now set up and ready for development!

Visit **http://localhost:3000** to see the frontend application.

