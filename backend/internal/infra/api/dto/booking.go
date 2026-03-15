package dto

import "time"

// BookingResponse is the API response payload for a booking.
type BookingResponse struct {
	ID            int        `json:"id"`
	UserID        int        `json:"user_id"`
	VehicleID     int        `json:"vehicle_id"`
	RentalPlanID  int        `json:"rental_plan_id"`
	StartTime     time.Time  `json:"start_time"`
	EndTime       time.Time  `json:"end_time"`
	ActualStart   *time.Time `json:"actual_start_time,omitempty"`
	ActualEnd     *time.Time `json:"actual_end_time,omitempty"`
	PlannedKM     int        `json:"planned_km"`
	ActualKM      int        `json:"actual_km"`
	DepositAmount float64    `json:"deposit_amount"`
	OvertimeFee   float64    `json:"overtime_fee"`
	OverKMFee     float64    `json:"over_km_fee"`
	TotalPrice    float64    `json:"total_price"`
	Status        string     `json:"status"`
	CreatedAt     time.Time  `json:"created_at"`
}

// CreateBookingRequest is the request payload to create a booking.
type CreateBookingRequest struct {
	UserID        int     `json:"user_id"`
	VehicleID     int     `json:"vehicle_id"`
	RentalPlanID  int     `json:"rental_plan_id"`
	StartTime     string  `json:"start_time"` // ISO8601 (RFC3339)
	EndTime       string  `json:"end_time"`   // ISO8601 (RFC3339)
	PlannedKM     int     `json:"planned_km"`
	DepositAmount float64 `json:"deposit_amount"`
	TotalPrice    float64 `json:"total_price"`
}
