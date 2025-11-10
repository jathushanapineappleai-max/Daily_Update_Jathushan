import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

// Minimal placeholder guard: always allow for now
export default function PrivateRoute() {
  const isAuthed = true; // replace with real auth later
  return isAuthed ? <Outlet /> : <Navigate to="/login" replace />;
}

