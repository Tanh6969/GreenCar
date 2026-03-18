package repository

import (
	"time"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

type bookingRepository struct {
	db *database.DB
}

// NewBookingRepository creates a new booking repository.
// It returns the domain-layer booking repository interface.
func NewBookingRepository(db *database.DB) adapters.BookingRepository {
	return &bookingRepository{db: db}
}

func (r *bookingRepository) GetByID(id int) (*entities.Booking, error) {
	var b entities.Booking
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

func (r *bookingRepository) Create(b *entities.Booking) error {
	query := `INSERT INTO bookings (user_id, vehicle_id, rental_plan_id, start_time, end_time, planned_km, deposit_amount, total_price, status, created_at) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW()) 
		RETURNING booking_id, created_at`
	return r.db.QueryRow(query,
		b.UserID, b.VehicleID, b.RentalPlanID, b.StartTime, b.EndTime,
		b.PlannedKM, b.DepositAmount, b.TotalPrice, b.Status,
	).Scan(&b.BookingID, &b.CreatedAt)
}

func (r *bookingRepository) Update(b *entities.Booking) error {
	query := `UPDATE bookings SET user_id = $1, vehicle_id = $2, rental_plan_id = $3, start_time = $4, end_time = $5,
		actual_start_time = $6, actual_end_time = $7, planned_km = $8, actual_km = $9, deposit_amount = $10,
		overtime_fee = $11, over_km_fee = $12, total_price = $13, status = $14 WHERE booking_id = $15`
	_, err := r.db.Exec(query, b.UserID, b.VehicleID, b.RentalPlanID, b.StartTime, b.EndTime,
		b.ActualStartTime, b.ActualEndTime, b.PlannedKM, b.ActualKM, b.DepositAmount,
		b.OvertimeFee, b.OverKMFee, b.TotalPrice, b.Status, b.BookingID)
	return err
}

func (r *bookingRepository) Delete(id int) error {
	query := `DELETE FROM bookings WHERE booking_id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *bookingRepository) List(limit, offset int) ([]*entities.Booking, error) {
	query := `SELECT booking_id, user_id, vehicle_id, rental_plan_id, start_time, end_time,
		actual_start_time, actual_end_time, planned_km, actual_km, deposit_amount, overtime_fee, over_km_fee,
		total_price, status, created_at FROM bookings ORDER BY booking_id LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []*entities.Booking
	for rows.Next() {
		var b entities.Booking
		err := rows.Scan(&b.BookingID, &b.UserID, &b.VehicleID, &b.RentalPlanID,
			&b.StartTime, &b.EndTime, &b.ActualStartTime, &b.ActualEndTime,
			&b.PlannedKM, &b.ActualKM, &b.DepositAmount, &b.OvertimeFee, &b.OverKMFee,
			&b.TotalPrice, &b.Status, &b.CreatedAt)
		if err != nil {
			return nil, err
		}
		bookings = append(bookings, &b)
	}
	return bookings, nil
}

func (r *bookingRepository) ListByUser(userID int, limit, offset int) ([]*entities.Booking, error) {
	query := `SELECT booking_id, user_id, vehicle_id, rental_plan_id, start_time, end_time,
		actual_start_time, actual_end_time, planned_km, actual_km, deposit_amount, overtime_fee, over_km_fee,
		total_price, status, created_at FROM bookings WHERE user_id = $1 ORDER BY booking_id LIMIT $2 OFFSET $3`
	rows, err := r.db.Query(query, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var bookings []*entities.Booking
	for rows.Next() {
		var b entities.Booking
		err := rows.Scan(&b.BookingID, &b.UserID, &b.VehicleID, &b.RentalPlanID,
			&b.StartTime, &b.EndTime, &b.ActualStartTime, &b.ActualEndTime,
			&b.PlannedKM, &b.ActualKM, &b.DepositAmount, &b.OvertimeFee, &b.OverKMFee,
			&b.TotalPrice, &b.Status, &b.CreatedAt)
		if err != nil {
			return nil, err
		}
		bookings = append(bookings, &b)
	}
	return bookings, nil
}

func (r *bookingRepository) ExistsOverlapping(vehicleID int, start, end time.Time) (bool, error) {
	// Overlap logic: startA < endB && endA > startB
	query := `SELECT EXISTS(
		SELECT 1 FROM bookings
		WHERE vehicle_id = $1
		AND NOT (end_time <= $2 OR start_time >= $3)
	)`
	var exists bool
	err := r.db.QueryRow(query, vehicleID, start, end).Scan(&exists)
	return exists, err
}
