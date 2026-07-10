package entities

import "time"

// Booking represents the bookings table, optionally enriched with joined fields.
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
	ExtraFee        float64    `json:"extra_fee"`
	ExtraFeeDesc    string     `json:"extra_fee_desc,omitempty"`
	TotalPrice      float64    `json:"total_price"`
	Status          string     `json:"status"`
	PaymentMethod   string     `json:"payment_method,omitempty"`
	CreatedAt       *time.Time `json:"created_at"`
	// Joined fields (populated by detail queries)
	VehicleModelID  int        `json:"vehicle_model_id,omitempty"`
	VehicleBrand  string     `json:"vehicle_brand,omitempty"`
	VehicleName   string     `json:"vehicle_name,omitempty"`
	LicensePlate  string     `json:"license_plate,omitempty"`
	CustomerName  string     `json:"customer_name,omitempty"`
	CustomerPhone string     `json:"customer_phone,omitempty"`
	HasReviewed   bool       `json:"has_reviewed"`
}
