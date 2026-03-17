package adapters

import "greencar/internal/domain/entities"

// VehicleDetailRepository provides access to vehicle detail data.
// This is used to build the full detail page response for a vehicle.
type VehicleDetailRepository interface {
	GetByVehicleID(id int) (*entities.VehicleDetail, error)
}
