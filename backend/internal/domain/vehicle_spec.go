package domain

// VehicleSpec represents the vehicle_specs table.
type VehicleSpec struct {
	SpecID         int    `json:"spec_id"`
	VehicleModelID int    `json:"vehicle_model_id"`
	SpecName       string `json:"spec_name"`
	SpecValue      string `json:"spec_value"`
}
