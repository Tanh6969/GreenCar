package entities

// VehicleModelFeature represents the vehicle_model_features table (junction).
type VehicleModelFeature struct {
	VehicleModelID int `json:"vehicle_model_id"`
	FeatureID      int `json:"feature_id"`
}
