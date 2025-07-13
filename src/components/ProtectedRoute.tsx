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
  console.log('=== PROTECTED ROUTE DEBUG ===');
  console.log('ProtectedRoute - Checking authentication and role...');
  console.log('ProtectedRoute - Allowed roles:', allowedRoles);
  
  const isAuth = isAuthenticated();
  console.log('ProtectedRoute - Is authenticated:', isAuth);
  
  if (!isAuth) {
    console.log('ProtectedRoute - User not authenticated, redirecting to home');
    return <Navigate to="/" replace />;
  }
  
  const role = getUserRole();
  console.log('ProtectedRoute - User role:', role);
  console.log('ProtectedRoute - Role type:', typeof role);
  console.log('ProtectedRoute - Allowed roles includes role:', allowedRoles.includes(role as any));
  
  if (!role || !allowedRoles.includes(role)) {
    console.log('ProtectedRoute - Role not allowed or not found');
    console.log('ProtectedRoute - User role:', role);
    console.log('ProtectedRoute - Allowed roles:', allowedRoles);
    console.log('ProtectedRoute - Redirecting to:', roleToDashboard[role] || '/');
    // Redirect to their own dashboard if they try to access another role's dashboard
    return <Navigate to={roleToDashboard[role] || '/'} replace />;
  }
  
  console.log('ProtectedRoute - Access granted for role:', role);
  console.log('=== END PROTECTED ROUTE DEBUG ===');
  return <Outlet />;
};

export default ProtectedRoute; 