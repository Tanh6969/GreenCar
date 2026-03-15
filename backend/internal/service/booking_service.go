package service

import (
	"errors"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
)

var (
	// ErrBookingOverlaps indicates a requested booking overlaps another booking for the same vehicle.
	ErrBookingOverlaps = errors.New("booking overlaps existing booking")
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
// It checks for overlapping bookings for the same vehicle.
func (s *BookingService) CreateBooking(b *entities.Booking) error {
	if b == nil || b.StartTime == nil || b.EndTime == nil {
		return nil
	}

	hasOverlap, err := s.repo.ExistsOverlapping(b.VehicleID, *b.StartTime, *b.EndTime)
	if err != nil {
		return err
	}
	if hasOverlap {
		return ErrBookingOverlaps
	}

	return s.repo.Create(b)
}

// ListBookings returns a list of bookings with pagination.
func (s *BookingService) ListBookings(limit, offset int) ([]*entities.Booking, error) {
	return s.repo.List(limit, offset)
}

// UpdateBooking updates an existing booking.
func (s *BookingService) UpdateBooking(b *entities.Booking) error {
	return s.repo.Update(b)
}

// DeleteBooking deletes a booking by ID.
func (s *BookingService) DeleteBooking(id int) error {
	return s.repo.Delete(id)
}
