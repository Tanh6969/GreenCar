package repository

import (
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

// PaymentRepository defines operations on payments.
type PaymentRepository interface {
	GetByID(id int) (*entities.Payment, error)
	Create(p *entities.Payment) error
}

type paymentRepository struct {
	db *database.DB
}

// NewPaymentRepository creates a new payment repository.
func NewPaymentRepository(db *database.DB) PaymentRepository {
	return &paymentRepository{db: db}
}

func (r *paymentRepository) GetByID(id int) (*entities.Payment, error) {
	var p domain.Payment
	err := r.db.QueryRow(`SELECT payment_id, booking_id, amount, payment_method, payment_status, paid_at FROM payments WHERE payment_id = $1`, id).
		Scan(&p.PaymentID, &p.BookingID, &p.Amount, &p.PaymentMethod, &p.PaymentStatus, &p.PaidAt)
	if err != nil {
		return nil, err
	}
	return &p, nil
}

func (r *paymentRepository) Create(p *entities.Payment) error {
	return r.db.QueryRow(`INSERT INTO payments (booking_id, amount, payment_method, payment_status, paid_at) VALUES ($1, $2, $3, $4, $5) RETURNING payment_id`,
		p.BookingID, p.Amount, p.PaymentMethod, p.PaymentStatus, p.PaidAt).Scan(&p.PaymentID)
}
