import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Booking extends RowDataPacket {
  booking_id: string;
  passenger_id: string;
  journey_id: string;
  train_id: string;
  coach_number: string;
  seat_number: string;
  booking_status: 'CONFIRMED' | 'WAITLISTED' | 'CANCELLED';
  booking_date: Date;
  payment_status: 'PENDING' | 'COMPLETED' | 'REFUNDED';
  payment_method: string;
  amount: string;
}

export const BookingModel = {
  async create(booking: Omit<Booking, 'RowDataPacket'>): Promise<string> {
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO bookings 
       (booking_id, passenger_id, journey_id, train_id, coach_number, 
        seat_number, booking_status, booking_date, payment_status, 
        payment_method, amount, class_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        booking.booking_id, booking.passenger_id, booking.journey_id,
        booking.train_id, booking.coach_number, booking.seat_number,
        booking.booking_status, booking.booking_date, booking.payment_status,
        booking.payment_method, booking.amount, booking.class_id
      ]
    );
    return booking.booking_id;
  },

  async findByPassenger(passengerId: string): Promise<Booking[]> {
    const [rows] = await pool.query<Booking[]>(
      'SELECT * FROM bookings WHERE passenger_id = ? ORDER BY booking_date DESC',
      [passengerId]
    );
    return rows;
  },

  async updateStatus(bookingId: string, status: Booking['booking_status']): Promise<void> {
    await pool.query(
      'UPDATE bookings SET booking_status = ? WHERE booking_id = ?',
      [status, bookingId]
    );
  },

  async updatePaymentStatus(bookingId: string, status: Booking['payment_status']): Promise<void> {
    await pool.query(
      'UPDATE bookings SET payment_status = ? WHERE booking_id = ?',
      [status, bookingId]
    );
  }
};