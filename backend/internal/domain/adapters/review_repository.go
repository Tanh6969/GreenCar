package adapters

import "greencar/internal/domain/entities"

// ReviewRepository defines the storage interface for Review.
type ReviewRepository interface {
	GetByID(id int) (*entities.Review, error)
	Create(r *entities.Review) error
	Update(r *entities.Review) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.Review, error)
	GetByVehicleID(vehicleID int, limit, offset int) ([]*entities.Review, error)
}
