import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

// Minimal placeholder role guard: always allow for now
export default function RoleRoute({ allow = [] }) {
  const hasRole = true; // replace with real role check later
  return hasRole ? <Outlet /> : <Navigate to="/" replace />;
}

