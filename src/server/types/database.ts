import { RowDataPacket } from 'mysql2';

export interface BaseModel extends RowDataPacket {
  created_at?: Date;
  updated_at?: Date;
}

// Employee types
export type ContractType = 'FULL_TIME' | 'PART_TIME' | 'TEMPORARY';
export type ShiftType = 'MORNING' | 'EVENING' | 'NIGHT';
export type EmployeeRole = 'RECEPTIONIST' | 'DRIVER' | 'TECHNICIAN' | 'CLEANER' | 'STAFF' | 'MANAGER' | 'ADMIN';

export interface EmployeeData {
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
  last_login?: Date;
}

export interface Employee extends EmployeeData, BaseModel { }

export type EmployeeUpdate = Partial<Omit<EmployeeData, 'eid'>>;

// Passenger types
export type LoyaltyStatus = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM';

export interface PassengerData {
  pid: string;
  name: string;
  email: string;
  password: string;
  phone?: string;
  loyalty_status: LoyaltyStatus;
  loyalty_points: number;
  last_login?: Date;
}

export interface Passenger extends PassengerData, BaseModel { }

export type PassengerUpdate = Partial<Omit<PassengerData, 'pid'>>;

// Journey types
export type JourneyStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface JourneyData {
  jid: string;
  train_id: string;
  base_price: number;
  status: JourneyStatus;
  class_capacities: Record<string, number>;
}

export interface Journey extends JourneyData, BaseModel { }

export interface JourneySearchResult {
  jid: string;
  train_id: string;
  departure: string;
  arrival: string;
  base_price: number;
  available_classes: {
    [key: string]: number;
  };
}

export type JourneyUpdate = Partial<Omit<JourneyData, 'jid'>>;