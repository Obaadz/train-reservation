import { Router } from 'express';
import { PassengerModel } from '../models/Passenger';
import { BookingModel } from '../models/Booking';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Get all passengers
router.get('/', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: req.headers['accept-language']?.includes('ar')
          ? 'غير مصرح'
          : 'Unauthorized'
      });
    }

    // Fetch all passengers
    const passengers = await PassengerModel.findAll();

    res.json(passengers);
  } catch (error) {
    console.error('Error fetching passengers:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب المسافرين'
        : 'Error fetching passengers'
    });
  }
});

// Get passenger metrics
router.get('/metrics', authenticateToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        message: req.headers['accept-language']?.includes('ar')
          ? 'غير مصرح'
          : 'Unauthorized'
      });
    }
    const passengerId = req.user.id;

    // Get all bookings for the passenger
    const bookings = await BookingModel.findByPassenger(passengerId);

    // Calculate metrics
    const metrics = {
      totalBookings: bookings.length,
      activeJourneys: bookings.filter(b => b.booking_status === 'CONFIRMED' && new Date(b.departure_time) > new Date()).length,
      totalSpent: bookings.reduce((sum, b) => sum + b.amount, 0),
      upcomingTrips: bookings.filter(b => b.booking_status === 'CONFIRMED' && new Date(b.departure_time) > new Date()).length,
      loyaltyPoints: req.user.loyaltyPoints || 0,
      mostVisitedCity: calculateMostVisitedCity(bookings),
      completedTrips: bookings.filter(b => b.booking_status === 'CONFIRMED').length,
      averagePrice: bookings.length ? Math.round(bookings.reduce((sum, b) => sum + b.amount, 0) / bookings.length) : 0
    };

    res.json(metrics);
  } catch (error) {
    console.error('Error fetching passenger metrics:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب إحصائيات المسافر'
        : 'Error fetching passenger metrics'
    });
  }
});

// Helper function to calculate most visited city
function calculateMostVisitedCity(bookings: any[]): string {
  const cityCounts = bookings.reduce((acc: { [key: string]: number }, booking) => {
    const city = booking.destination_city;
    acc[city] = (acc[city] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(cityCounts)
    .sort(([, a], [, b]) => b - a)[0]?.[0] || '-';
}

export default router;