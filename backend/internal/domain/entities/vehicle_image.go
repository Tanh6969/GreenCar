package entities

// VehicleImage represents the vehicle_images table.
type VehicleImage struct {
	ImageID        int    `json:"image_id"`
	VehicleModelID int    `json:"vehicle_model_id"`
	ImageURL       string `json:"image_url"`
}
