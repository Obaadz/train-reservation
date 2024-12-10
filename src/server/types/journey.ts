export interface JourneySearchParams {
  fromStation: string;
  toStation: string;
  date: string;
  passengers?: number;
  classId?: string;
}

export interface JourneySearchResult {
  jid: string;
  train_id: string;
  departure: string;
  arrival: string;
  base_price: number;
  available_classes: {
    classId: string;
    price: number;
    availableSeats: number;
  }[];
}

export interface JourneyDetails {
  journey: {
    jid: string;
    train_id: string;
    status: string;
    base_price: number;
  };
  stations: {
    station_code: string;
    arrival_time: string;
    departure_time: string;
    platform_number: number;
    sequence_number: number;
  }[];
  classes: {
    classId: string;
    price: number;
    availableSeats: number;
  }[];
}