package adapters

import "greencar/internal/domain/entities"

// VehicleRepository defines the storage interface for Vehicle.
// Concrete implementations (Postgres, in-memory, ...) should implement this interface.
type VehicleRepository interface {
	GetByID(id int) (*entities.Vehicle, error)
	Create(v *entities.Vehicle) error
	Update(v *entities.Vehicle) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.Vehicle, error)
	ListByLocation(locationID int, limit, offset int) ([]*entities.Vehicle, error)
}
