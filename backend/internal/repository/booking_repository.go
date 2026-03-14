package repository

import (
	"greencar/internal/domain"
	"greencar/pkg/database"
)

// BookingRepository defines operations on bookings.
type BookingRepository interface {
	GetByID(id int) (*domain.Booking, error)
	Create(b *domain.Booking) error
}

type bookingRepository struct {
	db *database.DB
}

// NewBookingRepository creates a new booking repository.
func NewBookingRepository(db *database.DB) BookingRepository {
	return &bookingRepository{db: db}
}

func (r *bookingRepository) GetByID(id int) (*domain.Booking, error) {
	var b domain.Booking
	query := `SELECT booking_id, user_id, vehicle_id, rental_plan_id, start_time, end_time,
		actual_start_time, actual_end_time, planned_km, actual_km, deposit_amount, overtime_fee, over_km_fee,
		total_price, status, created_at FROM bookings WHERE booking_id = $1`
	err := r.db.QueryRow(query, id).Scan(
		&b.BookingID, &b.UserID, &b.VehicleID, &b.RentalPlanID,
		&b.StartTime, &b.EndTime, &b.ActualStartTime, &b.ActualEndTime,
		&b.PlannedKM, &b.ActualKM, &b.DepositAmount, &b.OvertimeFee, &b.OverKMFee,
		&b.TotalPrice, &b.Status, &b.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &b, nil
}

func (r *bookingRepository) Create(b *domain.Booking) error {
	query := `INSERT INTO bookings (user_id, vehicle_id, rental_plan_id, start_time, end_time, planned_km, deposit_amount, total_price, status, created_at) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) 
		RETURNING booking_id, created_at`
	return r.db.QueryRow(query,
		b.UserID, b.VehicleID, b.RentalPlanID, b.StartTime, b.EndTime,
		b.PlannedKM, b.DepositAmount, b.TotalPrice, b.Status,
	).Scan(&b.BookingID, &b.CreatedAt)
}
