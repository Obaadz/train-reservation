import { useState, useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useTranslation } from 'react-i18next';
import { bookingService, Booking } from '../services/booking.service';

export const useBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>();
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const { t } = useTranslation(['dashboard']);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const response = await bookingService.getAllBookings();
      setBookings(response);
    } catch (error) {
      showToast(t('errors.fetchBookings'), 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast, t]);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await bookingService.updateBookingStatus(bookingId, status);
      showToast(t('success.bookingUpdated'), 'success');
      await fetchBookings();
    } catch (error) {
      showToast(t('errors.updateBooking'), 'error');
      throw error;
    }
  };

  const cancelBooking = async (bookingId: string) => {
    try {
      await bookingService.cancelBooking(bookingId);
      showToast(t('success.bookingCancelled'), 'success');
      await fetchBookings();
    } catch (error) {
      showToast(t('errors.cancelBooking'), 'error');
      throw error;
    }
  };

  return {
    bookings,
    loading,
    fetchBookings,
    updateBookingStatus,
    cancelBooking
  };
};