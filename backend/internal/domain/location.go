package domain

// Location represents the locations table.
type Location struct {
	LocationID int     `json:"location_id"`
	Name       string  `json:"name"`
	Address    string  `json:"address"`
	City       string  `json:"city"`
	Latitude   float64 `json:"latitude"`
	Longitude  float64 `json:"longitude"`
}
