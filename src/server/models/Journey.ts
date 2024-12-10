import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { Journey, JourneyStatus, JourneySearchResult } from '../types/database';

interface JourneyStation extends RowDataPacket {
  journey_id: string;
  station_code: string;
  sequence_number: number;
  arrival_time: string;
  departure_time: string;
  platform_number: number;
}

interface JourneyWithDetails extends Journey {
  departure: string;
  arrival: string;
  class_capacities: Record<string, number>;
  maintenance_status: string;
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

  async searchJourneys(fromStation: string, toStation: string, date: string): Promise<JourneySearchResult[]> {
    const [rows] = await pool.query<JourneyWithDetails[]>(
      `SELECT j.*, js1.departure_time as departure, js2.arrival_time as arrival,
       t.class_capacities, t.maintenance_status
       FROM journeys j
       INNER JOIN journey_stations js1 ON j.jid = js1.journey_id
       INNER JOIN journey_stations js2 ON j.jid = js2.journey_id
       INNER JOIN trains t ON j.train_id = t.tid
       WHERE js1.station_code = ? AND js2.station_code = ?
       AND DATE(js1.departure_time) = ?
       AND js1.sequence_number < js2.sequence_number
       AND j.status = 'SCHEDULED'
       AND t.maintenance_status = 'ACTIVE'`,
      [fromStation, toStation, date]
    );

    return rows.map(row => ({
      jid: row.jid,
      train_id: row.train_id,
      departure: row.departure,
      arrival: row.arrival,
      base_price: row.base_price,
      available_classes: JSON.parse(JSON.stringify(row.class_capacities))
    }));
  },

  async calculatePrice(journeyId: string, classId: string): Promise<number> {
    interface PriceRow extends RowDataPacket {
      base_price: number;
      price_multiplier: number;
    }

    const [rows] = await pool.query<PriceRow[]>(
      `SELECT j.base_price, tc.price_multiplier
       FROM journeys j
       INNER JOIN train_classes tc ON tc.class_id = ?
       WHERE j.jid = ?`,
      [classId, journeyId]
    );

    if (!rows.length) {
      throw new Error('Journey or class not found');
    }

    const { base_price, price_multiplier } = rows[0];
    return base_price * price_multiplier;
  },

  async getAvailableSeats(journeyId: string, classId: string): Promise<string[]> {
    interface BookedSeat extends RowDataPacket {
      seat_number: string;
    }

    interface TrainCapacity extends RowDataPacket {
      class_capacities: string;
    }

    const [bookedSeats] = await pool.query<BookedSeat[]>(
      `SELECT seat_number
       FROM bookings
       WHERE journey_id = ? AND class_id = ? AND booking_status = 'CONFIRMED'`,
      [journeyId, classId]
    );

    const [journey] = await pool.query<TrainCapacity[]>(
      `SELECT t.class_capacities
       FROM journeys j
       INNER JOIN trains t ON j.train_id = t.tid
       WHERE j.jid = ?`,
      [journeyId]
    );

    if (!journey.length) {
      throw new Error('Journey not found');
    }

    const classCapacities = JSON.parse(journey[0].class_capacities);
    const totalSeats = classCapacities[classId] || 0;
    const bookedSeatNumbers = bookedSeats.map(seat => seat.seat_number);

    const availableSeats: string[] = [];
    for (let i = 1; i <= totalSeats; i++) {
      const seatNumber = `${classId}-${i.toString().padStart(3, '0')}`;
      if (!bookedSeatNumbers.includes(seatNumber)) {
        availableSeats.push(seatNumber);
      }
    }

    return availableSeats;
  },

  async checkSeatAvailability(journeyId: string, seatNumber: string): Promise<boolean> {
    interface SeatCount extends RowDataPacket {
      count: number;
    }

    const [rows] = await pool.query<SeatCount[]>(
      `SELECT COUNT(*) as count
       FROM bookings
       WHERE journey_id = ? AND seat_number = ? AND booking_status = 'CONFIRMED'`,
      [journeyId, seatNumber]
    );

    return rows[0].count === 0;
  },

  async updateStatus(journeyId: string, status: JourneyStatus): Promise<void> {
    await pool.query(
      'UPDATE journeys SET status = ? WHERE jid = ?',
      [status, journeyId]
    );
  }
};