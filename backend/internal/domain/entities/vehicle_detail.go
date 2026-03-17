package entities

// VehicleDetail is a composite view of a vehicle including related model, location, pricing, and reviews.
type VehicleDetail struct {
	Vehicle  *Vehicle          `json:"vehicle"`
	Model    *VehicleModel     `json:"model"`
	Location *Location         `json:"location"`
	Images   []*VehicleImage   `json:"images"`
	Specs    []*VehicleSpec    `json:"specs"`
	Pricing  []*VehiclePricing `json:"pricing"`
	Reviews  []*Review         `json:"reviews"`
	Meta     *VehicleMeta      `json:"meta"`
}

// VehicleMeta contains computed metadata for the vehicle detail page.
type VehicleMeta struct {
	AvgRating   float64 `json:"avg_rating"`
	ReviewCount int     `json:"review_count"`
	Available   bool    `json:"available"`
}

// VehiclePricing is pricing detail for a vehicle model, including rental plan information.
type VehiclePricing struct {
	Pricing    *Pricing    `json:"pricing"`
	RentalPlan *RentalPlan `json:"rental_plan"`
}
