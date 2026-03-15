package entities

// VehicleFeature represents the vehicle_features table.
type VehicleFeature struct {
	FeatureID   int    `json:"feature_id"`
	FeatureName string `json:"feature_name"`
}
