package adapters

import "greencar/internal/domain/entities"

// VehicleModelRepository defines the storage interface for VehicleModel.
type VehicleModelRepository interface {
	GetByID(id int) (*entities.VehicleModel, error)
	Create(vm *entities.VehicleModel) error
	Update(vm *entities.VehicleModel) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.VehicleModel, error)
}
