export interface JourneyClass {
  classId: string;
  price: number;
  availableSeats: number;
}

export interface JourneyStation {
  station_code: string;
  arrival_time: string;
  departure_time: string;
  platform_number: number;
  sequence_number: number;
}

export interface Journey {
  jid: string;
  train_id: string;
  status: string;
  base_price: number;
  classes: JourneyClass[];
  stations: JourneyStation[];
}

export interface JourneyPricing {
  originalPrice: number;
  discountedPrice: number;
  discountPercentage: number;
}