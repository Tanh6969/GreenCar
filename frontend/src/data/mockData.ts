import { Booking, Pricing, RentalPlan } from "../types/booking.type";
import { Payment, Review } from "../types/payment.type";
import { Role, User } from "../types/user.type";
import { BlogCategory, BlogPost } from "../types/blog.type";
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
  { user_id: 1, name: "Admin GreenCar", email: "admin@greencar.vn", phone: "0900000001", license_no: "B2-ADMIN", role_id: 1, created_at: "2026-01-01T08:00:00Z" },
  { user_id: 2, name: "Nguyen Van A", email: "nguyenvana@gmail.com", phone: "0900000002", license_no: "B2-02345", role_id: 2, created_at: "2026-01-10T10:00:00Z" },
  { user_id: 3, name: "Tran Thi B", email: "tranthib@gmail.com", phone: "0900000003", license_no: "B2-03456", role_id: 2, created_at: "2026-02-01T09:00:00Z" }
];

export const locations: Location[] = [
  { location_id: 1, name: "Ba Đình",     address: "Quận Ba Đình",     city: "Hà Nội", latitude: 21.033, longitude: 105.814 },
  { location_id: 2, name: "Đống Đa",     address: "Quận Đống Đa",     city: "Hà Nội", latitude: 21.018, longitude: 105.829 },
  { location_id: 3, name: "Cầu Giấy",    address: "Quận Cầu Giấy",    city: "Hà Nội", latitude: 21.036, longitude: 105.790 },
  { location_id: 4, name: "Tây Hồ",      address: "Quận Tây Hồ",      city: "Hà Nội", latitude: 21.058, longitude: 105.823 },
  { location_id: 5, name: "Thanh Xuân",  address: "Quận Thanh Xuân",  city: "Hà Nội", latitude: 20.995, longitude: 105.815 },
  { location_id: 6, name: "Hoàng Mai",   address: "Quận Hoàng Mai",   city: "Hà Nội", latitude: 20.978, longitude: 105.842 },
  { location_id: 7, name: "Long Biên",   address: "Quận Long Biên",   city: "Hà Nội", latitude: 21.040, longitude: 105.882 }
];

export const vehicleModels: VehicleModel[] = [
  // ── Hạng phổ thông ──
  { vehicle_model_id: 1,  name: "VF e34",     brand: "VinFast",  seats: 5, horsepower: 147, range_km: 300,  trunk_capacity: 290, airbags: 6, vehicle_type: "SUV",     transmission: "Số tự động" },
  { vehicle_model_id: 2,  name: "Accent EV",  brand: "Hyundai",  seats: 5, horsepower: 115, range_km: 420,  trunk_capacity: 387, airbags: 4, vehicle_type: "Sedan",   transmission: "Số tự động" },
  { vehicle_model_id: 3,  name: "ID.4",       brand: "VW",       seats: 5, horsepower: 204, range_km: 520,  trunk_capacity: 543, airbags: 9, vehicle_type: "SUV",     transmission: "Số tự động" },
  { vehicle_model_id: 4,  name: "Mach-E",     brand: "Ford",     seats: 5, horsepower: 269, range_km: 480,  trunk_capacity: 402, airbags: 7, vehicle_type: "SUV",     transmission: "Số tự động" },
  { vehicle_model_id: 5,  name: "IONIQ 5",    brand: "Hyundai",  seats: 5, horsepower: 225, range_km: 451,  trunk_capacity: 527, airbags: 6, vehicle_type: "Crossover", transmission: "Số tự động" },
  { vehicle_model_id: 6,  name: "IONIQ 6",    brand: "Hyundai",  seats: 5, horsepower: 239, range_km: 614,  trunk_capacity: 401, airbags: 7, vehicle_type: "Sedan",   transmission: "Số tự động" },
  { vehicle_model_id: 7,  name: "VF 8",       brand: "VinFast",  seats: 7, horsepower: 402, range_km: 400,  trunk_capacity: 376, airbags: 8, vehicle_type: "SUV",     transmission: "Số tự động" },
  { vehicle_model_id: 8,  name: "Model 3",    brand: "Tesla",    seats: 5, horsepower: 283, range_km: 491,  trunk_capacity: 561, airbags: 8, vehicle_type: "Sedan",   transmission: "Số tự động" },
  // ── Hạng sang ──
  { vehicle_model_id: 9,  name: "Model S",    brand: "Tesla",    seats: 5, horsepower: 670, range_km: 652,  trunk_capacity: 793, airbags: 8, vehicle_type: "Sedan",   transmission: "Số tự động" },
  { vehicle_model_id: 10, name: "Model X",    brand: "Tesla",    seats: 7, horsepower: 670, range_km: 576,  trunk_capacity: 1022, airbags: 8, vehicle_type: "SUV",    transmission: "Số tự động" },
  { vehicle_model_id: 11, name: "Polestar 2", brand: "Polestar", seats: 5, horsepower: 476, range_km: 540,  trunk_capacity: 405, airbags: 8, vehicle_type: "Fastback", transmission: "Số tự động" },
  { vehicle_model_id: 12, name: "e-tron GT",  brand: "Audi",     seats: 5, horsepower: 530, range_km: 488,  trunk_capacity: 405, airbags: 9, vehicle_type: "Sedan",   transmission: "Số tự động" },
  { vehicle_model_id: 13, name: "Air Pure",   brand: "Lucid",    seats: 5, horsepower: 430, range_km: 660,  trunk_capacity: 739, airbags: 8, vehicle_type: "Sedan",   transmission: "Số tự động" },
  { vehicle_model_id: 14, name: "R1S",        brand: "Rivian",   seats: 7, horsepower: 835, range_km: 505,  trunk_capacity: 495, airbags: 8, vehicle_type: "SUV",     transmission: "Số tự động" },
  { vehicle_model_id: 15, name: "VF 9",       brand: "VinFast",  seats: 7, horsepower: 402, range_km: 438,  trunk_capacity: 585, airbags: 8, vehicle_type: "SUV",     transmission: "Số tự động" }
];

