import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/api';

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = authService.getToken();

  if (!token) {
    // Redirect unauthorized users to /login and remember attempted URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
