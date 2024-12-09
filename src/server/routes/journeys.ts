import { Router } from 'express';
import { JourneyModel } from '../models/Journey';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.get('/search', async (req, res) => {
  try {
    const { from, to, date } = req.query;
    const isArabic = req.headers['accept-language']?.includes('ar');

    if (!from || !to || !date) {
      return res.status(400).json({ 
        message: isArabic ? 'جميع الحقول مطلوبة' : 'All fields are required' 
      });
    }

    const journeys = await JourneyModel.searchJourneys(
      from as string,
      to as string,
      date as string
    );

    // Enhance journey data with available seats
    const enhancedJourneys = await Promise.all(journeys.map(async journey => {
      const availableSeats = await JourneyModel.getAvailableSeats(journey.jid);
      return {
        ...journey,
        availableSeats
      };
    }));

    res.json(enhancedJourneys);
  } catch (error) {
    console.error('Journey search error:', error);
    res.status(500).json({ 
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في البحث عن الرحلات'
        : 'Error searching journeys'
    });
  }
});

router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const journey = await JourneyModel.findById(req.params.id);
    if (!journey) {
      return res.status(404).json({ 
        message: req.headers['accept-language']?.includes('ar')
          ? 'الرحلة غير موجودة'
          : 'Journey not found'
      });
    }

    const stations = await JourneyModel.getJourneyStations(req.params.id);
    const availableSeats = await JourneyModel.getAvailableSeats(req.params.id);

    res.json({ 
      ...journey, 
      stations,
      availableSeats
    });
  } catch (error) {
    console.error('Journey details error:', error);
    res.status(500).json({ 
      message: req.headers['accept-language']?.includes('ar')
        ? 'خطأ في جلب تفاصيل الرحلة'
        : 'Error fetching journey details'
    });
  }
});

export default router;