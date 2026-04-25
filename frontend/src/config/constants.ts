export const BOOKING_STATUS = {
  pending: "pending",
  confirmed: "confirmed",
  running: "running",
  completed: "completed",
  cancelled: "cancelled"
} as const;

export const ROLE = {
  admin: 1,
  customer: 2
} as const;
