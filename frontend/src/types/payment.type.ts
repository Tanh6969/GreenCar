export interface Payment {
  payment_id: number;
  booking_id: number;
  amount: number;
  payment_method: "bank_transfer" | "card" | "wallet";
  payment_status: "pending" | "paid" | "failed";
  paid_at?: string;
}

export interface Review {
  review_id: number;
  user_id: number;
  vehicle_model_id: number;
  booking_id: number;
  rating: number;
  comment: string;
  created_at: string;
}
