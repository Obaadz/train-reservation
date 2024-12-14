export interface City {
  id: string;
  nameAr: string;
  nameEn: string;
  region: string;
  stationCode: string;
  image: string;
}

export const saudiCities: City[] = [
  {
    id: 'RYD',
    nameAr: 'الرياض',
    nameEn: 'Riyadh',
    region: 'Central',
    stationCode: 'STN001',
    image: 'https://images.unsplash.com/photo-1586724237569-f3d0c1dee8c6?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'JED',
    nameAr: 'جدة',
    nameEn: 'Jeddah',
    region: 'Western',
    stationCode: 'STN002',
    image: 'https://images.unsplash.com/photo-1578895101408-1a36b834405b?auto=format&fit=crop&q=80&w=2067'
  },
  {
    id: 'DMM',
    nameAr: 'الدمام',
    nameEn: 'Dammam',
    region: 'Eastern',
    stationCode: 'STN003',
    image: 'https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcTZfsx9c4OoMrARsiaNcD0CaXU9Cka-GVuHOyd2gm4a3Ch2eprKnGQTeGUNAIjhCBsmo75SGjQQy48lZGW1gyD9KK8vS46rT4NrOIMjCw'
  },
  {
    id: 'MKH',
    nameAr: 'مكة المكرمة',
    nameEn: 'Makkah',
    region: 'Western',
    stationCode: 'STN004',
    image: 'https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?auto=format&fit=crop&q=80&w=2070'
  },
  {
    id: 'MED',
    nameAr: 'المدينة المنورة',
    nameEn: 'Madinah',
    region: 'Western',
    stationCode: 'STN005',
    image: 'https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcSFOxjRxAFs6QDOi0x5mQqXYupSyLd11YMj1KFY7SFDa02-CA4NhCYtsGy5quDl4QxULw_NYXTUww60XCoauj8_TzCLooL0aq1d-tn6FAk'
  }
];