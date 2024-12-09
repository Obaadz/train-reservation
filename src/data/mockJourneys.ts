import { City } from './saudiCities';
import { trainClasses, calculatePrice } from './trainClasses';

export interface Journey {
  id: string;
  trainNumber: string;
  from: City;
  to: City;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  classes: {
    classId: string;
    price: number;
    seatsAvailable: number;
  }[];
}

export const generateMockJourneys = (fromCity: City, toCity: City, date: string): Journey[] => {
  const baseJourneys = [
    {
      id: 'J001',
      trainNumber: 'SAR-101',
      from: fromCity,
      to: toCity,
      departureTime: '08:00',
      arrivalTime: '11:30',
      duration: '3h 30m',
      basePrice: 250,
    },
    {
      id: 'J002',
      trainNumber: 'SAR-102',
      from: fromCity,
      to: toCity,
      departureTime: '10:30',
      arrivalTime: '14:00',
      duration: '3h 30m',
      basePrice: 250,
    },
    {
      id: 'J003',
      trainNumber: 'SAR-103',
      from: fromCity,
      to: toCity,
      departureTime: '13:00',
      arrivalTime: '16:30',
      duration: '3h 30m',
      basePrice: 250,
    }
  ];

  return baseJourneys.map(journey => ({
    ...journey,
    classes: trainClasses.map(trainClass => ({
      classId: trainClass.id,
      price: calculatePrice(journey.basePrice, trainClass.id),
      seatsAvailable: Math.floor(Math.random() * 50) + 1 // Random number of available seats
    }))
  }));
};