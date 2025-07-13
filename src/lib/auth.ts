import { UserResponse } from './userApi';

export function getCurrentUserFromStorage(): UserResponse | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getUserRole(): 'USER' | 'ADMIN' | 'TRAVEL_AGENT' | null {
  const user = getCurrentUserFromStorage();
  const role = user?.userRole;
  if (role === 'USER' || role === 'ADMIN' || role === 'TRAVEL_AGENT') {
    return role;
  }
  return null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
} 