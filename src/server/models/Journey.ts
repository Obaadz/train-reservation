import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Journey extends RowDataPacket {
  jid: string;
  train_id: string;
}

export interface JourneyStation extends RowDataPacket {
  journey_id: string;
  station_code: string;
  sequence_number: number;
  arrival_time: string;
  departure_time: string;
  platform_number: number;
}

export const JourneyModel = {
  async findAll(): Promise<Journey[]> {
    const [rows] = await pool.query<Journey[]>('SELECT * FROM journeys');
    return rows;
  },

  async findById(jid: string): Promise<Journey | null> {
    const [rows] = await pool.query<Journey[]>(
      'SELECT * FROM journeys WHERE jid = ?',
      [jid]
    );
    return rows[0] || null;
  },

  async getJourneyStations(jid: string): Promise<JourneyStation[]> {
    const [rows] = await pool.query<JourneyStation[]>(
      'SELECT * FROM journey_stations WHERE journey_id = ? ORDER BY sequence_number',
      [jid]
    );
    return rows;
  },

  async searchJourneys(fromStation: string, toStation: string, date: string): Promise<any[]> {
    const [rows] = await pool.query(
      `SELECT j.*, js1.departure_time as departure, js2.arrival_time as arrival,
       t.total_capacity, t.first_class_capacity, t.regular_capacity
       FROM journeys j
       INNER JOIN journey_stations js1 ON j.jid = js1.journey_id
       INNER JOIN journey_stations js2 ON j.jid = js2.journey_id
       INNER JOIN trains t ON j.train_id = t.tid
       WHERE js1.station_code = ? AND js2.station_code = ?
       AND DATE(js1.departure_time) = ?
       AND js1.sequence_number < js2.sequence_number`,
      [fromStation, toStation, date]
    );
    return rows;
  }
};