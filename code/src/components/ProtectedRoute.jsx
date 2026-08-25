import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { getCurrentUser } from '../utils/localStorage';

export const ProtectedRoute = ({ allowedRoles = [] }) => {
  const user = getCurrentUser();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    // Redirect to respective dashboard if role doesn't match
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
