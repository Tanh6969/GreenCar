import { apiClient } from "./api";
import { Booking } from "../types/booking.type";

interface ApiBooking {
  id: number; user_id: number; vehicle_id: number; rental_plan_id: number;
  start_time: string; end_time: string;
  actual_start_time?: string; actual_end_time?: string;
  planned_km: number; actual_km: number;
  deposit_amount: number; overtime_fee: number; over_km_fee: number; total_price: number;
  status: string; payment_method?: string; created_at: string;
  vehicle_brand?: string; vehicle_name?: string; license_plate?: string;
  customer_name?: string; customer_phone?: string;
}

function toBooking(b: ApiBooking): Booking {
  return {
    booking_id:     b.id,
    user_id:        b.user_id,
    vehicle_id:     b.vehicle_id,
    rental_plan_id: b.rental_plan_id,
    start_time:     b.start_time,
    end_time:       b.end_time,
    actual_start_time: b.actual_start_time,
    actual_end_time:   b.actual_end_time,
    planned_km:     b.planned_km,
    actual_km:      b.actual_km,
    deposit_amount: b.deposit_amount,
    overtime_fee:   b.overtime_fee,
    over_km_fee:    b.over_km_fee,
    total_price:    b.total_price,
    status:         b.status as Booking["status"],
    payment_method: b.payment_method ?? "",
    created_at:     b.created_at,
    vehicle_brand:  b.vehicle_brand,
    vehicle_name:   b.vehicle_name,
    license_plate:  b.license_plate,
    customer_name:  b.customer_name,
    customer_phone: b.customer_phone,
  };
}

export const bookingService = {
  async getBookingsByUser(_userId: number): Promise<Booking[]> {
    const data = await apiClient<ApiBooking[]>("/customers/me/bookings");
    return (data ?? []).map(toBooking);
  },

  async getAllBookings(): Promise<Booking[]> {
    const data = await apiClient<ApiBooking[]>("/admin/bookings");
    return (data ?? []).map(toBooking);
  },

  async createBooking(payload: Omit<Booking, "booking_id" | "created_at">): Promise<Booking> {
    const data = await apiClient<ApiBooking>("/bookings", "POST", {
      user_id:        payload.user_id,
      vehicle_id:     payload.vehicle_id,
      rental_plan_id: payload.rental_plan_id,
      start_time:     payload.start_time,
      end_time:       payload.end_time,
      planned_km:     payload.planned_km,
      deposit_amount: payload.deposit_amount,
      total_price:    payload.total_price,
      payment_method: payload.payment_method,
    });
    return toBooking(data);
  },

  async setBookingStatus(id: number, status: string): Promise<void> {
    await apiClient<ApiBooking>(`/admin/bookings/${id}/status`, "PATCH", { status });
  },

  async updateBooking(id: number, payload: Partial<Booking>): Promise<Booking> {
    const data = await apiClient<ApiBooking>(`/admin/bookings/${id}`, "PUT", payload);
    return toBooking(data);
  },

  // Pricing and rental plans are embedded in the vehicle detail response.
  // These helpers read from the vehicle detail API via vehicleService.
  async getRentalPlans() {
    return [];
  },

  async getPricing() {
    return [];
  },
};
