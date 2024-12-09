import { createApiClient } from '../utils/api';

const api = createApiClient(() => localStorage.getItem('token'));

export interface LoginCredentials {
  email: string;
  password: string;
  userType: 'passenger' | 'employee';
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export const authService = {
  login: (credentials: LoginCredentials) =>
    api.post('/auth/login', credentials, { requiresAuth: false }),

  register: (data: RegisterData) =>
    api.post('/auth/register', data, { requiresAuth: false }),

  verifyToken: () =>
    api.get('/auth/verify'),

  logout: () =>
    api.post('/auth/logout'),
};