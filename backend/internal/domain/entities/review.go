package entities

import "time"

// Review represents the reviews table.
type Review struct {
	ReviewID       int        `json:"review_id"`
	UserID         int        `json:"user_id"`
	VehicleModelID int        `json:"vehicle_model_id"`
	BookingID      int        `json:"booking_id"`
	Rating         int        `json:"rating"`
	Comment        string     `json:"comment"`
	CreatedAt      *time.Time `json:"created_at"`
}