export const vehicles: Vehicle[] = [
  // VF e34
  { vehicle_id: 1,  vehicle_model_id: 1,  license_plate: "30H-99901", status: "available", battery_level: 86,  battery_health: 95,  location_id: 1 },
  { vehicle_id: 2,  vehicle_model_id: 1,  license_plate: "30H-99902", status: "available", battery_level: 92,  battery_health: 98,  location_id: 3 },
  // Hyundai Accent EV
  { vehicle_id: 3,  vehicle_model_id: 2,  license_plate: "30A-12301", status: "available", battery_level: 100, battery_health: 100, location_id: 1 },
  { vehicle_id: 4,  vehicle_model_id: 2,  license_plate: "30A-12302", status: "available", battery_level: 78,  battery_health: 93,  location_id: 5 },
  // VW ID.4
  { vehicle_id: 5,  vehicle_model_id: 3,  license_plate: "30K-11101", status: "available", battery_level: 100, battery_health: 100, location_id: 2 },
  { vehicle_id: 6,  vehicle_model_id: 3,  license_plate: "30K-11102", status: "available", battery_level: 95,  battery_health: 99,  location_id: 4 },
  // Ford Mach-E
  { vehicle_id: 7,  vehicle_model_id: 4,  license_plate: "30F-55501", status: "available", battery_level: 88,  battery_health: 96,  location_id: 3 },
  { vehicle_id: 8,  vehicle_model_id: 4,  license_plate: "30F-55502", status: "booked",    battery_level: 100, battery_health: 100, location_id: 6 },
  // Hyundai IONIQ 5
  { vehicle_id: 9,  vehicle_model_id: 5,  license_plate: "30E-77701", status: "available", battery_level: 100, battery_health: 100, location_id: 2 },
  { vehicle_id: 10, vehicle_model_id: 5,  license_plate: "30E-77702", status: "available", battery_level: 90,  battery_health: 97,  location_id: 7 },
  // Hyundai IONIQ 6
  { vehicle_id: 11, vehicle_model_id: 6,  license_plate: "30E-88801", status: "available", battery_level: 100, battery_health: 100, location_id: 1 },
  // VinFast VF 8
  { vehicle_id: 12, vehicle_model_id: 7,  license_plate: "30H-44401", status: "available", battery_level: 95,  battery_health: 99,  location_id: 3 },
  { vehicle_id: 13, vehicle_model_id: 7,  license_plate: "30H-44402", status: "available", battery_level: 82,  battery_health: 94,  location_id: 5 },
  // Tesla Model 3
  { vehicle_id: 14, vehicle_model_id: 8,  license_plate: "30T-33301", status: "available", battery_level: 100, battery_health: 100, location_id: 4 },
  { vehicle_id: 15, vehicle_model_id: 8,  license_plate: "30T-33302", status: "available", battery_level: 97,  battery_health: 100, location_id: 2 },
  // Tesla Model S – hạng sang
  { vehicle_id: 16, vehicle_model_id: 9,  license_plate: "30T-99901", status: "available", battery_level: 100, battery_health: 100, location_id: 1 },
  // Tesla Model X – hạng sang
  { vehicle_id: 17, vehicle_model_id: 10, license_plate: "30T-99902", status: "available", battery_level: 100, battery_health: 100, location_id: 4 },
  // Polestar 2 – hạng sang
  { vehicle_id: 18, vehicle_model_id: 11, license_plate: "30P-22201", status: "available", battery_level: 96,  battery_health: 100, location_id: 3 },
  // Audi e-tron GT – hạng sang
  { vehicle_id: 19, vehicle_model_id: 12, license_plate: "30D-66601", status: "available", battery_level: 100, battery_health: 100, location_id: 1 },
  // Lucid Air Pure – hạng sang
  { vehicle_id: 20, vehicle_model_id: 13, license_plate: "30L-11101", status: "available", battery_level: 100, battery_health: 100, location_id: 2 },
  // Rivian R1S – hạng sang
  { vehicle_id: 21, vehicle_model_id: 14, license_plate: "30R-55501", status: "available", battery_level: 98,  battery_health: 100, location_id: 7 },
  // VinFast VF 9
  { vehicle_id: 22, vehicle_model_id: 15, license_plate: "30H-44501", status: "available", battery_level: 100, battery_health: 100, location_id: 6 }
];

