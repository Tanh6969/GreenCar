package entities

import "time"

// Booking represents the bookings table.
type Booking struct {
	BookingID       int        `json:"booking_id"`
	UserID          int        `json:"user_id"`
	VehicleID       int        `json:"vehicle_id"`
	RentalPlanID    int        `json:"rental_plan_id"`
	StartTime       *time.Time `json:"start_time"`
	EndTime         *time.Time `json:"end_time"`
	ActualStartTime *time.Time `json:"actual_start_time,omitempty"`
	ActualEndTime   *time.Time `json:"actual_end_time,omitempty"`
	PlannedKM       int        `json:"planned_km"`
	ActualKM        int        `json:"actual_km"`
	DepositAmount   float64    `json:"deposit_amount"`
	OvertimeFee     float64    `json:"overtime_fee"`
	OverKMFee       float64    `json:"over_km_fee"`
	TotalPrice      float64    `json:"total_price"`
	Status          string     `json:"status"`
	CreatedAt       *time.Time `json:"created_at"`
}
