package domain

// Vehicle represents the vehicles table.
type Vehicle struct {
	VehicleID      int    `json:"vehicle_id"`
	VehicleModelID int    `json:"vehicle_model_id"`
	LicensePlate   string `json:"license_plate"`
	Status         string `json:"status"`
	BatteryLevel   int    `json:"battery_level"`
	BatteryHealth  int    `json:"battery_health"`
	LocationID     int    `json:"location_id"`
}
