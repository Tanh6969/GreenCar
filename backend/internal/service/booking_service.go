package service

import (
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
)

// BookingService contains business logic for bookings.
type BookingService struct {
	repo adapters.BookingRepository
}

// NewBookingService creates a new booking service.
func NewBookingService(repo adapters.BookingRepository) *BookingService {
	return &BookingService{repo: repo}
}

// GetBooking returns a booking by ID.
func (s *BookingService) GetBooking(id int) (*entities.Booking, error) {
	return s.repo.GetByID(id)
}

// CreateBooking creates a new booking.
func (s *BookingService) CreateBooking(b *entities.Booking) error {
	return s.repo.Create(b)
}
