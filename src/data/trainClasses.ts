export interface TrainClass {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  priceMultiplier: number;
  features: {
    wifi: boolean;
    meals: boolean;
    entertainment?: boolean;
    powerOutlets: boolean;
    extraLegroom?: boolean;
  };
  icon: string;
}

export const trainClasses: TrainClass[] = [
  {
    id: 'CLS001',
    nameAr: 'الدرجة الأولى',
    nameEn: 'First Class',
    descriptionAr: 'خدمة فاخرة مع مقاعد جلدية ووجبات مجانية',
    descriptionEn: 'Luxury service with leather seats and complimentary meals',
    priceMultiplier: 2.0,
    features: {
      wifi: true,
      meals: true,
      entertainment: true,
      powerOutlets: true,
      extraLegroom: true
    },
    icon: 'crown'
  },
  {
    id: 'CLS002',
    nameAr: 'درجة رجال الأعمال',
    nameEn: 'Business Class',
    descriptionAr: 'مقاعد مريحة مع خدمة متميزة',
    descriptionEn: 'Comfortable seats with premium service',
    priceMultiplier: 1.5,
    features: {
      wifi: true,
      meals: true,
      powerOutlets: true,
      extraLegroom: true
    },
    icon: 'briefcase'
  },
  {
    id: 'CLS003',
    nameAr: 'الدرجة السياحية',
    nameEn: 'Economy Class',
    descriptionAr: 'رحلة مريحة بسعر معقول',
    descriptionEn: 'Comfortable journey at reasonable price',
    priceMultiplier: 1.0,
    features: {
      wifi: true,
      meals: false,
      powerOutlets: true,
      extraLegroom: false
    },
    icon: 'users'
  }
];

export const getTrainClass = (classId: string): TrainClass | undefined => {
  return trainClasses.find(cls => cls.id === classId);
};

export const calculatePrice = (basePrice: number, classId: string): number => {
  const trainClass = getTrainClass(classId);
  return trainClass ? basePrice * trainClass.priceMultiplier : basePrice;
};