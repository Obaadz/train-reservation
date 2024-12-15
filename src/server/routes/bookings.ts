import { Router } from 'express';
import { BookingModel } from '../models/Booking';
import { NotificationModel } from '../models/Notification';
import { JourneyModel } from '../models/Journey';
import { PassengerModel } from '../models/Passenger';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Create new booking
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { journeyId, classId, seatNumber, passengerDetails, paymentDetails } = req.body;
    const isArabic = req.headers['accept-language']?.includes('ar');
    if (!req.user) {
      return res.status(401).json({
        message: isArabic ? 'غير مصرح' : 'Unauthorized'
      });
    }
    const passengerId = req.user.id;

    // Check if journey exists and has available seats
    const journey = await JourneyModel.findById(journeyId);
    if (!journey) {
      console.log('no journey')
      return res.status(404).json({
        message: isArabic ? 'الرحلة غير موجودة' : 'Journey not found'
      });
    }

    // Calculate price
    // const price = await JourneyModel.calculatePrice(journeyId, classId);

    // Create booking
    const bookingId = `B${Date.now()}`;
    await BookingModel.create({
      booking_id: bookingId,
      passenger_id: passengerId,
      journey_id: journeyId,
      train_id: journey.train_id,
      class_id: "TC002",
      seat_number: seatNumber,
      booking_status: 'CONFIRMED',
      booking_date: new Date(),
      payment_status: 'COMPLETED',
      payment_method: paymentDetails.method,
      coach_number: seatNumber.split('-')[0],
      amount: 250
    });

    // Update passenger loyalty points
    const loyaltyPoints = Math.floor(250 / 10);
    await PassengerModel.updateLoyaltyPoints(passengerId, loyaltyPoints);

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

    res.status(201).json({
      bookingId,
      message: isArabic ? 'تم تأكيد الحجز بنجاح' : 'Booking confirmed successfully'
    });
  } catch (error) {
    console.error('Booking creation error:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في إنشاء الحجز'
        : 'Error creating booking'
    });
  }
});

// Get user's bookings
router.get('/my-bookings', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: req.headers['accept-language']?.includes('ar')
          ? 'غير مصرح'
          : 'Unauthorized'
      });
    }
    const bookings = await BookingModel.findByPassenger(req.user.id);
    res.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب الحجوزات'
        : 'Error fetching bookings'
    });
  }
});

// Calculate booking price
router.get('/calculate-price', authenticateToken, async (req, res) => {
  try {
    const { journeyId, classId } = req.query;
    const price = await JourneyModel.calculatePrice(journeyId as string, classId as string);
    res.json({ price });
  } catch (error) {
    console.error('Error calculating price:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في حساب السعر'
        : 'Error calculating price'
    });
  }
});

// Validate seat availability
router.get('/validate-seat', authenticateToken, async (req, res) => {
  try {
    const { journeyId, seatNumber } = req.query;
    const isValid = await JourneyModel.checkSeatAvailability(
      journeyId as string,
      seatNumber as string
    );
    res.json({ isValid });
  } catch (error) {
    console.error('Error validating seat:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في التحقق من المقعد'
        : 'Error validating seat'
    });
  }
});

export default router;