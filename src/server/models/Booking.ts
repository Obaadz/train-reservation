import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Booking extends RowDataPacket {
  booking_id: string;
  passenger_id: string;
  journey_id: string;
  train_id: string;
  class_id: string;
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

  async findAll(): Promise<Booking[]> {
    const [rows] = await pool.query<Booking[]>(`
     SELECT b.*, p.name as passenger_name,
       js1.station_code as from_station, js2.station_code as to_station,
       s1.name_ar as from_name_ar, s1.name_en as from_name_en,
       s2.name_ar as to_name_ar, s2.name_en as to_name_en
FROM bookings b
INNER JOIN passengers p ON b.passenger_id = p.pid
INNER JOIN journeys j ON b.journey_id = j.jid
LEFT JOIN journey_stations js1 ON j.jid = js1.journey_id AND js1.sequence_number = 1
LEFT JOIN journey_stations js2 ON j.jid = js2.journey_id
    AND js2.sequence_number = (
        SELECT MAX(sequence_number) 
        FROM journey_stations 
        WHERE journey_id = j.jid
    )
LEFT JOIN stations s1 ON js1.station_code = s1.scode
LEFT JOIN stations s2 ON js2.station_code = s2.scode
ORDER BY b.booking_date DESC;
    `);
    return rows;
  },

  async findById(bookingId: string): Promise<Booking | null> {
    const [rows] = await pool.query<Booking[]>(
      'SELECT * FROM bookings WHERE booking_id = ?',
      [bookingId]
    );
    return rows[0] || null;
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
  },

  async update(bookingId: string, booking: Omit<Booking, 'RowDataPacket'>): Promise<void> {
    // Check if the passenger_id exists in the passengers table
    if (booking.passenger_id) {
      const [result] = await pool.query(
        `SELECT pid FROM passengers WHERE pid = ?`,
        [booking.passenger_id]
      );

      if ((result as any[]).length === 0) {
        throw new Error(`Passenger with ID ${booking.passenger_id} does not exist.`);
      }
    }

    // Proceed with the update if the foreign key exists or is null
    await pool.query(
      `UPDATE bookings 
       SET coach_number = ?, 
           seat_number = ?, booking_status = ?, payment_status = ?, 
           payment_method = ?, amount = ?, class_id = ?
       WHERE booking_id = ?`,
      [

        booking.coach_number, booking.seat_number, booking.booking_status,
        booking.payment_status, booking.payment_method,
        booking.amount, booking.class_id, bookingId
      ]
    );
  }
};