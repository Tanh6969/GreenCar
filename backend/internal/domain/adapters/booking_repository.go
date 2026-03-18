package adapters

import (
	"time"

	"greencar/internal/domain/entities"
)

// BookingRepository defines the storage interface for Booking.
// Concrete implementations (Postgres, in-memory, ...) should implement this interface.
type BookingRepository interface {
	GetByID(id int) (*entities.Booking, error)
	Create(b *entities.Booking) error
	Update(b *entities.Booking) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.Booking, error)
	ListByUser(userID int, limit, offset int) ([]*entities.Booking, error)
	// ExistsOverlapping returns true if there is an existing booking for the same vehicle
	// that overlaps the given time range.
	ExistsOverlapping(vehicleID int, start, end time.Time) (bool, error)
}
