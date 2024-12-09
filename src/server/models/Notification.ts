import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Notification extends RowDataPacket {
  notification_id: string;
  passenger_id: string;
  message: string;
  type: string;
  created_at: Date;
  status: 'SENT' | 'DELIVERED' | 'READ';
}

export const NotificationModel = {
  async create(notification: Omit<Notification, 'RowDataPacket'>): Promise<string> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO notifications (notification_id, passenger_id, message, type, created_at, status) VALUES (?, ?, ?, ?, ?, ?)',
      [notification.notification_id, notification.passenger_id, notification.message, notification.type, notification.created_at, notification.status]
    );
    return notification.notification_id;
  },

  async findByPassenger(passengerId: string): Promise<Notification[]> {
    const [rows] = await pool.query<Notification[]>(
      'SELECT * FROM notifications WHERE passenger_id = ? ORDER BY created_at DESC',
      [passengerId]
    );
    return rows;
  },

  async markAsRead(notificationId: string): Promise<void> {
    await pool.query(
      'UPDATE notifications SET status = ? WHERE notification_id = ?',
      ['READ', notificationId]
    );
  }
};