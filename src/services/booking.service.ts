import { api } from '../utils/api';

export interface Booking {
  booking_id: string;
  passenger_name: string;
  journey_id: string;
  train_id: string;
  from: string;
  to: string;
  booking_date: string;
  booking_status: 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';
  payment_status: 'PENDING' | 'COMPLETED' | 'REFUNDED';
  amount: string;
  class_id: string;
  seat_number: string;
}

export const bookingService = {
  getAllBookings: () => api.get('/bookings/all'),

  updateBookingStatus: (bookingId: string, status: string) =>
    api.put(`/bookings/${bookingId}/status`, { status }),

  cancelBooking: (bookingId: string) =>
    api.post(`/bookings/${bookingId}/cancel`),

  getBookingDetails: (bookingId: string) =>
    api.get(`/bookings/${bookingId}`),
};