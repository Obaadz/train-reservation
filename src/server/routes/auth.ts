import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { EmployeeModel } from '../models/Employee';
import { PassengerModel } from '../models/Passenger';
import { LoyaltyStatus } from '../types/database';

const router = Router();

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password, userType = 'passenger' } = req.body;
    const isArabic = req.headers['accept-language']?.includes('ar');

    if (!email || !password) {
      return res.status(400).json({
        message: isArabic
          ? 'البريد الإلكتروني وكلمة المرور مطلوبان'
          : 'Email and password are required'
      });
    }

    if (userType === 'employee') {
      const employee = await EmployeeModel.findByEmail(email);

      if (!employee || !employee.can_login) {
        return res.status(401).json({
          message: isArabic
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            : 'Invalid email or password'
        });
      }

      const isValidPassword = await EmployeeModel.validatePassword(employee, password);
      if (!isValidPassword) {
        return res.status(401).json({
          message: isArabic
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            : 'Invalid email or password'
        });
      }

      await EmployeeModel.updateLastLogin(employee.eid);

      const token = jwt.sign(
        {
          id: employee.eid,
          name: `${employee.first_name} ${employee.last_name}`,
          email: employee.email,
          role: employee.role,
          userType: 'employee',
          station: employee.station_code
        },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRY || '24h' }
      );

      res.json({
        token,
        userType: 'employee',
        message: isArabic
          ? 'تم تسجيل الدخول بنجاح'
          : 'Login successful'
      });
    } else {
      const passenger = await PassengerModel.findByEmail(email);

      if (!passenger) {
        return res.status(401).json({
          message: isArabic
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            : 'Invalid email or password'
        });
      }

      const isValidPassword = await PassengerModel.validatePassword(passenger, password);
      if (!isValidPassword) {
        return res.status(401).json({
          message: isArabic
            ? 'البريد الإلكتروني أو كلمة المرور غير صحيحة'
            : 'Invalid email or password'
        });
      }

      await PassengerModel.updateLastLogin(passenger.pid);

      const token = jwt.sign(
        {
          id: passenger.pid,
          name: passenger.name,
          email: passenger.email,
          role: 'PASSENGER',
          userType: 'passenger',
          loyaltyPoints: passenger.loyalty_points,
          loyaltyStatus: passenger.loyalty_status
        },
        process.env.JWT_SECRET!,
        { expiresIn: process.env.JWT_EXPIRY || '24h' }
      );

      res.json({
        token,
        userType: 'passenger',
        message: isArabic
          ? 'تم تسجيل الدخول بنجاح'
          : 'Login successful'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في تسجيل الدخول'
        : 'Login error'
    });
  }
});

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone } = req.body;
    const isArabic = req.headers['accept-language']?.includes('ar');

    if (!name || !email || !password) {
      return res.status(400).json({
        message: isArabic
          ? 'جميع الحقول مطلوبة'
          : 'All fields are required'
      });
    }

    const existingPassenger = await PassengerModel.findByEmail(email);
    if (existingPassenger) {
      return res.status(400).json({
        message: isArabic
          ? 'البريد الإلكتروني مستخدم بالفعل'
          : 'Email already exists'
      });
    }

    const pid = `P${Date.now()}`;

    await PassengerModel.create({
      pid,
      name,
      email,
      password,
      phone,
      loyalty_status: 'BRONZE' as LoyaltyStatus,
      loyalty_points: 0
    });

    const token = jwt.sign(
      {
        id: pid,
        name,
        email,
        role: 'PASSENGER',
        userType: 'passenger',
        loyaltyPoints: 0,
        loyaltyStatus: 'BRONZE'
      },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRY || '24h' }
    );

    res.status(201).json({
      token,
      message: isArabic
        ? 'تم إنشاء الحساب بنجاح'
        : 'Account created successfully'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في إنشاء الحساب'
        : 'Registration error'
    });
  }
});

export default router;