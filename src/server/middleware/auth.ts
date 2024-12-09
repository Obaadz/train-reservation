import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticateToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      message: req.headers['accept-language']?.includes('ar') 
        ? 'يجب تسجيل الدخول' 
        : 'Authentication required' 
    });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ 
      message: req.headers['accept-language']?.includes('ar') 
        ? 'جلسة غير صالحة' 
        : 'Invalid session' 
    });
  }
};

export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user?.role !== 'ADMIN') {
    return res.status(403).json({ 
      message: req.headers['accept-language']?.includes('ar') 
        ? 'غير مصرح لك بالوصول' 
        : 'Access denied' 
    });
  }
  next();
};