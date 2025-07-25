import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '@/lib/auth';

interface ProtectedRouteProps {
  allowedRoles: Array<'ADMIN' | 'TRAVEL_AGENT' | 'USER'>;
}

const roleToDashboard: Record<string, string> = {
  ADMIN: '/admin',
  TRAVEL_AGENT: '/agent',
  USER: '/dashboard',
};

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }
  const role = getUserRole();
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={roleToDashboard[role || 'USER'] || '/'} replace />;
  }
  return <Outlet />;
};

export default ProtectedRoute; 