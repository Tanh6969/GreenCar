package entities

// VehicleCard is a lightweight composite view used in list pages and carousels.
type VehicleCard struct {
	Vehicle  *Vehicle
	Model    *VehicleModel
	Location *Location
	ImageURL string
}
