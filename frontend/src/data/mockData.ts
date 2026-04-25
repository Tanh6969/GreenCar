import { Booking, Pricing, RentalPlan } from "../types/booking.type";
import { Payment, Review } from "../types/payment.type";
import { Role, User } from "../types/user.type";
import {
  Location,
  Vehicle,
  VehicleFeature,
  VehicleImage,
  VehicleModel,
  VehicleModelFeature,
  VehicleSpec
} from "../types/vehicle.type";

export const roles: Role[] = [
  { role_id: 1, role_name: "admin" },
  { role_id: 2, role_name: "customer" }
];

export const users: User[] = [
  {
    user_id: 1,
    name: "Admin GreenCar",
    email: "admin@greencar.vn",
    phone: "0900000001",
    license_no: "B2-ADMIN",
    role_id: 1,
    created_at: "2026-01-01T08:00:00Z"
  },
  {
    user_id: 2,
    name: "Nguyen Van A",
    email: "nguyenvana@gmail.com",
    phone: "0900000002",
    license_no: "B2-02345",
    role_id: 2,
    created_at: "2026-01-10T10:00:00Z"
  }
];

export const locations: Location[] = [
  { location_id: 1, name: "Ba Dinh", address: "Ba Dinh", city: "Ha Noi", latitude: 21.033, longitude: 105.814 },
  { location_id: 2, name: "Dong Da", address: "Dong Da", city: "Ha Noi", latitude: 21.018, longitude: 105.829 },
  { location_id: 3, name: "Cau Giay", address: "Cau Giay", city: "Ha Noi", latitude: 21.036, longitude: 105.79 }
];

export const vehicleModels: VehicleModel[] = [
  {
    vehicle_model_id: 1,
    name: "VF e34",
    brand: "VinFast",
    seats: 5,
    horsepower: 147,
    range_km: 300,
    trunk_capacity: 290,
    airbags: 6,
    vehicle_type: "SUV",
    transmission: "So tu dong"
  },
  {
    vehicle_model_id: 2,
    name: "Accent",
    brand: "Hyundai",
    seats: 5,
    horsepower: 115,
    range_km: 500,
    trunk_capacity: 387,
    airbags: 2,
    vehicle_type: "Sedan",
    transmission: "So tu dong"
  },
  {
    vehicle_model_id: 3,
    name: "CX5",
    brand: "Mazda",
    seats: 5,
    horsepower: 188,
    range_km: 550,
    trunk_capacity: 442,
    airbags: 6,
    vehicle_type: "SUV",
    transmission: "So tu dong"
  }
];

export const vehicles: Vehicle[] = [
  { vehicle_id: 1, vehicle_model_id: 1, license_plate: "30H-99999", status: "available", battery_level: 86, battery_health: 95, location_id: 1 },
  { vehicle_id: 2, vehicle_model_id: 2, license_plate: "30A-12345", status: "available", battery_level: 100, battery_health: 100, location_id: 1 },
  { vehicle_id: 3, vehicle_model_id: 3, license_plate: "30G-67890", status: "booked", battery_level: 100, battery_health: 100, location_id: 2 }
];

export const vehicleImages: VehicleImage[] = [
  { image_id: 1, vehicle_model_id: 1, image_url: "https://images.unsplash.com/photo-1617531653520-4893f7db7a15?auto=format&fit=crop&w=1200&q=80" },
  { image_id: 2, vehicle_model_id: 2, image_url: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80" },
  { image_id: 3, vehicle_model_id: 3, image_url: "https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&w=1200&q=80" }
];

export const vehicleFeatures: VehicleFeature[] = [
  { feature_id: 1, feature_name: "Camera 360" },
  { feature_id: 2, feature_name: "Cruise Control" },
  { feature_id: 3, feature_name: "Man hinh lon" }
];

export const vehicleModelFeatures: VehicleModelFeature[] = [
  { vehicle_model_id: 1, feature_id: 1 },
  { vehicle_model_id: 1, feature_id: 3 },
  { vehicle_model_id: 2, feature_id: 2 },
  { vehicle_model_id: 3, feature_id: 1 },
  { vehicle_model_id: 3, feature_id: 2 }
];

export const vehicleSpecs: VehicleSpec[] = [
  { spec_id: 1, vehicle_model_id: 1, spec_name: "Pin", spec_value: "42 kWh" },
  { spec_id: 2, vehicle_model_id: 1, spec_name: "Tang toc", spec_value: "0-100 km/h trong 9s" },
  { spec_id: 3, vehicle_model_id: 2, spec_name: "Dong co", spec_value: "1.5L" },
  { spec_id: 4, vehicle_model_id: 3, spec_name: "Dong co", spec_value: "2.5L" }
];

export const rentalPlans: RentalPlan[] = [
  { rental_plan_id: 1, name: "Goi 4h", duration_type: "hour", max_km: 250, overtime_price: 150000, over_km_price: 3000 },
  { rental_plan_id: 2, name: "Goi 8h", duration_type: "hour", max_km: 300, overtime_price: 150000, over_km_price: 3000 },
  { rental_plan_id: 3, name: "Goi 24h", duration_type: "day", max_km: 400, overtime_price: 150000, over_km_price: 3000 }
];

export const pricing: Pricing[] = [
  { pricing_id: 1, vehicle_model_id: 1, rental_plan_id: 1, price: 430000 },
  { pricing_id: 2, vehicle_model_id: 1, rental_plan_id: 3, price: 860000 },
  { pricing_id: 3, vehicle_model_id: 2, rental_plan_id: 1, price: 650000 },
  { pricing_id: 4, vehicle_model_id: 2, rental_plan_id: 3, price: 850000 },
  { pricing_id: 5, vehicle_model_id: 3, rental_plan_id: 1, price: 1330000 },
  { pricing_id: 6, vehicle_model_id: 3, rental_plan_id: 3, price: 1530000 }
];

export const bookings: Booking[] = [
  {
    booking_id: 1,
    user_id: 2,
    vehicle_id: 1,
    rental_plan_id: 3,
    start_time: "2026-04-26T01:00:00Z",
    end_time: "2026-04-27T01:00:00Z",
    planned_km: 120,
    actual_km: 110,
    deposit_amount: 500000,
    overtime_fee: 0,
    over_km_fee: 0,
    total_price: 860000,
    status: "confirmed",
    created_at: "2026-04-25T12:00:00Z"
  }
];

export const payments: Payment[] = [
  { payment_id: 1, booking_id: 1, amount: 860000, payment_method: "bank_transfer", payment_status: "paid", paid_at: "2026-04-25T12:10:00Z" }
];

export const reviews: Review[] = [
  {
    review_id: 1,
    user_id: 2,
    vehicle_model_id: 1,
    booking_id: 1,
    rating: 5,
    comment: "Xe sach, de lai, dung nhu mo ta.",
    created_at: "2026-04-25T12:30:00Z"
  }
];

export const homepageTestimonials = [
  { id: 1, name: "Anh Hoa", area: "Ba Dinh", message: "Ho tro nhanh, dat xe tien loi." },
  { id: 2, name: "Chi Linh", area: "Cau Giay", message: "Gia 4h rat hop ly cho viec di noi thanh." },
  { id: 3, name: "Anh Dat", area: "Dong Da", message: "Xe moi, nhan tra chu dong qua app." }
];
