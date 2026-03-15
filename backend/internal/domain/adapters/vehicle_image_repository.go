package adapters

import "greencar/internal/domain/entities"

// VehicleImageRepository defines the storage interface for VehicleImage.
type VehicleImageRepository interface {
	GetByID(id int) (*entities.VehicleImage, error)
	Create(vi *entities.VehicleImage) error
	Update(vi *entities.VehicleImage) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.VehicleImage, error)
	GetByVehicleID(vehicleID int) ([]*entities.VehicleImage, error)
}
