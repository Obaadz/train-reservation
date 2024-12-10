import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  const isArabic = req.headers['accept-language']?.includes('ar');

  if (!token) {
    return res.status(401).json({
      message: isArabic ? 'يجب تسجيل الدخول' : 'Authentication required'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
      email: string;
      role: string;
      userType: 'passenger' | 'employee';
      name?: string;
      loyaltyPoints?: number;
      loyaltyStatus?: string;
      station?: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({
      message: isArabic ? 'جلسة غير صالحة' : 'Invalid session'
    });
  }
};

export const isAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isArabic = req.headers['accept-language']?.includes('ar');

  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      message: isArabic ? 'غير مصرح لك بالوصول' : 'Access denied'
    });
  }
  next();
};

export const isEmployee = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isArabic = req.headers['accept-language']?.includes('ar');

  if (!req.user || req.user.userType !== 'employee') {
    return res.status(403).json({
      message: isArabic ? 'غير مصرح لك بالوصول' : 'Access denied'
    });
  }
  next();
};