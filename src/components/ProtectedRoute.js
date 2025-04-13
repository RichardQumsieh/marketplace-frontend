import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const ProtectedRoute = ({ children, allowedUserTypes, redirectTo = '/' }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/sign-in" />;
  }
  
  if (allowedUserTypes && !allowedUserTypes.includes(localStorage.getItem('type'))) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default ProtectedRoute;