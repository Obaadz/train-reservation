import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Train extends RowDataPacket {
  tid: string;
  serial_number: string;
  total_capacity: number;
  first_class_capacity: number;
  regular_capacity: number;
  maintenance_status: string;
}

export const TrainModel = {
  async findAll(): Promise<Train[]> {
    const [rows] = await pool.query<Train[]>('SELECT * FROM trains');
    return rows;
  },

  async findById(tid: string): Promise<Train | null> {
    const [rows] = await pool.query<Train[]>(
      'SELECT * FROM trains WHERE tid = ?',
      [tid]
    );
    return rows[0] || null;
  },

  async findAvailable(): Promise<Train[]> {
    const [rows] = await pool.query<Train[]>(
      'SELECT * FROM trains WHERE maintenance_status = ?',
      ['ACTIVE']
    );
    return rows;
  }
};