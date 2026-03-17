package dto

// VehicleDetailResponse is the API response payload for the vehicle detail page.
type VehicleDetailResponse struct {
	Vehicle  *VehicleResponse          `json:"vehicle"`
	Model    *VehicleModelResponse     `json:"model"`
	Location *LocationResponse         `json:"location"`
	Images   []*VehicleImageResponse   `json:"images"`
	Specs    []*VehicleSpecResponse    `json:"specs"`
	Pricing  []*VehiclePricingResponse `json:"pricing"`
	Reviews  []*ReviewResponse         `json:"reviews"`
	Meta     *VehicleMetaResponse      `json:"meta"`
}

// VehicleMetaResponse contains computed metadata for a vehicle detail page.
type VehicleMetaResponse struct {
	AvgRating   float64 `json:"avg_rating"`
	ReviewCount int     `json:"review_count"`
	Available   bool    `json:"available"`
}

// VehicleModelResponse represents a vehicle model.
type VehicleModelResponse struct {
	ID            int    `json:"id"`
	Name          string `json:"name"`
	Brand         string `json:"brand"`
	Seats         int    `json:"seats"`
	Horsepower    int    `json:"horsepower"`
	RangeKM       int    `json:"range_km"`
	TrunkCapacity int    `json:"trunk_capacity"`
	Airbags       int    `json:"airbags"`
	VehicleType   string `json:"vehicle_type"`
	Transmission  string `json:"transmission"`
}

// LocationResponse represents a location.
type LocationResponse struct {
	ID        int     `json:"id"`
	Name      string  `json:"name"`
	Address   string  `json:"address"`
	City      string  `json:"city"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}

// VehicleImageResponse represents an image for a vehicle model.
type VehicleImageResponse struct {
	ID      int    `json:"id"`
	ModelID int    `json:"model_id"`
	URL     string `json:"url"`
}

// VehicleSpecResponse represents a spec of a vehicle model.
type VehicleSpecResponse struct {
	ID      int    `json:"id"`
	ModelID int    `json:"model_id"`
	Name    string `json:"name"`
	Value   string `json:"value"`
}

// VehiclePricingResponse represents pricing for a vehicle model along with its rental plan.
type VehiclePricingResponse struct {
	Pricing    *PricingResponse    `json:"pricing"`
	RentalPlan *RentalPlanResponse `json:"rental_plan"`
}

// PricingResponse represents a pricing row.
type PricingResponse struct {
	ID           int     `json:"id"`
	ModelID      int     `json:"model_id"`
	RentalPlanID int     `json:"rental_plan_id"`
	Price        float64 `json:"price"`
}

// RentalPlanResponse represents a rental plan.
type RentalPlanResponse struct {
	ID            int     `json:"id"`
	Name          string  `json:"name"`
	DurationType  string  `json:"duration_type"`
	MaxKM         int     `json:"max_km"`
	OvertimePrice float64 `json:"overtime_price"`
	OverKMPrice   float64 `json:"over_km_price"`
}

// ReviewResponse represents a review.
type ReviewResponse struct {
	ID        int    `json:"id"`
	UserID    int    `json:"user_id"`
	ModelID   int    `json:"model_id"`
	BookingID int    `json:"booking_id"`
	Rating    int    `json:"rating"`
	Comment   string `json:"comment"`
	CreatedAt string `json:"created_at"`
}
