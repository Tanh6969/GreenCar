package adapters

import "greencar/internal/domain/entities"

// LocationRepository defines the storage interface for Location.
type LocationRepository interface {
	GetByID(id int) (*entities.Location, error)
	Create(l *entities.Location) error
	Update(l *entities.Location) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.Location, error)
}
