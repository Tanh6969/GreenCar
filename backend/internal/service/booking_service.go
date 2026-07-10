package service

import (
	"errors"
	"time"

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

// ListBookingsByUser returns bookings for a specific user.
func (s *BookingService) ListBookingsByUser(userID, limit, offset int) ([]*entities.Booking, error) {
	return s.repo.ListByUser(userID, limit, offset)
}

// ListBookingsByOwner returns bookings for vehicles owned by a specific owner.
func (s *BookingService) ListBookingsByOwner(ownerID, limit, offset int) ([]*entities.Booking, error) {
	return s.repo.ListByOwner(ownerID, limit, offset)
}

// UpdateBooking updates an existing booking.
func (s *BookingService) UpdateBooking(b *entities.Booking) error {
	return s.repo.Update(b)
}

// DeleteBooking deletes a booking by ID.
func (s *BookingService) DeleteBooking(id int) error {
	return s.repo.Delete(id)
}

// SetBookingStatus updates only the status of an existing booking.
func (s *BookingService) SetBookingStatus(id int, status string) error {
	b, err := s.repo.GetByID(id)
	if err != nil {
		return err
	}
	b.Status = status
	return s.repo.Update(b)
}

// CompleteBooking finishes the trip and calculates extra fees
func (s *BookingService) CompleteBooking(id int, actualKM int, extraFee float64, extraFeeDesc string, returnTime time.Time) (*entities.Booking, error) {
	b, err := s.repo.GetByID(id)
	if err != nil {
		return nil, err
	}

	_, overKMPrice, overtimePrice, err := s.repo.GetRentalPlanRates(id)
	if err != nil {
		return nil, err
	}

	b.ActualKM = actualKM
	b.ActualEndTime = &returnTime
	b.ExtraFee = extraFee
	b.ExtraFeeDesc = extraFeeDesc
	
	// Calculate over_km_fee
	if actualKM > b.PlannedKM {
		overKM := actualKM - b.PlannedKM
		b.OverKMFee = float64(overKM) * overKMPrice
	} else {
		b.OverKMFee = 0
	}

	// Calculate overtime_fee
	// Only charge overtime if returnTime is after end_time + 1 hour grace period? Let's just use end_time.
	if b.EndTime != nil && returnTime.After(*b.EndTime) {
		diff := returnTime.Sub(*b.EndTime)
		hoursOver := int(diff.Hours())
		if diff.Minutes() > float64(hoursOver*60) {
			hoursOver += 1 // Round up to next hour
		}
		b.OvertimeFee = float64(hoursOver) * overtimePrice
	} else {
		b.OvertimeFee = 0
	}

	// Calculate total addition to bill:
	// The customer already paid TotalPrice (which was base price - deposit? Or total price including deposit).
	// TotalPrice in DB should be the total the customer agreed to pay initially.
	// Actually we should just update TotalPrice = original TotalPrice + OverKMFee + OvertimeFee + ExtraFee.
	// But it's better to keep original TotalPrice or calculate a new GrandTotal.
	// Let's just add to TotalPrice.
	b.TotalPrice += b.OverKMFee + b.OvertimeFee + b.ExtraFee

	b.Status = "pending_payment"

	err = s.repo.Update(b)
	return b, err
}
