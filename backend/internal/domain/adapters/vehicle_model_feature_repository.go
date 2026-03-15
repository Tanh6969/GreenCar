package adapters

import "greencar/internal/domain/entities"

// VehicleModelFeatureRepository defines the storage interface for VehicleModelFeature.
type VehicleModelFeatureRepository interface {
	GetByID(id int) (*entities.VehicleModelFeature, error)
	Create(vmf *entities.VehicleModelFeature) error
	Update(vmf *entities.VehicleModelFeature) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.VehicleModelFeature, error)
	GetByVehicleModelID(vehicleModelID int) ([]*entities.VehicleModelFeature, error)
}
