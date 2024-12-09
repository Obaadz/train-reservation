import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';

export interface Passenger extends RowDataPacket {
  pid: string;
  name: string;
  email: string;
  password: string;
  loyalty_status: string;
  loyalty_points: number;
}

export const PassengerModel = {
  async create(passenger: Omit<Passenger, 'RowDataPacket'>): Promise<string> {
    const hashedPassword = await bcrypt.hash(passenger.password, 10);
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO passengers (pid, name, email, password, loyalty_status, loyalty_points) VALUES (?, ?, ?, ?, ?, ?)',
      [passenger.pid, passenger.name, passenger.email, hashedPassword, passenger.loyalty_status, passenger.loyalty_points]
    );
    return passenger.pid;
  },

  async findByEmail(email: string): Promise<Passenger | null> {
    const [rows] = await pool.query<Passenger[]>(
      'SELECT * FROM passengers WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  async updateLoyaltyPoints(pid: string, points: number): Promise<void> {
    await pool.query(
      'UPDATE passengers SET loyalty_points = loyalty_points + ? WHERE pid = ?',
      [points, pid]
    );
  }
};