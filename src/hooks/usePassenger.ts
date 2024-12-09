import { useState } from 'react';
import { useApi } from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

export const usePassenger = () => {
  const api = useApi();
  const { showToast } = useToast();
  const { t } = useTranslation(['dashboard']);
  const [loading, setLoading] = useState(false);

  const getAllPassengers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/passengers');
      return response;
    } catch (error) {
      showToast(t('errors.fetchPassengers'), 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updatePassenger = async (id: string, data: any) => {
    try {
      const response = await api.put(`/passengers/${id}`, data);
      showToast(t('success.passengerUpdated'), 'success');
      return response;
    } catch (error) {
      showToast(t('errors.updatePassenger'), 'error');
      throw error;
    }
  };

  const resetPassword = async (id: string, password: string) => {
    try {
      const response = await api.post(`/passengers/${id}/reset-password`, { password });
      showToast(t('success.passwordReset'), 'success');
      return response;
    } catch (error) {
      showToast(t('errors.passwordReset'), 'error');
      throw error;
    }
  };

  return {
    getAllPassengers,
    updatePassenger,
    resetPassword,
    loading
  };
};