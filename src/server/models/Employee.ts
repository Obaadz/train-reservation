import pool from '../config/database';
import { ResultSetHeader } from 'mysql2';
import bcrypt from 'bcryptjs';
import { Employee, EmployeeData, EmployeeUpdate, ContractType, ShiftType, EmployeeRole } from '../types/database';

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
      'SELECT * FROM employees WHERE email = ? AND can_login = true',
      [email]
    );
    return rows[0] || null;
  },

  async create(data: {
    eid: string;
    first_name: string;
    middle_name?: string;
    last_name: string;
    email?: string;
    password?: string;
    salary: number;
    contract_type: ContractType;
    shift_type: ShiftType;
    branch_location: string;
    role: EmployeeRole;
    station_code?: string;
    hire_date: Date;
    can_login: boolean;
    certification_details?: any;
  }): Promise<string> {
    let hashedPassword = null;
    if (data.password && data.can_login) {
      hashedPassword = await bcrypt.hash(data.password, 10);
    }

    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO employees 
       (eid, first_name, middle_name, last_name, email, password, salary, 
        contract_type, shift_type, branch_location, role, station_code, 
        hire_date, can_login, certification_details) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.eid,
        data.first_name,
        data.middle_name,
        data.last_name,
        data.email,
        hashedPassword,
        data.salary,
        data.contract_type,
        data.shift_type,
        data.branch_location,
        data.role,
        data.station_code,
        data.hire_date,
        data.can_login,
        JSON.stringify(data.certification_details)
      ]
    );
    return data.eid;
  },

  async update(eid: string, updates: EmployeeUpdate): Promise<void> {
    const updateData: Record<string, any> = { ...updates };

    if (updates.password) {
      updateData.password = await bcrypt.hash(updates.password, 10);
    }

    if (updates.last_login) {
      updateData.last_login = new Date(updates.last_login);
    }

    const setClauses = Object.entries(updateData)
      .map(([key]) => `${key} = ?`)
      .join(', ');

    const values = Object.values(updateData).map(value =>
      value instanceof Date ? value.toISOString().slice(0, 19).replace('T', ' ') : value
    );

    await pool.query(
      `UPDATE employees SET ${setClauses} WHERE eid = ?`,
      [...values, eid]
    );
  },

  async updateLastLogin(eid: string): Promise<void> {
    await pool.query(
      'UPDATE employees SET last_login = CURRENT_TIMESTAMP WHERE eid = ?',
      [eid]
    );
  },

  async delete(eid: string): Promise<void> {
    await pool.query('DELETE FROM employees WHERE eid = ?', [eid]);
  },

  async validatePassword(employee: Employee, password: string): Promise<boolean> {
    if (!employee.password) return false;
    return bcrypt.compare(password, employee.password);
  }
};