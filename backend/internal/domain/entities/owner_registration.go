package entities

import "time"

type OwnerRegistration struct {
	ID           int       `json:"id"`
	UserID       int       `json:"user_id"`
	OwnerName    string    `json:"owner_name"` // Joined from users
	OwnerPhone   string    `json:"owner_phone"` // Joined from users
	Brand        string    `json:"brand"`
	Model        string    `json:"model"`
	Year         string    `json:"year"`
	LicensePlate string    `json:"license_plate"`
	Color        string    `json:"color"`
	Seats        string    `json:"seats"`
	Transmission string    `json:"transmission"`
	FuelType     string    `json:"fuel_type"`
	City         string    `json:"city"`
	Address      string    `json:"address"`
	PricePerDay  float64   `json:"price_per_day"`
	Description  string    `json:"description"`
	Images       []Image   `json:"images"`
	Status       string    `json:"status"` // pending, reviewing, approved, rejected
	RejectReason string    `json:"reject_reason,omitempty"`
	CreatedAt    time.Time `json:"created_at"`
}

type Image struct {
	Type string `json:"type"`
	URL  string `json:"url"`
}
