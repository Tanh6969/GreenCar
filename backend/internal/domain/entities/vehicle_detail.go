package entities

// VehicleDetail is a composite view of a vehicle including related model, location, pricing, and reviews.
type VehicleDetail struct {
	Vehicle   *Vehicle          `json:"vehicle"`
	Model     *VehicleModel     `json:"model"`
	Location  *Location         `json:"location"`
	Images    []*VehicleImage   `json:"images"`
	Features  []*VehicleFeature `json:"features"`
	Specs     []*VehicleSpec    `json:"specs"`
	Pricing   []*VehiclePricing `json:"pricing"`
	Reviews   []*Review         `json:"reviews"`
	Meta           *VehicleMeta      `json:"meta"`
	OwnerInfo      *OwnerPublic      `json:"owner"`
	ActiveBookings []*TimeRange      `json:"active_bookings"`
}

// TimeRange represents a simple start and end time.
type TimeRange struct {
	StartTime string `json:"start_time"`
	EndTime   string `json:"end_time"`
}

// VehicleMeta contains computed metadata for the vehicle detail page.
type VehicleMeta struct {
	AvgRating   float64 `json:"avg_rating"`
	ReviewCount int     `json:"review_count"`
	Available   bool    `json:"available"`
}

// OwnerPublic is public info about the vehicle owner shown on the detail page.
type OwnerPublic struct {
	UserID    int     `json:"user_id"`
	Name      string  `json:"name"`
	Phone     string  `json:"phone"`
	TripCount int     `json:"trip_count"`
	AvgRating float64 `json:"avg_rating"`
}

// VehiclePricing is pricing detail for a vehicle model, including rental plan information.
type VehiclePricing struct {
	Pricing    *Pricing    `json:"pricing"`
	RentalPlan *RentalPlan `json:"rental_plan"`
}
