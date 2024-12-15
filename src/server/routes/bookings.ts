import { Router } from 'express';
import { BookingModel } from '../models/Booking';
import { authenticateToken, isEmployee } from '../middleware/auth';

const router = Router();

// Get all bookings (employee only)
router.get('/all', authenticateToken, isEmployee, async (req, res) => {
  try {
    const bookings = await BookingModel.findAll();
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching all bookings:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب الحجوزات'
        : 'Error fetching bookings'
    });
  }
});

// Update booking status (employee only)
router.put('/:id/status', authenticateToken, isEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const isArabic = req.headers['accept-language']?.includes('ar');

    if (!status) {
      return res.status(400).json({
        message: isArabic
          ? 'الحالة مطلوبة'
          : 'Status is required'
      });
    }

    await BookingModel.updateStatus(id, status);

    res.json({
      message: isArabic
        ? 'تم تحديث حالة الحجز بنجاح'
        : 'Booking status updated successfully'
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في تحديث حالة الحجز'
        : 'Error updating booking status'
    });
  }
});

// Add this to your existing bookings.ts routes file
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const isArabic = req.headers['accept-language']?.includes('ar');

    const booking = await BookingModel.findById(id);
    if (!booking) {
      return res.status(404).json({
        message: isArabic
          ? 'الحجز غير موجود'
          : 'Booking not found'
      });
    }

    res.json(booking);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب تفاصيل الحجز'
        : 'Error fetching booking details'
    });
  }
});

export default router;