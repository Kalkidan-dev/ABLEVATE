import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // use this instead of custom hook if possible

const ProtectedRoute = ({ children, role }) => {
  const { user } = useAuth();

  if (!user || !user.token) return <Navigate to="/login" replace />;

  if (role && user.role !== role) return <Navigate to="/unauthorized" replace />;

  return children;
};

export default ProtectedRoute;
