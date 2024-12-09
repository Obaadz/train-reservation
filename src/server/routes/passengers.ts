import { Router } from 'express';
import { PassengerModel } from '../models/Passenger';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, isAdmin, async (req, res) => {
  try {
    const passengers = await PassengerModel.findAll();
    res.json(passengers.map(p => ({
      id: p.pid,
      name: p.name,
      email: p.email,
      loyaltyStatus: p.loyalty_status
    })));
  } catch (error) {
    console.error('Passengers retrieval error:', error);
    res.status(500).json({ message: 'خطأ في جلب بيانات المسافرين' });
  }
});

export default router;