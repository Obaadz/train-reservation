import { Router } from 'express';
import { NotificationModel } from '../models/Notification';
import { authenticateToken, isAdmin } from '../middleware/auth';

const router = Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const notifications = await NotificationModel.findByPassenger(req.user.id);
    res.json(notifications);
  } catch (error) {
    console.error('Notifications retrieval error:', error);
    res.status(500).json({ message: 'خطأ في جلب الإشعارات' });
  }
});

router.post('/:id/read', authenticateToken, async (req, res) => {
  try {
    await NotificationModel.markAsRead(req.params.id);
    res.json({ message: 'تم تحديث حالة الإشعار' });
  } catch (error) {
    console.error('Notification update error:', error);
    res.status(500).json({ message: 'خطأ في تحديث حالة الإشعار' });
  }
});

// New endpoint for sending notifications (admin only)
router.post('/send', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { message, passengerIds, type } = req.body;

    if (!message || !passengerIds || !Array.isArray(passengerIds)) {
      return res.status(400).json({ message: 'بيانات غير صالحة' });
    }

    // Create notifications for each passenger
    const notifications = await Promise.all(
      passengerIds.map(passengerId =>
        NotificationModel.create({
          notification_id: `N${Date.now()}-${passengerId}`,
          passenger_id: passengerId,
          message,
          type,
          created_at: new Date(),
          status: 'SENT'
        })
      )
    );

    res.status(201).json({ message: 'تم إرسال الإشعارات بنجاح', notifications });
  } catch (error) {
    console.error('Send notifications error:', error);
    res.status(500).json({ message: 'خطأ في إرسال الإشعارات' });
  }
});

export default router;