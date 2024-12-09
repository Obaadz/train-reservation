import { useState } from 'react';
import { useApi } from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

interface BookingData {
  journeyId: string;
  seatNumber: string;
  passengerDetails: {
    name: string;
    email: string;
    phone: string;
    idNumber: string;
  };
  paymentDetails: {
    method: string;
    last4: string;
  };
}

export const useBooking = () => {
  const api = useApi();
  const { showToast } = useToast();
  const { t } = useTranslation(['booking']);
  const [loading, setLoading] = useState(false);

  const createBooking = async (data: BookingData) => {
    setLoading(true);
    try {
      const response = await api.post('/bookings', data);
      showToast(t('success.bookingConfirmed'), 'success');
      return response;
    } catch (error) {
      showToast(t('errors.bookingFailed'), 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAvailableSeats = async (journeyId: string, classId: string) => {
    try {
      const response = await api.get(`/journeys/${journeyId}/seats`, {
        params: { classId }
      });
      return response.seats;
    } catch (error) {
      showToast(t('errors.fetchSeats'), 'error');
      throw error;
    }
  };

  return {
    createBooking,
    getAvailableSeats,
    loading
  };
};