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
	ExtraFee      float64    `json:"extra_fee"`
	ExtraFeeDesc  string     `json:"extra_fee_desc,omitempty"`
	TotalPrice    float64    `json:"total_price"`
	Status        string     `json:"status"`
	PaymentMethod string     `json:"payment_method,omitempty"`
	CreatedAt     time.Time  `json:"created_at"`
	// Enriched from JOIN
	VehicleModelID int    `json:"vehicle_model_id,omitempty"`
	VehicleBrand  string `json:"vehicle_brand,omitempty"`
	VehicleName   string `json:"vehicle_name,omitempty"`
	LicensePlate  string `json:"license_plate,omitempty"`
	CustomerName  string `json:"customer_name,omitempty"`
	CustomerPhone string `json:"customer_phone,omitempty"`
	CustomerEmail string `json:"customer_email,omitempty"`
	CustomerLicenseNo string `json:"customer_license_no,omitempty"`
	CustomerTripCount int    `json:"customer_trip_count,omitempty"`
	OwnerNote     string `json:"owner_note,omitempty"`
	HasReviewed   bool   `json:"has_reviewed"`
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
	PaymentMethod string  `json:"payment_method"`
}

// UpdateBookingRequest is the request payload to update a booking.
type UpdateBookingRequest struct {
	UserID        int     `json:"user_id"`
	VehicleID     int     `json:"vehicle_id"`
	RentalPlanID  int     `json:"rental_plan_id"`
	StartTime     string  `json:"start_time"` // ISO8601 (RFC3339)
	EndTime       string  `json:"end_time"`   // ISO8601 (RFC3339)
	PlannedKM     int     `json:"planned_km"`
	ActualKM      int     `json:"actual_km"`
	DepositAmount float64 `json:"deposit_amount"`
	OvertimeFee   float64 `json:"overtime_fee"`
	OverKMFee     float64 `json:"over_km_fee"`
	TotalPrice    float64 `json:"total_price"`
	Status        string  `json:"status"`
}

// SetBookingStatusRequest is used by admin to change only the booking status.
type SetBookingStatusRequest struct {
	Status string `json:"status"`
}

// CompleteBookingRequest is used by owner to complete a trip
type CompleteBookingRequest struct {
	ActualKM     int     `json:"actual_km"`
	ExtraFee     float64 `json:"extra_fee"`
	ExtraFeeDesc string  `json:"extra_fee_desc"`
}

// ApproveBookingRequest is used by owner to approve or reject a pending booking.
type ApproveBookingRequest struct {
	OwnerNote string `json:"owner_note"`
}

// PricingRuleRequest is used to create/update a vehicle pricing rule.
type PricingRuleRequest struct {
	RuleType        string  `json:"rule_type"`
	DiscountPercent float64 `json:"discount_percent"`
	ExtraPercent    float64 `json:"extra_percent"`
	MinDays         int     `json:"min_days"`
	PromoStartDate  string  `json:"promo_start_date,omitempty"` // YYYY-MM-DD
	PromoEndDate    string  `json:"promo_end_date,omitempty"`   // YYYY-MM-DD
	IsActive        bool    `json:"is_active"`
}

// CalculatePriceRequest is sent by frontend to preview adjusted price.
type CalculatePriceRequest struct {
	VehicleID  int     `json:"vehicle_id"`
	BasePrice  float64 `json:"base_price"`
	StartTime  string  `json:"start_time"`
	EndTime    string  `json:"end_time"`
}

// CalculatePriceResponse returns the adjusted price with applied rules.
type CalculatePriceResponse struct {
	OriginalPrice float64  `json:"original_price"`
	FinalPrice    float64  `json:"final_price"`
	AppliedRules  []string `json:"applied_rules"`
}
