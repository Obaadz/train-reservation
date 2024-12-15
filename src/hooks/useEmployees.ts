import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';
import { employeeService, Employee, CreateEmployeeData } from '../services/employee.service';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { t } = useTranslation(['dashboard']);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await employeeService.getAll();
      setEmployees(response);
    } catch (error) {
      showToast(t('errors.fetchEmployees'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  const createEmployee = async (data: CreateEmployeeData) => {
    try {
      const response = await employeeService.create(data);
      showToast(t('success.employeeCreated'), 'success');
      await fetchEmployees();
      return response;
    } catch (error) {
      showToast(t('errors.createEmployee'), 'error');
      throw error;
    }
  };

  const updateEmployee = async (id: string, data: Partial<CreateEmployeeData>) => {
    try {
      await employeeService.update(id, data);
      showToast(t('success.employeeUpdated'), 'success');
      await fetchEmployees();
    } catch (error) {
      showToast(t('errors.updateEmployee'), 'error');
      throw error;
    }
  };

  const resetPassword = async (id: string, password: string) => {
    try {
      await employeeService.resetPassword(id, password);
      showToast(t('success.passwordReset'), 'success');
    } catch (error) {
      showToast(t('errors.passwordReset'), 'error');
      throw error;
    }
  };

  return {
    employees,
    loading,
    fetchEmployees,
    createEmployee,
    updateEmployee,
    resetPassword
  };
};