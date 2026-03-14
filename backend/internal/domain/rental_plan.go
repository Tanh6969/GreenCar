package domain

// RentalPlan represents the rental_plans table.
type RentalPlan struct {
	RentalPlanID  int     `json:"rental_plan_id"`
	Name         string  `json:"name"`
	DurationType string  `json:"duration_type"`
	MaxKM        int     `json:"max_km"`
	OvertimePrice float64 `json:"overtime_price"`
	OverKMPrice   float64 `json:"over_km_price"`
}
