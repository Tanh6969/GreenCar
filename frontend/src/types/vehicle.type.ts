export interface Location {
  location_id: number;
  name: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
}

export interface VehicleModel {
  vehicle_model_id: number;
  name: string;
  brand: string;
  seats: number;
  horsepower: number;
  range_km: number;
  trunk_capacity: number;
  airbags: number;
  vehicle_type: string;
  transmission: string;
}

export interface Vehicle {
  vehicle_id: number;
  vehicle_model_id: number;
  license_plate: string;
  status: "available" | "booked" | "maintenance";
  battery_level: number;
  battery_health: number;
  location_id: number;
}

export interface VehicleImage {
  image_id: number;
  vehicle_model_id: number;
  image_url: string;
}

export interface VehicleFeature {
  feature_id: number;
  feature_name: string;
}

export interface VehicleModelFeature {
  vehicle_model_id: number;
  feature_id: number;
}

export interface VehicleSpec {
  spec_id: number;
  vehicle_model_id: number;
  spec_name: string;
  spec_value: string;
}

export interface VehicleCardData {
  vehicle: Vehicle;
  model: VehicleModel;
  location: Location;
  image?: VehicleImage;
}
