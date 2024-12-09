import { useState } from 'react';
import { useApi } from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

export const useEmployee = () => {
  const api = useApi();
  const { showToast } = useToast();
  const { t } = useTranslation(['dashboard']);
  const [loading, setLoading] = useState(false);

  const getProfile = async () => {
    try {
      const response = await api.get('/employees/profile');
      return response;
    } catch (error) {
      showToast(t('errors.fetchProfile'), 'error');
      throw error;
    }
  };

  const getSchedule = async (month: string) => {
    try {
      const response = await api.get('/employees/schedule', { params: { month } });
      return response;
    } catch (error) {
      showToast(t('errors.fetchSchedule'), 'error');
      throw error;
    }
  };

  const submitLeaveRequest = async (data: any) => {
    setLoading(true);
    try {
      const response = await api.post('/employees/leave-requests', data);
      showToast(t('success.leaveRequestSubmitted'), 'success');
      return response;
    } catch (error) {
      showToast(t('errors.submitLeaveRequest'), 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    getProfile,
    getSchedule,
    submitLeaveRequest,
    loading
  };
};