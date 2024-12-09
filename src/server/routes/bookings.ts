import { Router } from 'express';
import { BookingModel } from '../models/Booking';
import { NotificationModel } from '../models/Notification';
import { JourneyModel } from '../models/Journey';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { journeyId, classId, seatNumber, paymentMethod } = req.body;
    const passengerId = req.user.id;
    const isArabic = req.headers['accept-language']?.includes('ar');

    // Check if journey exists and has available seats
    const journey = await JourneyModel.findById(journeyId);
    if (!journey) {
      return res.status(404).json({
        message: isArabic ? 'الرحلة غير موجودة' : 'Journey not found'
      });
    }

    // Check if seat is available
    const isSeatAvailable = await JourneyModel.checkSeatAvailability(
      journeyId,
      classId,
      seatNumber
    );
    if (!isSeatAvailable) {
      return res.status(400).json({
        message: isArabic ? 'المقعد غير متاح' : 'Seat not available'
      });
    }

    // Create booking
    const bookingId = `B${Date.now()}`;
    await BookingModel.create({
      booking_id: bookingId,
      passenger_id: passengerId,
      journey_id: journeyId,
      train_id: journey.train_id,
      class_id: classId,
      coach_number: seatNumber.substring(0, 1),
      seat_number: seatNumber,
      booking_status: 'CONFIRMED',
      booking_date: new Date(),
      payment_status: 'PENDING',
      payment_method: paymentMethod,
      amount: await JourneyModel.calculatePrice(journeyId, classId)
    });

    // Create notification
    await NotificationModel.create({
      notification_id: `N${Date.now()}`,
      passenger_id: passengerId,
      message: isArabic 
        ? 'تم تأكيد حجزك بنجاح'
        : 'Your booking has been confirmed',
      type: 'BOOKING_CONFIRMATION',
      created_at: new Date(),
      status: 'SENT'
    });

    res.status(201).json({ bookingId });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({ 
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في إنشاء الحجز'
        : 'Error creating booking'
    });
  }
});

router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    const bookings = await BookingModel.findByPassenger(req.user.id);
    
    // Enhance booking data with journey details
    const enhancedBookings = await Promise.all(bookings.map(async booking => {
      const journey = await JourneyModel.findById(booking.journey_id);
      const stations = await JourneyModel.getJourneyStations(booking.journey_id);
      return {
        ...booking,
        journey,
        stations
      };
    }));

    res.json(enhancedBookings);
  } catch (error) {
    console.error('Bookings retrieval error:', error);
    res.status(500).json({ 
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب الحجوزات'
        : 'Error fetching bookings'
    });
  }
});

router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const isArabic = req.headers['accept-language']?.includes('ar');

    // Check if booking exists and belongs to user
    const booking = await BookingModel.findById(req.params.id);
    if (!booking || booking.passenger_id !== req.user.id) {
      return res.status(404).json({
        message: isArabic ? 'الحجز غير موجود' : 'Booking not found'
      });
    }

    // Check if booking can be cancelled
    const journey = await JourneyModel.findById(booking.journey_id);
    if (!journey || journey.status !== 'SCHEDULED') {
      return res.status(400).json({
        message: isArabic 
          ? 'لا يمكن إلغاء هذا الحجز'
          : 'This booking cannot be cancelled'
      });
    }

    await BookingModel.updateStatus(req.params.id, 'CANCELLED');

    // Create cancellation notification
    await NotificationModel.create({
      notification_id: `N${Date.now()}`,
      passenger_id: req.user.id,
      message: isArabic
        ? 'تم إلغاء حجزك بنجاح'
        : 'Your booking has been cancelled',
      type: 'SYSTEM',
      created_at: new Date(),
      status: 'SENT'
    });

    res.json({ 
      message: isArabic
        ? 'تم إلغاء الحجز بنجاح'
        : 'Booking cancelled successfully'
    });
  } catch (error) {
    console.error('Booking cancellation error:', error);
    res.status(500).json({ 
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في إلغاء الحجز'
        : 'Error cancelling booking'
    });
  }
});

export default router;