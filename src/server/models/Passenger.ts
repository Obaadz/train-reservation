import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';
import { Passenger, PassengerUpdate, BaseModel, LoyaltyStatus } from '../types/database';

export const PassengerModel = {
  async findAll(): Promise<Passenger[]> {
    const [rows] = await pool.query<Passenger[]>('SELECT * FROM passengers');
    return rows;
  },

  async findById(pid: string): Promise<Passenger | null> {
    const [rows] = await pool.query<Passenger[]>(
      'SELECT * FROM passengers WHERE pid = ?',
      [pid]
    );
    return rows[0] || null;
  },

  async findByEmail(email: string): Promise<Passenger | null> {
    const [rows] = await pool.query<Passenger[]>(
      'SELECT * FROM passengers WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  async create(data: {
    pid: string;
    name: string;
    email: string;
    password: string;
    phone?: string;
    loyalty_status?: LoyaltyStatus;
    loyalty_points?: number;
  }): Promise<string> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO passengers 
       (pid, name, email, password, phone, loyalty_status, loyalty_points) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.pid,
        data.name,
        data.email,
        hashedPassword,
        data.phone || null,
        data.loyalty_status || 'BRONZE',
        data.loyalty_points || 0
      ]
    );

    return data.pid;
  },

  async update(pid: string, updates: PassengerUpdate): Promise<void> {
    const updateData: Record<string, any> = { ...updates };

    if (updates.password) {
      updateData.password = await bcrypt.hash(updates.password, 10);
    }

    if (updates.last_login) {
      updateData.last_login = new Date(updates.last_login);
    }

    if (updates.loyalty_points) {
      await this.updateLoyaltyPoints(pid, updates.loyalty_points);

      delete updateData.loyalty_points;
    }

    const setClauses = Object.entries(updateData)
      .map(([key]) => `${key} = ?`)
      .join(', ');

    const values = Object.values(updateData).map(value =>
      value instanceof Date ? value.toISOString().slice(0, 19).replace('T', ' ') : value
    );

    await pool.query(
      `UPDATE passengers SET ${setClauses} WHERE pid = ?`,
      [...values, pid]
    );
  },

  async updateLastLogin(pid: string): Promise<void> {
    await pool.query(
      'UPDATE passengers SET last_login = CURRENT_TIMESTAMP WHERE pid = ?',
      [pid]
    );
  },

  async updateLoyaltyPoints(pid: string, points: number): Promise<void> {
    await pool.query(
      'UPDATE passengers SET loyalty_points = loyalty_points + ? WHERE pid = ?',
      [points, pid]
    );

    await pool.query(`
      UPDATE passengers 
      SET loyalty_status = 
        CASE
          WHEN loyalty_points >= 5000 THEN 'PLATINUM'
          WHEN loyalty_points >= 2500 THEN 'GOLD'
          WHEN loyalty_points >= 1000 THEN 'SILVER'
          ELSE 'BRONZE'
        END
      WHERE pid = ?
    `, [pid]);
  },

  async validatePassword(passenger: Passenger, password: string): Promise<boolean> {
    return bcrypt.compare(password, passenger.password);
  }
};