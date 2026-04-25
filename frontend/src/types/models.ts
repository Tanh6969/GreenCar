export interface Location {
  location_id: number;
  name: string;
  city: string;
}

export interface VehicleCard {
  vehicle_id: number;
  vehicle_model: string;
  brand: string;
  year: number;
  location: string;
  seats: number;
  transmission: string;
  fuel: string;
  battery_level?: number;
  price_4h: number;
  price_24h: number;
  image_url: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Testimonial {
  id: number;
  name: string;
  message: string;
  area: string;
}

export interface FaqItem {
  id: number;
  question: string;
  answer: string;
}
