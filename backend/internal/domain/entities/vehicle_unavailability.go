package entities

import "time"

type VehicleUnavailability struct {
	ID        int       `json:"id"`
	VehicleID int       `json:"vehicle_id"`
	StartTime time.Time `json:"start_time"`
	EndTime   time.Time `json:"end_time"`
	Type      string    `json:"type"` // "blocked" or "booked"
	CreatedAt time.Time `json:"created_at"`
}
