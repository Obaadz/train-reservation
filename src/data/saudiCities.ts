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
    image: 'https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&q=80&w=2067'
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
    image: 'https://images.unsplash.com/photo-1591604129939-f7c5f6145e31?auto=format&fit=crop&q=80&w=2070'
  }
];