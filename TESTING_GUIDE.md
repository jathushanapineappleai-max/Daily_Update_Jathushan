# Testing Guide - MERN Condominium Management System

## 🚀 **Quick Start Testing**

### **Prerequisites**
1. **MongoDB Atlas Account**: Set up a free cluster at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. **Node.js**: Version 16+ installed
3. **Git**: For cloning the repository

### **Setup Steps**

#### **1. Environment Configuration**
```bash
# Navigate to backend directory
cd backend

# Update .env file with your MongoDB connection string
# Replace the MONGODB_URI with your actual connection string
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/condominium_management?retryWrites=true&w=majority
```

#### **2. Install Dependencies & Seed Database**
```bash
# From root directory
npm run install-all

# Seed the database with test data
cd backend
npm run seed
```

#### **3. Start Development Servers**
```bash
# From root directory
npm run dev
```

**Access Points:**
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🧪 **Testing Scenarios**

### **1. Authentication System Testing**

#### **Login Testing**
1. **Navigate to**: http://localhost:3000/login
2. **Test Credentials**:
   ```
   Administrator:
   Email: admin@spantower27.org
   Password: AdminPassword123!
   
   President:
   Email: president@spantower27.org
   Password: President123!
   
   Treasurer:
   Email: treasurer@spantower27.org
   Password: Treasurer123!
   
   Resident:
   Email: resident1@spantower27.org
   Password: Resident123!
   ```

3. **Test Cases**:
   - ✅ Valid login redirects to dashboard
   - ✅ Invalid credentials show error message
   - ✅ Rate limiting after 5 failed attempts
   - ✅ Remember me functionality
   - ✅ Automatic redirect to intended page after login

#### **Password Reset Testing**
1. **Navigate to**: http://localhost:3000/forgot-password
2. **Enter email**: Any of the test user emails
3. **Check console**: Reset token will be logged (email service not configured)
4. **Test reset**: Use the logged token in URL format

#### **Registration Testing**
1. **Navigate to**: http://localhost:3000/register/test-token
2. **Fill form**: Complete registration with new user details
3. **Test validation**: Try invalid emails, weak passwords
4. **Check database**: Verify user creation

### **2. Role-Based Dashboard Testing**

#### **Administrator Dashboard**
- **Login as**: admin@spantower27.org
- **Features to Test**:
  - System health overview
  - User management access
  - Pending approvals section
  - System activity logs
  - All navigation menu items visible

#### **President Dashboard**
- **Login as**: president@spantower27.org
- **Features to Test**:
  - Executive overview
  - Approval workflows
  - Strategic reports access
  - Limited menu items (no user management)

#### **Treasurer Dashboard**
- **Login as**: treasurer@spantower27.org
- **Features to Test**:
  - Financial overview
  - Budget utilization
  - Pending financial approvals
  - Vendor management access

#### **Resident Dashboard**
- **Login as**: resident1@spantower27.org
- **Features to Test**:
  - Personal overview
  - Outstanding dues display
  - Maintenance requests
  - Limited menu access

### **3. Profile Management Testing**

1. **Navigate to**: Profile page from any dashboard
2. **Test Cases**:
   - ✅ View personal information
   - ✅ Edit mode toggle
   - ✅ Update profile information
   - ✅ Change password functionality
   - ✅ Notification preferences
   - ✅ Account status display

### **4. Navigation & Layout Testing**

#### **Desktop Testing**
- ✅ Sidebar navigation
- ✅ Role-based menu items
- ✅ Profile dropdown
- ✅ Logout functionality
- ✅ Page transitions

#### **Mobile Testing**
- ✅ Responsive design
- ✅ Mobile drawer navigation
- ✅ Touch-friendly interface
- ✅ Proper scaling

### **5. Security Testing**

#### **Rate Limiting**
```bash
# Test API rate limiting
for i in {1..6}; do
  curl -X POST http://localhost:5000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"wrong"}'
  echo "Attempt $i"
done
```

#### **Protected Routes**
1. **Without login**: Try accessing http://localhost:3000/dashboard
2. **Should redirect**: To login page
3. **After login**: Should redirect back to intended page

#### **Role-Based Access**
1. **Login as resident**: Try accessing http://localhost:3000/users
2. **Should redirect**: To dashboard (insufficient permissions)
3. **Login as secretary**: Should have access to user management

### **6. API Testing**

#### **Health Check**
```bash
curl http://localhost:5000/api/health
```

#### **Authentication Endpoints**
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@spantower27.org","password":"AdminPassword123!"}'

# Get current user (replace TOKEN with actual token)
curl -H "Authorization: Bearer TOKEN" \
  http://localhost:5000/api/auth/me
```

## 🔍 **Expected Results**

### **Successful Login Flow**
1. Login form validates input
2. Successful authentication returns JWT token
3. User redirected to role-specific dashboard
4. Navigation menu shows appropriate items
5. Profile information displays correctly

### **Dashboard Features**
1. **All Roles**: Personal stats, recent activities, quick actions
2. **Administrator**: System overview, user management, approvals
3. **President**: Executive summary, strategic overview
4. **Treasurer**: Financial dashboard, budget tracking
5. **Secretary**: Communication tools, meeting management
6. **Resident**: Personal overview, service requests

### **Security Features**
1. **Rate Limiting**: Blocks excessive requests
2. **Account Lockout**: Prevents brute force attacks
3. **Session Management**: Automatic timeout and refresh
4. **Role Protection**: Restricts access based on user role

## 🐛 **Troubleshooting**

### **Common Issues**

#### **MongoDB Connection Error**
```
Error: MongoNetworkError: failed to connect to server
```
**Solution**: 
- Check MongoDB Atlas connection string in `.env`
- Ensure IP whitelist includes your IP (or 0.0.0.0/0 for testing)
- Verify database user credentials

#### **Port Already in Use**
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**:
```bash
# Kill process on port 5000
npx kill-port 5000
# Or change PORT in .env file
```

#### **JWT Secret Error**
```
Error: secretOrPrivateKey has a value of "undefined"
```
**Solution**: Ensure JWT_SECRET is set in backend/.env file

#### **CORS Errors**
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution**: Ensure FRONTEND_URL=http://localhost:3000 in backend/.env

### **Debug Mode**
1. **Backend Logs**: Check console for detailed error messages
2. **Frontend Console**: Open browser dev tools for client-side errors
3. **Network Tab**: Monitor API requests and responses
4. **Redux DevTools**: Install extension to monitor state changes

## 📊 **Performance Expectations**

### **Response Times**
- **Login**: < 500ms
- **Dashboard Load**: < 2s
- **Page Navigation**: < 300ms
- **API Calls**: < 200ms

### **Browser Compatibility**
- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Responsive design

## ✅ **Test Checklist**

### **Authentication**
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Password reset flow
- [ ] User registration
- [ ] Logout functionality
- [ ] Session timeout
- [ ] Rate limiting protection

### **Dashboards**
- [ ] Administrator dashboard loads
- [ ] President dashboard loads
- [ ] Treasurer dashboard loads
- [ ] Secretary dashboard loads
- [ ] Council dashboard loads
- [ ] Resident dashboard loads

### **Navigation**
- [ ] Sidebar navigation works
- [ ] Role-based menu items
- [ ] Mobile responsive design
- [ ] Profile dropdown
- [ ] Protected routes

### **Security**
- [ ] Protected routes redirect to login
- [ ] Role-based access control
- [ ] Account lockout after failed attempts
- [ ] Secure logout clears session

---

**🎯 Ready to test! The system provides a complete authentication and dashboard experience with role-based access control.**
