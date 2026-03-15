package adapters

import "greencar/internal/domain/entities"

// PaymentRepository defines the storage interface for Payment.
type PaymentRepository interface {
	GetByID(id int) (*entities.Payment, error)
	Create(p *entities.Payment) error
	Update(p *entities.Payment) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.Payment, error)
	GetByBookingID(bookingID int) ([]*entities.Payment, error)
}
