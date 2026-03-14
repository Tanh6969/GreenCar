package domain

// VehicleModel represents the vehicle_models table.
type VehicleModel struct {
	VehicleModelID int    `json:"vehicle_model_id"`
	Name           string `json:"name"`
	Brand          string `json:"brand"`
	Seats          int    `json:"seats"`
	Horsepower     int    `json:"horsepower"`
	RangeKM        int    `json:"range_km"`
	TrunkCapacity  int    `json:"trunk_capacity"`
	Airbags        int    `json:"airbags"`
	VehicleType    string `json:"vehicle_type"`
	Transmission   string `json:"transmission"`
}
