package adapters

import "greencar/internal/domain/entities"

// VehicleSpecRepository defines the storage interface for VehicleSpec.
type VehicleSpecRepository interface {
	GetByID(id int) (*entities.VehicleSpec, error)
	Create(vs *entities.VehicleSpec) error
	Update(vs *entities.VehicleSpec) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.VehicleSpec, error)
}
