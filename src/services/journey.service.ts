import { Journey } from '../types/journey';

export const journeyService = {
  async getJourneyDetails(journeyId: string, token: string): Promise<Journey> {
    const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/api/journeys/${journeyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch journey details');
    }

    return response.json();
  },

  getClassPrice(journey: Journey | null, classId: string | null): number {
    if (!journey?.classes || !classId) return 0;
    const classDetails = journey.classes.find(c => c.classId === classId);
    return classDetails?.price || 0;
  }
};