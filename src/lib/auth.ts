import { User } from './userApi';

export function getCurrentUserFromStorage(): User | null {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export function getUserRole(): 'USER' | 'ADMIN' | 'TRAVEL_AGENT' | null {
  const user = getCurrentUserFromStorage();
  return user?.userRole || null;
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem('token');
} 