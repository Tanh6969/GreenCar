package entities

// Pricing represents the pricing table.
type Pricing struct {
	PricingID      int     `json:"pricing_id"`
	VehicleModelID int     `json:"vehicle_model_id"`
	RentalPlanID   int     `json:"rental_plan_id"`
	Price          float64 `json:"price"`
}
