export interface Route {
  from: string;
  to: string;
  duration: string;
}

// Define available train routes between Saudi cities
export const availableRoutes: Route[] = [
  // Riyadh Routes
  { from: 'RYD', to: 'DMM', duration: '3h 30m' }, // Riyadh - Dammam
  { from: 'RYD', to: 'MKH', duration: '4h 00m' }, // Riyadh - Makkah
  { from: 'RYD', to: 'MED', duration: '4h 30m' }, // Riyadh - Madinah
  
  // Makkah Routes
  { from: 'MKH', to: 'MED', duration: '2h 30m' }, // Makkah - Madinah
  { from: 'MKH', to: 'JED', duration: '1h 30m' }, // Makkah - Jeddah
  
  // Madinah Routes
  { from: 'MED', to: 'JED', duration: '3h 00m' }, // Madinah - Jeddah
  
  // Dammam Routes
  { from: 'DMM', to: 'RYD', duration: '3h 30m' }, // Dammam - Riyadh
];

export const getAvailableDestinations = (fromCityId: string): string[] => {
  return availableRoutes
    .filter(route => route.from === fromCityId)
    .map(route => route.to);
};

export const getAvailableOrigins = (toCityId: string): string[] => {
  return availableRoutes
    .filter(route => route.to === toCityId)
    .map(route => route.from);
};

export const getRouteDuration = (fromCityId: string, toCityId: string): string | undefined => {
  return availableRoutes.find(
    route => route.from === fromCityId && route.to === toCityId
  )?.duration;
};