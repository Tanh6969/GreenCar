package dto

// VehicleResponse is the API response payload for a vehicle.
type VehicleResponse struct {
	ID            int    `json:"id"`
	ModelID       int    `json:"model_id"`
	LicensePlate  string `json:"license_plate"`
	Status        string `json:"status"`
	BatteryLevel  int    `json:"battery_level"`
	BatteryHealth int    `json:"battery_health"`
	LocationID    int    `json:"location_id"`
}
