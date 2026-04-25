import { bookings, pricing, rentalPlans } from "../data/mockData";
import { Booking } from "../types/booking.type";

const wait = async (ms = 200) => new Promise((r) => setTimeout(r, ms));

export const bookingService = {
  async getBookingsByUser(userId: number): Promise<Booking[]> {
    await wait();
    return bookings.filter((b) => b.user_id === userId);
  },

  async getAllBookings(): Promise<Booking[]> {
    await wait();
    return bookings;
  },

  async createBooking(payload: Omit<Booking, "booking_id" | "created_at">): Promise<Booking> {
    await wait();
    return {
      ...payload,
      booking_id: bookings.length + 1,
      created_at: new Date().toISOString()
    };
  },

  async getRentalPlans() {
    await wait();
    return rentalPlans;
  },

  async getPricing() {
    await wait();
    return pricing;
  }
};
