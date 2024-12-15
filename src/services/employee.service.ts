import { api } from '../utils/api';

export interface Employee {
  eid: string;
  name: string;
  email?: string;
  role: string;
  salary: number;
  contractType: string;
  shiftType: string;
  branchLocation: string;
  stationCode?: string;
  hireDate: string;
  canLogin: boolean;
}

export interface CreateEmployeeData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email?: string;
  password?: string;
  salary: number;
  contractType: string;
  shiftType: string;
  branchLocation: string;
  role: string;
  stationCode?: string;
  canLogin: boolean;
}

export const employeeService = {
  getAll: () => api.get('/employees'),

  create: (data: CreateEmployeeData) => api.post('/employees', data),

  update: (id: string, data: Partial<CreateEmployeeData>) => api.put(`/employees/${id}`, data),

  resetPassword: (id: string, password: string) => api.post(`/employees/${id}/reset-password`, { password })
};