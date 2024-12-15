import { useState } from 'react';
import { useApi } from '../utils/api';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';

interface ReservationData {
  journeyId: string;
  classId: string;
  seatNumber: string;
  passengerDetails: {
    name: string;
    email: string;
    phone: string;
    idNumber: string;
  };
  paymentDetails: {
    cardNumber: string;
    expiryDate: string;
    cvv: string;
  };
}

export const useReservation = () => {
  const api = useApi();
  const { showToast } = useToast();
  const { t } = useTranslation(['booking']);
  const [loading, setLoading] = useState(false);

  const createReservation = async (data: ReservationData) => {
    setLoading(true);
    try {
      const response = await api.post('/bookings', {
        ...data,
        paymentDetails: {
          method: 'CREDIT_CARD',
          last4: data.paymentDetails.cardNumber.slice(-4)
        }
      });

      showToast(t('success.reservationConfirmed'), 'success');
      return response;
    } catch (error) {
      showToast(t('errors.reservationFailed'), 'error');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const calculatePrice = async (journeyId: string, classId: string) => {
    try {
      const response = await api.get(`/bookings/calculate-price`, {
        params: { journeyId, classId }
      });
      return response;
    } catch (error) {
      showToast(t('errors.priceCalculation'), 'error');
      throw error;
    }
  };

  const validateSeat = async (journeyId: string, seatNumber: string): Promise<boolean> => {
    try {
      const response = await api.get('/bookings/validate-seat', {
        params: { journeyId, seatNumber }
      });
      return response.isValid;
    } catch (error) {
      console.error('Error validating seat:', error);
      return false;
    }
  };

  return {
    createReservation,
    calculatePrice,
    validateSeat,
    loading
  };
};