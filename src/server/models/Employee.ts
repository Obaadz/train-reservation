import pool from '../config/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

export interface Employee extends RowDataPacket {
  eid: string;
  name: string;
  role: 'RECEPTIONIST' | 'DRIVER' | 'TECHNICIAN' | 'CLEANER';
  branch: string;
  salary: number;
  shift_start: string;
  shift_end: string;
  contract_type: string;
  certification_details: string;
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

  async create(employee: Omit<Employee, 'RowDataPacket'>): Promise<string> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO employees (eid, name, role, branch, salary, shift_start, shift_end, contract_type, certification_details) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [employee.eid, employee.name, employee.role, employee.branch, employee.salary, employee.shift_start, employee.shift_end, employee.contract_type, employee.certification_details]
    );
    return employee.eid;
  }
};