package adapters

import (
	"time"

	"greencar/internal/domain/entities"
)

// VehicleRepository defines the storage interface for Vehicle.
// Concrete implementations (Postgres, in-memory, ...) should implement this interface.
type VehicleRepository interface {
	GetByID(id int) (*entities.Vehicle, error)
	Create(v *entities.Vehicle) error
	Update(v *entities.Vehicle) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.Vehicle, error)
	ListByLocation(locationID int, limit, offset int) ([]*entities.Vehicle, error)

	// ListAvailable returns vehicles that are not booked in the given time window.
	// If start or end is nil, no availability filtering is applied.
	// locationID/modelID are optional filters (nil => ignore).
	ListAvailable(start, end *time.Time, locationID, modelID *int, limit, offset int) ([]*entities.Vehicle, error)
}
