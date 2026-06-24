import { apiClient } from "./api";
import { VehicleCardData } from "../types/vehicle.type";

// ── shapes returned by the backend ───────────────────────────

interface ApiVehicle {
  id: number; model_id: number; license_plate: string; status: string;
  battery_level: number; battery_health: number; location_id: number; owner_id?: number;
}
interface ApiModel {
  id: number; name: string; brand: string; seats: number; horsepower: number;
  range_km: number; trunk_capacity: number; airbags: number; vehicle_type: string; transmission: string;
}
interface ApiLocation {
  id: number; name: string; address: string; city: string; latitude: number; longitude: number;
}
interface ApiImage { id: number; model_id: number; url: string; }
interface ApiSpec  { id: number; model_id: number; name: string; value: string; }
interface ApiPricing {
  pricing:     { id: number; model_id: number; rental_plan_id: number; price: number };
  rental_plan: { id: number; name: string; duration_type: string; max_km: number; overtime_price: number; over_km_price: number };
}
interface ApiReview {
  id: number; user_id: number; reviewer_name?: string; model_id: number; booking_id: number;
  rating: number; comment: string; created_at: string;
}
interface ApiOwner {
  user_id: number; name: string; phone: string; trip_count: number; avg_rating: number;
}
interface ApiMeta { avg_rating: number; review_count: number; available: boolean; }

interface VehicleCardApiResponse {
  vehicle:  ApiVehicle;
  model:    ApiModel;
  location: ApiLocation;
  image_url: string;
  price_24h: number;
  price_4h: number;
}

interface ApiFeature { feature_id: number; feature_name: string; }

interface VehicleDetailApiResponse {
  vehicle:  ApiVehicle;
  model:    ApiModel;
  location: ApiLocation;
  images:   ApiImage[];
  features: ApiFeature[];
  specs:    ApiSpec[];
  pricing:  ApiPricing[];
  reviews:  ApiReview[];
  meta:     ApiMeta;
  owner?:   ApiOwner;
  active_bookings?: { start_time: string; end_time: string }[];
}

// ── mappers ───────────────────────────────────────────────────

function mapCard(r: VehicleCardApiResponse): VehicleCardData {
  return {
    vehicle: {
      vehicle_id: r.vehicle.id, vehicle_model_id: r.vehicle.model_id,
      license_plate: r.vehicle.license_plate,
      status: r.vehicle.status as "available" | "booked" | "maintenance",
      battery_level: r.vehicle.battery_level, battery_health: r.vehicle.battery_health,
      location_id: r.vehicle.location_id, owner_id: r.vehicle.owner_id,
    },
    model: {
      vehicle_model_id: r.model.id, name: r.model.name, brand: r.model.brand,
      seats: r.model.seats, horsepower: r.model.horsepower, range_km: r.model.range_km,
      trunk_capacity: r.model.trunk_capacity, airbags: r.model.airbags,
      vehicle_type: r.model.vehicle_type, transmission: r.model.transmission,
    },
    location: {
      location_id: r.location.id, name: r.location.name, address: r.location.address,
      city: r.location.city, latitude: r.location.latitude, longitude: r.location.longitude,
    },
    image_url: r.image_url,
    price_24h: r.price_24h,
    price_4h: r.price_4h,
  };
}

export const vehicleService = {
  async getVehicleCards(): Promise<VehicleCardData[]> {
    const data = await apiClient<VehicleCardApiResponse[]>("/vehicles/cards");
    return (data ?? []).map(mapCard);
  },

  async getVehicleDetail(vehicleId: number) {
    const r = await apiClient<VehicleDetailApiResponse>(`/vehicles/${vehicleId}/detail`);
    if (!r) return null;
    return {
      vehicle: {
        vehicle_id: r.vehicle.id, vehicle_model_id: r.vehicle.model_id,
        license_plate: r.vehicle.license_plate,
        status: r.vehicle.status as "available" | "booked" | "maintenance",
        battery_level: r.vehicle.battery_level, battery_health: r.vehicle.battery_health,
        location_id: r.vehicle.location_id, owner_id: r.vehicle.owner_id,
      },
      model: {
        vehicle_model_id: r.model.id, name: r.model.name, brand: r.model.brand,
        seats: r.model.seats, horsepower: r.model.horsepower, range_km: r.model.range_km,
        trunk_capacity: r.model.trunk_capacity, airbags: r.model.airbags,
        vehicle_type: r.model.vehicle_type, transmission: r.model.transmission,
      },
      location: {
        location_id: r.location.id, name: r.location.name, address: r.location.address,
        city: r.location.city, latitude: r.location.latitude, longitude: r.location.longitude,
      },
      images:    (r.images   ?? []).map(i => ({ image_id: i.id, vehicle_model_id: i.model_id, image_url: i.url })),
      features:  (r.features ?? []).map(f => ({ feature_id: f.feature_id, feature_name: f.feature_name })),
      specs:     (r.specs    ?? []).map(s => ({ spec_id: s.id, vehicle_model_id: s.model_id, spec_name: s.name, spec_value: s.value })),
      pricing: (r.pricing ?? []).map(p => ({
        pricing_id: p.pricing.id, vehicle_model_id: p.pricing.model_id,
        rental_plan_id: p.pricing.rental_plan_id, price: p.pricing.price,
      })),
      rentalPlans: (r.pricing ?? []).map(p => ({
        rental_plan_id: p.rental_plan.id, name: p.rental_plan.name,
        duration_type: p.rental_plan.duration_type, max_km: p.rental_plan.max_km,
        overtime_price: p.rental_plan.overtime_price, over_km_price: p.rental_plan.over_km_price,
      })),
      reviews: (r.reviews ?? []).map(rv => ({
        review_id: rv.id, user_id: rv.user_id, reviewer_name: rv.reviewer_name || "Ẩn danh", vehicle_model_id: rv.model_id,
        booking_id: rv.booking_id, rating: rv.rating, comment: rv.comment, created_at: rv.created_at,
      })),
      owner: r.owner ? {
        user_id: r.owner.user_id, name: r.owner.name, phone: r.owner.phone,
        trip_count: r.owner.trip_count, avg_rating: r.owner.avg_rating,
      } : undefined,
      meta: r.meta,
      active_bookings: (r.active_bookings ?? []).map(b => ({
        start_time: b.start_time,
        end_time: b.end_time,
      })),
    };
  },

  async adminCreateVehicle(data: {
    model_id: number; license_plate: string; status: string;
    battery_level: number; battery_health: number; location_id: number; image_url?: string;
  }): Promise<void> {
    await apiClient("/admin/vehicles", "POST", data);
  },

  async adminUpdateVehicle(id: number, data: {
    model_id: number; license_plate: string; status: string;
    battery_level: number; battery_health: number; location_id: number; image_url?: string;
  }): Promise<void> {
    await apiClient(`/admin/vehicles/${id}`, "PUT", data);
  },

  async adminDeleteVehicle(id: number): Promise<void> {
    await apiClient(`/admin/vehicles/${id}`, "DELETE");
  },
};
