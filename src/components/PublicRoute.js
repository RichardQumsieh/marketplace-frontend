import React from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';

const PublicRoute = ({ children, redirectTo = '/' }) => {
  if (isAuthenticated()) {
    return <Navigate to={redirectTo} />;
  }

  return children;
};

export default PublicRoute;