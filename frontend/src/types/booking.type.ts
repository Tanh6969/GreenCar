export interface RentalPlan {
  rental_plan_id: number;
  name: string;
  duration_type: "hour" | "day";
  max_km: number;
  overtime_price: number;
  over_km_price: number;
}

export interface Pricing {
  pricing_id: number;
  vehicle_model_id: number;
  rental_plan_id: number;
  price: number;
}

export interface Booking {
  booking_id: number;
  user_id: number;
  vehicle_id: number;
  rental_plan_id: number;
  start_time: string;
  end_time: string;
  actual_start_time?: string;
  actual_end_time?: string;
  planned_km: number;
  actual_km: number;
  deposit_amount: number;
  overtime_fee: number;
  over_km_fee: number;
  total_price: number;
  status: "pending" | "confirmed" | "running" | "completed" | "cancelled";
  created_at: string;
}
