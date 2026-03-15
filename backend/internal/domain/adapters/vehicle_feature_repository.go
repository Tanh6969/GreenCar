package adapters

import "greencar/internal/domain/entities"

// VehicleFeatureRepository defines the storage interface for VehicleFeature.
type VehicleFeatureRepository interface {
	GetByID(id int) (*entities.VehicleFeature, error)
	Create(vf *entities.VehicleFeature) error
	Update(vf *entities.VehicleFeature) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.VehicleFeature, error)
}
