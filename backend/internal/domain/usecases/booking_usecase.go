package usecases

import (
	"context"
	"errors"

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
	// Validation
	if b == nil {
		return errors.New("booking is required")
	}
	if b.UserID == 0 {
		return errors.New("user_id is required")
	}
	if b.VehicleID == 0 {
		return errors.New("vehicle_id is required")
	}
	if b.StartTime == nil || b.EndTime == nil {
		return errors.New("start_time and end_time are required")
	}
	if !b.StartTime.Before(*b.EndTime) {
		return errors.New("start_time must be before end_time")
	}

	// Prevent overlapping bookings for the same vehicle
	overlap, err := uc.repo.ExistsOverlapping(b.VehicleID, *b.StartTime, *b.EndTime)
	if err != nil {
		return err
	}
	if overlap {
		return errors.New("vehicle is already booked for the requested time range")
	}

	// Default values
	if b.Status == "" {
		b.Status = "pending"
	}

	// TODO: calculate total price based on rental plan and pricing rules.
	// For now, expect caller to provide a valid TotalPrice.

	return uc.repo.Create(b)
}
