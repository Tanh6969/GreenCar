package usecases

import (
	"context"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
)

// BookingUsecase contains business logic related to Booking.
type BookingUsecase struct {
	repo adapters.BookingRepository
}

func NewBookingUsecase(repo adapters.BookingRepository) *BookingUsecase {
	return &BookingUsecase{repo: repo}
}

// GetBookingByID returns a booking by its ID.
func (uc *BookingUsecase) GetBookingByID(ctx context.Context, id int) (*entities.Booking, error) {
	// Future: add authorization, validation, audit logging...
	return uc.repo.GetByID(id)
}

// CreateBooking creates a new booking.
func (uc *BookingUsecase) CreateBooking(ctx context.Context, b *entities.Booking) error {
	// Example: set default status if empty.
	if b.Status == "" {
		b.Status = "pending"
	}
	return uc.repo.Create(b)
}
