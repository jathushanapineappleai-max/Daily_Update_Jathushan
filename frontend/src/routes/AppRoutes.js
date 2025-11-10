import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../pages/Admin-Dashboard';
import Employees from '../pages/Employees';
import EmployeeProfile from '../pages/EmployeeProfile';
import Leaves from '../pages/Leaves';
import Reports from '../pages/Reports';
import Profile from '../pages/Profile';
import Login from '../pages/Login';
import ForgotPassword from '../pages/ForgotPassword';
import EnterOTP from '../pages/Enter-OTP';
import UpdatePassword from '../pages/Update password';
import NotFound from '../pages/NotFound';
import Attendence from '../pages/Attendence';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/enter-otp" element={<EnterOTP />} />
      <Route path="/update-password" element={<UpdatePassword />} />

      <Route element={<PrivateRoute />}> 
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<AdminDashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/:id" element={<EmployeeProfile />} />
        <Route path="/attendance" element={<Attendence />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

