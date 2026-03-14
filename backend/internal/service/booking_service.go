package service

import (
	"greencar/internal/domain"
	"greencar/internal/repository"
)

// BookingService contains business logic for bookings.
type BookingService struct {
	repo repository.BookingRepository
}

// NewBookingService creates a new booking service.
func NewBookingService(repo repository.BookingRepository) *BookingService {
	return &BookingService{repo: repo}
}

// GetBooking returns a booking by ID.
func (s *BookingService) GetBooking(id int) (*domain.Booking, error) {
	return s.repo.GetByID(id)
}

// CreateBooking creates a new booking.
func (s *BookingService) CreateBooking(b *domain.Booking) error {
	return s.repo.Create(b)
}