export const vehicleImages: VehicleImage[] = [
  { image_id: 1,  vehicle_model_id: 1,  image_url: "https://images.unsplash.com/photo-1617531653520-4893f7db7a15?auto=format&fit=crop&w=900&q=80" },
  { image_id: 2,  vehicle_model_id: 2,  image_url: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=900&q=80" },
  { image_id: 3,  vehicle_model_id: 3,  image_url: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80" },
  { image_id: 4,  vehicle_model_id: 4,  image_url: "https://images.unsplash.com/photo-1624623278313-a930126a11c3?auto=format&fit=crop&w=900&q=80" },
  { image_id: 5,  vehicle_model_id: 5,  image_url: "https://images.unsplash.com/photo-1719581597814-b9e88db5ac9d?auto=format&fit=crop&w=900&q=80" },
  { image_id: 6,  vehicle_model_id: 6,  image_url: "https://images.unsplash.com/photo-1680093661316-5a7e94ccbf37?auto=format&fit=crop&w=900&q=80" },
  { image_id: 7,  vehicle_model_id: 7,  image_url: "https://images.unsplash.com/photo-1617531653320-4cdb88e42ee9?auto=format&fit=crop&w=900&q=80" },
  { image_id: 8,  vehicle_model_id: 8,  image_url: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80" },
  { image_id: 9,  vehicle_model_id: 9,  image_url: "https://images.unsplash.com/photo-1536700503339-1e4b06520771?auto=format&fit=crop&w=900&q=80" },
  { image_id: 10, vehicle_model_id: 10, image_url: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80" },
  { image_id: 11, vehicle_model_id: 11, image_url: "https://images.unsplash.com/photo-1646768914119-4ccada7a9f15?auto=format&fit=crop&w=900&q=80" },
  { image_id: 12, vehicle_model_id: 12, image_url: "https://images.unsplash.com/photo-1614026480418-bd11fdb9fa06?auto=format&fit=crop&w=900&q=80" },
  { image_id: 13, vehicle_model_id: 13, image_url: "https://images.unsplash.com/photo-1626668011686-8b0cff2ec33f?auto=format&fit=crop&w=900&q=80" },
  { image_id: 14, vehicle_model_id: 14, image_url: "https://images.unsplash.com/photo-1647531038523-84b9f4d399bf?auto=format&fit=crop&w=900&q=80" },
  { image_id: 15, vehicle_model_id: 15, image_url: "https://images.unsplash.com/photo-1617531653320-4cdb88e42ee9?auto=format&fit=crop&w=900&q=80" }
];

export const vehicleFeatures: VehicleFeature[] = [
  { feature_id: 1,  feature_name: "Camera 360°" },
  { feature_id: 2,  feature_name: "Cruise Control" },
  { feature_id: 3,  feature_name: "Màn hình lớn" },
  { feature_id: 4,  feature_name: "Autopilot" },
  { feature_id: 5,  feature_name: "Sạc nhanh DC" },
  { feature_id: 6,  feature_name: "Cửa sổ trời" },
  { feature_id: 7,  feature_name: "Ghế sưởi" },
  { feature_id: 8,  feature_name: "Đỗ xe tự động" },
  { feature_id: 9,  feature_name: "Hệ thống âm thanh premium" },
  { feature_id: 10, feature_name: "AWD" }
];

export const vehicleModelFeatures: VehicleModelFeature[] = [
  { vehicle_model_id: 1,  feature_id: 1  }, { vehicle_model_id: 1,  feature_id: 3  },
  { vehicle_model_id: 2,  feature_id: 2  }, { vehicle_model_id: 2,  feature_id: 3  },
  { vehicle_model_id: 3,  feature_id: 5  }, { vehicle_model_id: 3,  feature_id: 10 },
  { vehicle_model_id: 4,  feature_id: 1  }, { vehicle_model_id: 4,  feature_id: 6  },
  { vehicle_model_id: 5,  feature_id: 5  }, { vehicle_model_id: 5,  feature_id: 10 }, { vehicle_model_id: 5, feature_id: 6 },
  { vehicle_model_id: 6,  feature_id: 5  }, { vehicle_model_id: 6,  feature_id: 3  },
  { vehicle_model_id: 7,  feature_id: 1  }, { vehicle_model_id: 7,  feature_id: 7  }, { vehicle_model_id: 7, feature_id: 10 },
  { vehicle_model_id: 8,  feature_id: 4  }, { vehicle_model_id: 8,  feature_id: 5  }, { vehicle_model_id: 8, feature_id: 3 },
  { vehicle_model_id: 9,  feature_id: 4  }, { vehicle_model_id: 9,  feature_id: 8  }, { vehicle_model_id: 9, feature_id: 9 },
  { vehicle_model_id: 10, feature_id: 4  }, { vehicle_model_id: 10, feature_id: 8  }, { vehicle_model_id: 10, feature_id: 6 },
  { vehicle_model_id: 11, feature_id: 10 }, { vehicle_model_id: 11, feature_id: 9  }, { vehicle_model_id: 11, feature_id: 7 },
  { vehicle_model_id: 12, feature_id: 9  }, { vehicle_model_id: 12, feature_id: 7  }, { vehicle_model_id: 12, feature_id: 8 },
  { vehicle_model_id: 13, feature_id: 5  }, { vehicle_model_id: 13, feature_id: 9  }, { vehicle_model_id: 13, feature_id: 6 },
  { vehicle_model_id: 14, feature_id: 10 }, { vehicle_model_id: 14, feature_id: 1  }, { vehicle_model_id: 14, feature_id: 5 },
  { vehicle_model_id: 15, feature_id: 1  }, { vehicle_model_id: 15, feature_id: 6  }, { vehicle_model_id: 15, feature_id: 10 }
];

export const vehicleSpecs: VehicleSpec[] = [
  { spec_id: 1,  vehicle_model_id: 1,  spec_name: "Pin",       spec_value: "42 kWh"          },
  { spec_id: 2,  vehicle_model_id: 1,  spec_name: "Tăng tốc",  spec_value: "0-100 trong 9s"  },
  { spec_id: 3,  vehicle_model_id: 2,  spec_name: "Pin",       spec_value: "38 kWh"           },
  { spec_id: 4,  vehicle_model_id: 3,  spec_name: "Pin",       spec_value: "77 kWh"           },
  { spec_id: 5,  vehicle_model_id: 4,  spec_name: "Pin",       spec_value: "75.7 kWh"         },
  { spec_id: 6,  vehicle_model_id: 5,  spec_name: "Pin",       spec_value: "77.4 kWh"         },
  { spec_id: 7,  vehicle_model_id: 6,  spec_name: "Pin",       spec_value: "77.4 kWh"         },
  { spec_id: 8,  vehicle_model_id: 7,  spec_name: "Pin",       spec_value: "87.7 kWh"         },
  { spec_id: 9,  vehicle_model_id: 8,  spec_name: "Pin",       spec_value: "82 kWh"           },
  { spec_id: 10, vehicle_model_id: 8,  spec_name: "Tăng tốc",  spec_value: "0-100 trong 6.1s" },
  { spec_id: 11, vehicle_model_id: 9,  spec_name: "Pin",       spec_value: "100 kWh"          },
  { spec_id: 12, vehicle_model_id: 9,  spec_name: "Tăng tốc",  spec_value: "0-100 trong 2.1s" },
  { spec_id: 13, vehicle_model_id: 12, spec_name: "Tăng tốc",  spec_value: "0-100 trong 4.1s" },
  { spec_id: 14, vehicle_model_id: 13, spec_name: "Pin",       spec_value: "112 kWh"          },
  { spec_id: 15, vehicle_model_id: 13, spec_name: "Tăng tốc",  spec_value: "0-100 trong 3.8s" }
];

export const rentalPlans: RentalPlan[] = [
  { rental_plan_id: 1, name: "Gói 4h",  duration_type: "hour", max_km: 150, overtime_price: 150000, over_km_price: 3000 },
  { rental_plan_id: 2, name: "Gói 8h",  duration_type: "hour", max_km: 250, overtime_price: 150000, over_km_price: 3000 },
  { rental_plan_id: 3, name: "Gói 24h", duration_type: "day",  max_km: 400, overtime_price: 150000, over_km_price: 3000 }
];

export const pricing: Pricing[] = [
  // model_id 1 – VF e34
  { pricing_id: 1,  vehicle_model_id: 1,  rental_plan_id: 1, price: 430000  },
  { pricing_id: 2,  vehicle_model_id: 1,  rental_plan_id: 2, price: 650000  },
  { pricing_id: 3,  vehicle_model_id: 1,  rental_plan_id: 3, price: 860000  },
  // model_id 2 – Hyundai Accent EV
  { pricing_id: 4,  vehicle_model_id: 2,  rental_plan_id: 1, price: 380000  },
  { pricing_id: 5,  vehicle_model_id: 2,  rental_plan_id: 2, price: 600000  },
  { pricing_id: 6,  vehicle_model_id: 2,  rental_plan_id: 3, price: 780000  },
  // model_id 3 – VW ID.4
  { pricing_id: 7,  vehicle_model_id: 3,  rental_plan_id: 1, price: 520000  },
  { pricing_id: 8,  vehicle_model_id: 3,  rental_plan_id: 2, price: 820000  },
  { pricing_id: 9,  vehicle_model_id: 3,  rental_plan_id: 3, price: 1050000 },
  // model_id 4 – Ford Mach-E
  { pricing_id: 10, vehicle_model_id: 4,  rental_plan_id: 1, price: 580000  },
  { pricing_id: 11, vehicle_model_id: 4,  rental_plan_id: 2, price: 900000  },
  { pricing_id: 12, vehicle_model_id: 4,  rental_plan_id: 3, price: 1150000 },
  // model_id 5 – Hyundai IONIQ 5
  { pricing_id: 13, vehicle_model_id: 5,  rental_plan_id: 1, price: 550000  },
  { pricing_id: 14, vehicle_model_id: 5,  rental_plan_id: 2, price: 860000  },
  { pricing_id: 15, vehicle_model_id: 5,  rental_plan_id: 3, price: 1100000 },
  // model_id 6 – Hyundai IONIQ 6
  { pricing_id: 16, vehicle_model_id: 6,  rental_plan_id: 1, price: 600000  },
  { pricing_id: 17, vehicle_model_id: 6,  rental_plan_id: 2, price: 950000  },
  { pricing_id: 18, vehicle_model_id: 6,  rental_plan_id: 3, price: 1200000 },
  // model_id 7 – VinFast VF 8
  { pricing_id: 19, vehicle_model_id: 7,  rental_plan_id: 1, price: 650000  },
  { pricing_id: 20, vehicle_model_id: 7,  rental_plan_id: 2, price: 1000000 },
  { pricing_id: 21, vehicle_model_id: 7,  rental_plan_id: 3, price: 1300000 },
  // model_id 8 – Tesla Model 3
  { pricing_id: 22, vehicle_model_id: 8,  rental_plan_id: 1, price: 750000  },
  { pricing_id: 23, vehicle_model_id: 8,  rental_plan_id: 2, price: 1150000 },
  { pricing_id: 24, vehicle_model_id: 8,  rental_plan_id: 3, price: 1500000 },
  // model_id 9 – Tesla Model S (hạng sang)
  { pricing_id: 25, vehicle_model_id: 9,  rental_plan_id: 1, price: 1400000 },
  { pricing_id: 26, vehicle_model_id: 9,  rental_plan_id: 2, price: 2100000 },
  { pricing_id: 27, vehicle_model_id: 9,  rental_plan_id: 3, price: 2800000 },
  // model_id 10 – Tesla Model X (hạng sang)
  { pricing_id: 28, vehicle_model_id: 10, rental_plan_id: 1, price: 1600000 },
  { pricing_id: 29, vehicle_model_id: 10, rental_plan_id: 2, price: 2400000 },
  { pricing_id: 30, vehicle_model_id: 10, rental_plan_id: 3, price: 3200000 },
  // model_id 11 – Polestar 2 (hạng sang)
  { pricing_id: 31, vehicle_model_id: 11, rental_plan_id: 1, price: 1200000 },
  { pricing_id: 32, vehicle_model_id: 11, rental_plan_id: 2, price: 1800000 },
  { pricing_id: 33, vehicle_model_id: 11, rental_plan_id: 3, price: 2400000 },
  // model_id 12 – Audi e-tron GT (hạng sang)
  { pricing_id: 34, vehicle_model_id: 12, rental_plan_id: 1, price: 1800000 },
  { pricing_id: 35, vehicle_model_id: 12, rental_plan_id: 2, price: 2700000 },
  { pricing_id: 36, vehicle_model_id: 12, rental_plan_id: 3, price: 3600000 },
  // model_id 13 – Lucid Air Pure (hạng sang)
  { pricing_id: 37, vehicle_model_id: 13, rental_plan_id: 1, price: 1900000 },
  { pricing_id: 38, vehicle_model_id: 13, rental_plan_id: 2, price: 2900000 },
  { pricing_id: 39, vehicle_model_id: 13, rental_plan_id: 3, price: 3800000 },
  // model_id 14 – Rivian R1S (hạng sang)
  { pricing_id: 40, vehicle_model_id: 14, rental_plan_id: 1, price: 1700000 },
  { pricing_id: 41, vehicle_model_id: 14, rental_plan_id: 2, price: 2600000 },
  { pricing_id: 42, vehicle_model_id: 14, rental_plan_id: 3, price: 3400000 },
  // model_id 15 – VinFast VF 9
  { pricing_id: 43, vehicle_model_id: 15, rental_plan_id: 1, price: 900000  },
  { pricing_id: 44, vehicle_model_id: 15, rental_plan_id: 2, price: 1400000 },
  { pricing_id: 45, vehicle_model_id: 15, rental_plan_id: 3, price: 1800000 }
];

export const bookings: Booking[] = [
  { booking_id: 1, user_id: 2, vehicle_id: 1, rental_plan_id: 3, start_time: "2026-04-26T01:00:00Z", end_time: "2026-04-27T01:00:00Z", planned_km: 120, actual_km: 110, deposit_amount: 500000, overtime_fee: 0, over_km_fee: 0, total_price: 860000, status: "confirmed", payment_method: "transfer", created_at: "2026-04-25T12:00:00Z" }
];

export const payments: Payment[] = [
  { payment_id: 1, booking_id: 1, amount: 860000, payment_method: "bank_transfer", payment_status: "paid", paid_at: "2026-04-25T12:10:00Z" }
];

export const reviews: Review[] = [
  { review_id: 1, user_id: 2, vehicle_model_id: 1, booking_id: 1, rating: 5, comment: "Xe sạch, dễ lái, đúng như mô tả.", created_at: "2026-04-25T12:30:00Z" },
  { review_id: 2, user_id: 2, vehicle_model_id: 8, booking_id: 1, rating: 5, comment: "Tesla quá mượt, Autopilot ấn tượng!", created_at: "2026-04-26T10:00:00Z" }
];

export const homepageTestimonials = [
  { id: 1,  name: "Anh Hoà",     area: "Ba Đình, Hà Nội",    rating: 5, message: "Hỗ trợ nhanh, đặt xe tiện lợi. VF8 rộng rãi, cảm giác lái rất êm." },
  { id: 2,  name: "Chị Linh",    area: "Cầu Giấy, Hà Nội",  rating: 5, message: "Gói 4h rất hợp lý cho đi nội thành. Xe giao đúng giờ, pin đầy 100%." },
  { id: 3,  name: "Anh Đạt",     area: "Đống Đa, Hà Nội",   rating: 5, message: "Thuê Tesla Model 3 trải nghiệm tuyệt vời. Nhất định sẽ quay lại!" },
  { id: 4,  name: "Chị Trang",   area: "Quận 1, TP.HCM",    rating: 5, message: "IONIQ 5 rộng mà vẫn dễ đỗ. Sạc nhanh DC chỉ 20 phút là đầy. Sẽ giới thiệu bạn bè!" },
  { id: 5,  name: "Anh Minh",    area: "Tây Hồ, Hà Nội",    rating: 5, message: "Lucid Air Pure êm tuyệt đối. Sang hơn mọi xe tôi từng đi. Đáng đồng tiền bát gạo!" },
  { id: 6,  name: "Chị Phương",  area: "Quận 3, TP.HCM",    rating: 4, message: "VF e34 phù hợp đường Sài Gòn. Gọn nhẹ, dễ lách. Dịch vụ khách hàng rất nhiệt tình." },
  { id: 7,  name: "Anh Quân",    area: "Thanh Xuân, Hà Nội", rating: 5, message: "Polestar 2 thiết kế đỉnh, âm thanh Harman Kardon cực ngon. Trải nghiệm châu Âu đích thực." },
  { id: 8,  name: "Chị Hà",      area: "Bình Thạnh, TP.HCM", rating: 5, message: "Đặt Tesla Model S đón đối tác nước ngoài — ấn tượng ngay từ lần gặp đầu tiên. Xuất sắc!" },
  { id: 9,  name: "Anh Dương",   area: "Long Biên, Hà Nội",  rating: 5, message: "Rivian R1S cho gia đình 7 người đi Hạ Long. Rộng, mạnh, cabin không ồn. Hài lòng 10/10!" },
  { id: 10, name: "Chị Ngân",    area: "Phú Nhuận, TP.HCM", rating: 4, message: "Audi e-tron GT sang trọng, hệ thống MMI dễ dùng. Đi dự tiệc cưới ai cũng ngoái nhìn." },
];

// ── BLOG ──────────────────────────────────────────────────────────────────────

export const blogCategories: BlogCategory[] = [
  { category_id: 1, name: "Kinh nghiệm lái xe điện", slug: "kinh-nghiem" },
  { category_id: 2, name: "Tin tức EV",               slug: "tin-tuc-ev" },
  { category_id: 3, name: "Hướng dẫn sạc pin",        slug: "sac-pin" },
  { category_id: 4, name: "Đánh giá xe",               slug: "danh-gia-xe" },
];

export const blogPosts: BlogPost[] = [
  {
    post_id: 1,
    user_id: 2,
    category_id: 1,
    title: "5 điều cần biết trước khi thuê xe điện lần đầu",
    slug: "5-dieu-can-biet-truoc-khi-thue-xe-dien",
    excerpt: "Xe điện ngày càng phổ biến, nhưng không phải ai cũng biết cách khai thác tối đa khi thuê. Bài viết này tổng hợp những kinh nghiệm thực tế.",
    content: `## 1. Kiểm tra mức pin trước khi nhận xe

Khi nhận xe, hãy chắc chắn pin ở mức tối thiểu 80%. GreenCar luôn giao xe với pin trên 80%, nhưng bạn nên xác nhận lại trên màn hình.

## 2. Lên kế hoạch sạc nếu đi xa

Xe điện có phạm vi hoạt động cố định — hãy dùng ứng dụng PlugShare để tìm trạm sạc trên tuyến đường. Với các gói 1 ngày trở lên, GreenCar hỗ trợ 1 lần sạc miễn phí tại trạm đối tác.

## 3. Lái xe êm, tận dụng phanh tái sinh

Chế độ "One-Pedal Driving" trên hầu hết xe điện giúp thu hồi năng lượng khi thả chân ga. Lái mượt = tiết kiệm pin và thoải mái hơn cho hành khách.

## 4. Không tắt điều hòa hoàn toàn khi trời nóng

Điều hòa tiêu thụ ~10-20% pin. Thay vì tắt hẳn, hãy đặt ở 25-26°C để cân bằng tiện nghi và mức tiêu thụ.

## 5. Hoàn trả đúng giờ để tránh phí phụ

GreenCar tính phí trễ 30 phút: 50.000 VNĐ/30 phút. Nếu cần thêm thời gian, hãy liên hệ hotline gia hạn trước ít nhất 1 tiếng.`,
    cover_image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&q=80",
    status: "published",
    published_at: "2026-03-15T08:00:00Z",
    created_at: "2026-03-14T10:00:00Z",
    updated_at: "2026-03-14T10:00:00Z",
  },
  {
    post_id: 2,
    user_id: 3,
    category_id: 4,
    title: "Đánh giá Hyundai IONIQ 5 sau 3 ngày thuê tại Hà Nội",
    slug: "danh-gia-hyundai-ioniq-5",
    excerpt: "IONIQ 5 là cái tên hot nhất phân khúc crossover điện hiện nay. Sau 3 ngày trải nghiệm thực tế trên đường Hà Nội, đây là những gì tôi nghĩ.",
    content: `## Thiết kế & nội thất

IONIQ 5 gây ấn tượng ngay từ cái nhìn đầu tiên với ngôn ngữ thiết kế Parametric Pixel vuông vức, retro-futuristic. Bên trong, khoảng cabin rộng bất ngờ nhờ sàn xe bằng phẳng (không có hầm truyền động).

## Khả năng vận hành

Phiên bản AWD 225 mã lực tăng tốc 0-100 km/h trong 5,1 giây. Trên đường Hà Nội đông đúc, sức mạnh này có vẻ "dư" nhưng cảm giác nhấn ga tức thì rất thú vị.

## Pin & sạc

Phạm vi thực tế ~370 km (thấp hơn công bố 451 km do điều hòa và kẹt xe). Điểm sáng là hỗ trợ sạc nhanh 800V — từ 10% lên 80% chỉ 18 phút tại trạm tương thích.

## Kết luận

IONIQ 5 là lựa chọn tuyệt vời cho chuyến đi 2-3 ngày. Giá thuê 1.250.000 VNĐ/ngày trên GreenCar là hợp lý cho trải nghiệm này.`,
    cover_image: "https://images.unsplash.com/photo-1619767886558-efdc259b6e09?w=800&q=80",
    status: "published",
    published_at: "2026-04-01T09:00:00Z",
    created_at: "2026-03-30T14:00:00Z",
    updated_at: "2026-03-30T14:00:00Z",
  },
  {
    post_id: 3,
    user_id: 2,
    category_id: 3,
    title: "Bản đồ trạm sạc xe điện tại Hà Nội 2026",
    slug: "ban-do-tram-sac-ha-noi-2026",
    excerpt: "Danh sách cập nhật các trạm sạc nhanh DC và sạc AC tại Hà Nội, kèm mức phí và giờ hoạt động.",
    content: `## Trạm sạc nhanh DC (CCS2 / CHAdeMO)

| Địa điểm | Công suất | Phí/kWh |
|---|---|---|
| VinFast – Mipec Tower, Long Biên | 120 kW | 3.858 VNĐ |
| EVgo – Lotte Center, Ba Đình | 100 kW | 4.200 VNĐ |
| Hyundai – Trường Chinh, Đống Đa | 100 kW | Miễn phí (KH Hyundai) |

## Trạm sạc AC (Type 2)

Hầu hết bãi đậu xe tại Vincom, AEON Mall, Lotte đều có trạm Type 2. Phù hợp cho sạc qua đêm (~7-10 tiếng đầy pin).

## Mẹo sử dụng

- **Giờ thấp điểm**: 22:00 – 06:00 có giá điện thấp hơn ~30% tại một số trạm
- **Ứng dụng**: PlugShare, EVN Smart Charge để kiểm tra trạm trống theo thời gian thực`,
    cover_image: "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=800&q=80",
    status: "published",
    published_at: "2026-04-10T07:00:00Z",
    created_at: "2026-04-09T16:00:00Z",
    updated_at: "2026-04-09T16:00:00Z",
  },
  {
    post_id: 4,
    user_id: 2,
    category_id: 2,
    title: "VinFast VF 9 – SUV 7 chỗ điện đầu tiên dành cho gia đình Việt",
    slug: "vinfast-vf9-suv-7-cho-dien",
    excerpt: "VF 9 vừa được bổ sung vào đội xe GreenCar. Đây là cái nhìn tổng quan về người khổng lồ 7 chỗ mang thương hiệu Việt.",
    content: `VinFast VF 9 là chiếc SUV 7 chỗ điện đầu tiên của VinFast nhắm vào phân khúc gia đình cao cấp.

**Thông số nổi bật:**
- 402 mã lực, AWD
- Phạm vi 438 km (WLTP)
- Cốp sau 585 lít
- 8 túi khí

Trải nghiệm lái rất ổn định nhờ hệ thống treo khí nén tùy chọn. Ghế hàng 3 dễ gập và vào/ra thuận tiện hơn nhiều so với VF 8.`,
    cover_image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
    status: "pending",
    published_at: null,
    created_at: "2026-05-01T11:00:00Z",
    updated_at: "2026-05-01T11:00:00Z",
  },
  {
    post_id: 5,
    user_id: 3,
    category_id: 1,
    title: "Kinh nghiệm lái xe điện trên cao tốc Hà Nội – Hải Phòng",
    slug: "kinh-nghiem-lai-xe-dien-cao-toc-ha-noi-hai-phong",
    excerpt: "Chuyến đi 200 km Hà Nội – Hải Phòng và về bằng Hyundai Accent EV: tiêu hao thực tế, trạm sạc dọc đường, và những bất ngờ.",
    content: `Nội dung đang được biên soạn...`,
    cover_image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&q=80",
    status: "draft",
    published_at: null,
    created_at: "2026-05-03T09:00:00Z",
    updated_at: "2026-05-03T09:00:00Z",
  },
];
