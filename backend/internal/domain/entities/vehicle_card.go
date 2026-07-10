package entities

import "time"

// VehicleCard is a lightweight composite view used in list pages and carousels.
type VehicleCard struct {
	Vehicle  *Vehicle
	Model    *VehicleModel
	Location *Location
	ImageURL string
	Price24h float64
	Price4h  float64
	TripCount int
	Revenue   float64
	AvgRating float64
	PromoDiscount float64
	PromoEndDate  *time.Time
}
