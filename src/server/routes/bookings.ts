import { Router } from 'express';
import { BookingModel } from '../models/Booking';
import { JourneyModel } from '../models/Journey';
import { authenticateToken, isEmployee } from '../middleware/auth';
import { PassengerModel } from '../models/Passenger';
import { NotificationModel } from '../models/Notification';

const router = Router();

router.get('/my-bookings', authenticateToken, async (req, res) => {
  console.log('tes')
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
    const loyaltyPoints = 50;
    await PassengerModel.updateLoyaltyPoints(passengerId, loyaltyPoints);

    // Create notification
    await NotificationModel.create({
      notification_id: `N${Date.now()}`,
      passenger_id: passengerId,
      message: isArabic
        ? 'Your booking has been confirmed'
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

// Add this new endpoint for seat validation
router.get('/validate-seat', authenticateToken, async (req, res) => {
  try {
    const { journeyId, seatNumber } = req.query;
    const isArabic = req.headers['accept-language']?.includes('ar');

    if (!journeyId || !seatNumber) {
      return res.status(400).json({
        message: isArabic
          ? 'معرف الرحلة ورقم المقعد مطلوبان'
          : 'Journey ID and seat number are required'
      });
    }

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

// Update booking for admin
router.put('/:id', authenticateToken, isEmployee, async (req, res) => {
  try {
    const { id } = req.params;
    const { booking_status, payment_status } = req.body;
    const isArabic = req.headers['accept-language']?.includes('ar');

    if (!booking_status) {
      return res.status(400).json({
        message: isArabic
          ? 'الحالة مطلوبة'
          : 'Status is required'
      });
    }

    await BookingModel.update(id, req.body)

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
})

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

// Get booking by ID
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

    try {
      await PassengerModel.updateLoyaltyPoints(booking.passengerId, 50);
    } catch (err) {
      console.error(err)
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