import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Booking {
  booking_id: string;
  journey_id: string;
  train_id: string;
  seat_number: string;
  booking_status: 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';
  booking_date: string;
  payment_status: 'PENDING' | 'COMPLETED' | 'REFUNDED';
  amount: number;
  from: string;
  to: string;
  departure_time: string;
  arrival_time: string;
}

export const useBookingHistory = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      if (!isAuthenticated) return;

      try {
        const response = await fetch('/api/bookings/my-bookings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }

        const data = await response.json();
        setBookings(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated]);

  const cancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to cancel booking');
      }

      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking.booking_id === bookingId
            ? { ...booking, booking_status: 'CANCELLED' as const }
            : booking
        )
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to cancel booking');
    }
  };

  return { bookings, loading, error, cancelBooking };
};