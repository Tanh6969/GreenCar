package dto

// VehicleResponse is the API response payload for a vehicle.
type VehicleResponse struct {
	ID            int    `json:"id"`
	ModelID       int    `json:"model_id"`
	LicensePlate  string `json:"license_plate"`
	Status        string `json:"status"`
	BatteryLevel  int     `json:"battery_level"`
	BatteryHealth int     `json:"battery_health"`
	LocationID    int     `json:"location_id"`
	OwnerID       int     `json:"owner_id"`
	AvailableFrom *string `json:"available_from,omitempty"`
	AvailableTo   *string `json:"available_to,omitempty"`
}

// CreateVehicleRequest is the request payload to create a vehicle.
type CreateVehicleRequest struct {
	ModelID       int    `json:"model_id"`
	LicensePlate  string `json:"license_plate"`
	Status        string `json:"status"`
	BatteryLevel  int    `json:"battery_level"`
	BatteryHealth int    `json:"battery_health"`
	LocationID    int    `json:"location_id"`
	ImageURL      string `json:"image_url"`
}

// UpdateVehicleRequest is the request payload to update a vehicle.
type UpdateVehicleRequest struct {
	ModelID       int    `json:"model_id"`
	LicensePlate  string `json:"license_plate"`
	Status        string `json:"status"`
	BatteryLevel  int    `json:"battery_level"`
	BatteryHealth int    `json:"battery_health"`
	LocationID    int    `json:"location_id"`
	ImageURL      string `json:"image_url"`
}
