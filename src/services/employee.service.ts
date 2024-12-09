import { createApiClient } from '../utils/api';

const api = createApiClient(() => localStorage.getItem('token'));

export const employeeService = {
  getProfile: () =>
    api.get('/employees/profile'),

  getSchedule: (month: string) =>
    api.get('/employees/schedule', { params: { month } }),

  getLeaveRequests: () =>
    api.get('/employees/leave-requests'),

  submitLeaveRequest: (data: any) =>
    api.post('/employees/leave-requests', data),

  updateProfile: (data: any) =>
    api.put('/employees/profile', data),
};