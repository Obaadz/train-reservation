import { useState } from 'react';
import { useApi } from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

export const useJourney = () => {
  const api = useApi();
  const { showToast } = useToast();
  const { t } = useTranslation(['search']);
  const [loading, setLoading] = useState(false);

  const searchJourneys = async (params: {
    from: string;
    to: string;
    date: string;
    passengers?: number;
  }) => {
    setLoading(true);
    try {
      const response = await api.get('/journeys/search', { params });
      return response;
    } catch (error) {
      showToast(t('errors.searchFailed'), 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getJourneyDetails = async (journeyId: string) => {
    try {
      const response = await api.get(`/journeys/${journeyId}`);
      return response;
    } catch (error) {
      showToast(t('errors.fetchJourney'), 'error');
      throw error;
    }
  };

  return {
    searchJourneys,
    getJourneyDetails,
    loading
  };
};