import { Router, Request, Response } from 'express';
import { JourneyModel } from '../models/Journey';
import { authenticateToken } from '../middleware/auth';
import { JourneySearchParams, JourneySearchResult, JourneyDetails } from '../types/journey';

const router = Router();

// Helper function to calculate loyalty discount
const calculateLoyaltyDiscount = (loyaltyStatus: string, originalPrice: number): number => {
  const discounts = {
    'BRONZE': 0,
    'SILVER': 0.05, // 5% discount
    'GOLD': 0.10,   // 10% discount
    'PLATINUM': 0.15 // 15% discount
  };

  const discountRate = discounts[loyaltyStatus as keyof typeof discounts] || 0;
  return originalPrice * (1 - discountRate);
};

// Search journeys
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { from, to, date, passengers = '1', classId } = req.query;
    const isArabic = req.headers['accept-language']?.includes('ar');
    const loyaltyStatus = req.user?.loyaltyStatus || 'BRONZE';

    if (!from || !to || !date) {
      return res.status(400).json({
        message: isArabic ? 'جميع الحقول مطلوبة' : 'All fields are required'
      });
    }

    const searchParams: JourneySearchParams = {
      fromStation: from as string,
      toStation: to as string,
      date: date as string,
      passengers: parseInt(passengers as string, 10),
      classId: classId as string
    };

    const journeys = await JourneyModel.searchJourneys(
      searchParams.fromStation,
      searchParams.toStation,
      searchParams.date
    );

    const journeysWithDetails: JourneySearchResult[] = await Promise.all(
      journeys.map(async (journey) => {
        const availableClasses = await Promise.all(
          Object.keys(journey.available_classes).map(async (classId) => {
            const originalPrice = await JourneyModel.calculatePrice(journey.jid, classId);
            const discountedPrice = calculateLoyaltyDiscount(loyaltyStatus, originalPrice);

            return {
              classId,
              originalPrice,
              discountedPrice: req.user ? discountedPrice : null,
              discount: req.user ? (originalPrice - discountedPrice) : 0,
              availableSeats: journey.available_classes[classId]
            };
          })
        );

        return {
          ...journey,
          available_classes: availableClasses
        };
      })
    ) as any;

    res.json(journeysWithDetails);
  } catch (error) {
    console.error('Journey search error:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في البحث عن الرحلات'
        : 'Error searching journeys'
    });
  }
});


// Get journey details
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { classId } = req.query;
    const isArabic = req.headers['accept-language']?.includes('ar');

    const journey = await JourneyModel.findById(id);
    if (!journey) {
      return res.status(404).json({
        message: isArabic
          ? 'الرحلة غير موجودة'
          : 'Journey not found'
      });
    }

    const stations = await JourneyModel.getJourneyStations(id);

    // Get available seats for all classes or specific class
    const classes = await Promise.all(
      Object.keys(journey.class_capacities).map(async (cls) => {
        if (classId && cls !== classId) return null;
        const price = await JourneyModel.calculatePrice(id, cls);
        const availableSeats = await JourneyModel.getAvailableSeats(id, cls);
        return {
          classId: cls,
          price,
          availableSeats: availableSeats.length
        };
      })
    );

    const journeyDetails: JourneyDetails = {
      journey: {
        jid: journey.jid,
        train_id: journey.train_id,
        status: journey.status,
        base_price: journey.base_price
      },
      stations: stations.map(station => ({
        station_code: station.station_code,
        arrival_time: station.arrival_time,
        departure_time: station.departure_time,
        platform_number: station.platform_number,
        sequence_number: station.sequence_number
      })),
      classes: classes.filter(Boolean) as {
        classId: string;
        price: number;
        availableSeats: number;
      }[]
    };

    res.json(journeyDetails);
  } catch (error) {
    console.error('Journey details error:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب تفاصيل الرحلة'
        : 'Error fetching journey details'
    });
  }
});

// Get available seats
router.get('/:id/seats', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { classId } = req.query;
    const isArabic = req.headers['accept-language']?.includes('ar');

    if (!classId) {
      return res.status(400).json({
        message: isArabic
          ? 'رقم الدرجة مطلوب'
          : 'Class ID is required'
      });
    }

    const availableSeats = await JourneyModel.getAvailableSeats(id, classId as string);
    res.json({ seats: availableSeats });
  } catch (error) {
    console.error('Error fetching available seats:', error);
    res.status(500).json({
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب المقاعد المتاحة'
        : 'Error fetching available seats'
    });
  }
});

// Validate seat
router.get('/:id/validate-seat', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { seatNumber } = req.query;
    const isArabic = req.headers['accept-language']?.includes('ar');

    if (!seatNumber) {
      return res.status(400).json({
        message: isArabic
          ? 'رقم المقعد مطلوب'
          : 'Seat number is required'
      });
    }

    const isValid = await JourneyModel.checkSeatAvailability(id, seatNumber as string);
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