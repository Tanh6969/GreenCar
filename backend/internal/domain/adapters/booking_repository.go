package adapters

import "greencar/internal/domain/entities"

// BookingRepository defines the storage interface for Booking.
// Concrete implementations (Postgres, in-memory, ...) should implement this interface.
type BookingRepository interface {
	GetByID(id int) (*entities.Booking, error)
	Create(b *entities.Booking) error
	Update(b *entities.Booking) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.Booking, error)
	// Additional methods can be added: List, Update, Delete...
}
