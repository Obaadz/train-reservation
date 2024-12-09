import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';

export interface Employee extends RowDataPacket {
  eid: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  email?: string;
  password?: string;
  salary: number;
  contract_type: 'FULL_TIME' | 'PART_TIME' | 'TEMPORARY';
  shift_type: 'MORNING' | 'EVENING' | 'NIGHT';
  branch_location: string;
  role: 'RECEPTIONIST' | 'DRIVER' | 'TECHNICIAN' | 'CLEANER' | 'STAFF' | 'MANAGER';
  station_code?: string;
  hire_date: Date;
  can_login: boolean;
  certification_details?: any;
}

export const EmployeeModel = {
  async findAll(): Promise<Employee[]> {
    const [rows] = await pool.query<Employee[]>('SELECT * FROM employees');
    return rows;
  },

  async findById(eid: string): Promise<Employee | null> {
    const [rows] = await pool.query<Employee[]>(
      'SELECT * FROM employees WHERE eid = ?',
      [eid]
    );
    return rows[0] || null;
  },

  async findByEmail(email: string): Promise<Employee | null> {
    const [rows] = await pool.query<Employee[]>(
      'SELECT * FROM employees WHERE email = ?',
      [email]
    );
    return rows[0] || null;
  },

  async create(employee: Omit<Employee, 'RowDataPacket'>): Promise<string> {
    let hashedPassword = null;
    if (employee.password && employee.can_login) {
      hashedPassword = await bcrypt.hash(employee.password, 10);
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO employees 
       (eid, first_name, middle_name, last_name, email, password, salary, 
        contract_type, shift_type, branch_location, role, station_code, 
        hire_date, can_login, certification_details) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        employee.eid, employee.first_name, employee.middle_name, employee.last_name,
        employee.email, hashedPassword, employee.salary, employee.contract_type,
        employee.shift_type, employee.branch_location, employee.role,
        employee.station_code, employee.hire_date, employee.can_login,
        JSON.stringify(employee.certification_details)
      ]
    );
    return employee.eid;
  },

  async update(eid: string, updates: Partial<Employee>): Promise<void> {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const setClauses = Object.keys(updates)
      .map(key => `${key} = ?`)
      .join(', ');

    await pool.query(
      `UPDATE employees SET ${setClauses} WHERE eid = ?`,
      [...Object.values(updates), eid]
    );
  },

  async delete(eid: string): Promise<void> {
    await pool.query('DELETE FROM employees WHERE eid = ?', [eid]);
  }
};