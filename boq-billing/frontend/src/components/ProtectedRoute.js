import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ requireAdmin = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  // Temporarily allow all access for development
  // if (!isAuthenticated) {
  //   return <Navigate to="/login" replace />;
  // }
  
  // if (requireAdmin && !isAdmin) {
  //   return <Navigate to="/" replace />;
  // }
  
  return <Outlet />;
};

export default ProtectedRoute;