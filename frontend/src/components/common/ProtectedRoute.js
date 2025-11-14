import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isLoading, isAuthenticated } = useSelector((state) => state.auth);

  if (isLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Check role hierarchy if required role is specified
  if (requiredRole) {
    const roleHierarchy = {
      'resident': 1,
      'council': 2,
      'treasurer': 3,
      'secretary': 3,
      'president': 4,
      'administrator': 5
    };

    const userRoleLevel = roleHierarchy[user.role] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
