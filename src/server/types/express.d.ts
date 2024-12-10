import { Request } from 'express';
import { Employee, Passenger } from './database';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
        userType: 'passenger' | 'employee';
        name?: string;
        loyaltyPoints?: number;
        loyaltyStatus?: string;
        station?: string;
      };
    }
  }
}