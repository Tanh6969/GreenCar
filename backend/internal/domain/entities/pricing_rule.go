package entities

import "time"

// PricingRule represents a flexible pricing rule for a vehicle.
type PricingRule struct {
	ID              int        `json:"id"`
	VehicleID       int        `json:"vehicle_id"`
	RuleType        string     `json:"rule_type"` // "weekend" | "multi_day"
	DiscountPercent float64    `json:"discount_percent"`
	ExtraPercent    float64    `json:"extra_percent"`
	MinDays         int        `json:"min_days"`
	PromoStartDate  *time.Time `json:"promo_start_date,omitempty"`
	PromoEndDate    *time.Time `json:"promo_end_date,omitempty"`
	IsActive        bool       `json:"is_active"`
}
