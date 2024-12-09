import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Station extends RowDataPacket {
  scode: string;
  name: string;
  capacity: number;
  city: string;
  district: string;
  street_name: string;
  platform_count: number;
}

export const StationModel = {
  async findAll(): Promise<Station[]> {
    const [rows] = await pool.query<Station[]>('SELECT * FROM stations');
    return rows;
  },

  async findByCode(scode: string): Promise<Station | null> {
    const [rows] = await pool.query<Station[]>(
      'SELECT * FROM stations WHERE scode = ?',
      [scode]
    );
    return rows[0] || null;
  },

  async create(station: Omit<Station, 'RowDataPacket'>): Promise<string> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO stations (scode, name, capacity, city, district, street_name, platform_count) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [station.scode, station.name, station.capacity, station.city, station.district, station.street_name, station.platform_count]
    );
    return station.scode;
  }
};