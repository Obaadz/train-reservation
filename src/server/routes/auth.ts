import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { PassengerModel } from '../models/Passenger';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const isArabic = req.headers['accept-language']?.includes('ar');

    // Find passenger by email
    const passenger = await PassengerModel.findByEmail(email);

    if (!passenger) {
      return res.status(401).json({ 
        message: isArabic ? 'بيانات غير صحيحة' : 'Invalid credentials' 
      });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, passenger.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: isArabic ? 'بيانات غير صحيحة' : 'Invalid credentials' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { 
        id: passenger.pid,
        name: passenger.name,
        email: passenger.email,
        role: 'PASSENGER',
        loyaltyPoints: passenger.loyalty_points,
        loyaltyStatus: passenger.loyalty_status
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      message: req.headers['accept-language']?.includes('ar') 
        ? 'خطأ في تسجيل الدخول' 
        : 'Login error' 
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isArabic = req.headers['accept-language']?.includes('ar');

    // Check if email already exists
    const existingPassenger = await PassengerModel.findByEmail(email);
    if (existingPassenger) {
      return res.status(400).json({
        message: isArabic 
          ? 'البريد الإلكتروني مستخدم بالفعل' 
          : 'Email already exists'
      });
    }

    // Generate unique passenger ID
    const pid = `P${Date.now()}`;

    // Create new passenger
    await PassengerModel.create({
      pid,
      name,
      email,
      password,
      loyalty_status: 'BRONZE',
      loyalty_points: 0
    });

    // Generate token
    const token = jwt.sign(
      { 
        id: pid,
        name,
        email,
        role: 'PASSENGER',
        loyaltyPoints: 0,
        loyaltyStatus: 'BRONZE'
      },
      process.env.JWT_SECRET!,
      { expiresIn: '24h' }
    );

    res.status(201).json({ token });
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