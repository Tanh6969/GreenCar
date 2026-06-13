package repository

import (
	"database/sql"
	"time"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

type bookingRepository struct {
	db *database.DB
}

// NewBookingRepository creates a new booking repository.
func NewBookingRepository(db *database.DB) adapters.BookingRepository {
	return &bookingRepository{db: db}
}

// scanBookingDetail scans a row from the detail query (with JOINed vehicle/user fields).
func scanBookingDetail(scan func(...any) error) (entities.Booking, error) {
	var b entities.Booking
	var actualStart, actualEnd sql.NullTime
	var actualKM               sql.NullInt64
	var overtimeFee, overKMFee sql.NullFloat64
	var paymentMethod          sql.NullString
	err := scan(
		&b.BookingID, &b.UserID, &b.VehicleID, &b.RentalPlanID,
		&b.StartTime, &b.EndTime, &actualStart, &actualEnd,
		&b.PlannedKM, &actualKM, &b.DepositAmount, &overtimeFee, &overKMFee,
		&b.TotalPrice, &b.Status, &paymentMethod, &b.CreatedAt,
		&b.VehicleModelID, &b.VehicleBrand, &b.VehicleName, &b.LicensePlate,
		&b.CustomerName, &b.CustomerPhone, &b.HasReviewed,
	)
	if err != nil {
		return b, err
	}
	if actualStart.Valid   { b.ActualStartTime = &actualStart.Time }
	if actualEnd.Valid     { b.ActualEndTime   = &actualEnd.Time }
	if actualKM.Valid      { b.ActualKM        = int(actualKM.Int64) }
	if overtimeFee.Valid   { b.OvertimeFee     = overtimeFee.Float64 }
	if overKMFee.Valid     { b.OverKMFee       = overKMFee.Float64 }
	if paymentMethod.Valid { b.PaymentMethod   = paymentMethod.String }
	return b, nil
}

const selectBookingDetail = `
SELECT b.booking_id, b.user_id, b.vehicle_id, b.rental_plan_id,
  b.start_time, b.end_time, b.actual_start_time, b.actual_end_time,
  b.planned_km, b.actual_km, b.deposit_amount, b.overtime_fee, b.over_km_fee,
  b.total_price, b.status, b.payment_method, b.created_at,
  COALESCE(vm.vehicle_model_id, 0) AS vehicle_model_id,
  COALESCE(vm.brand, '') AS vehicle_brand,
  COALESCE(vm.name, '')  AS vehicle_name,
  COALESCE(v.license_plate, '') AS license_plate,
  COALESCE(u.name, '')   AS customer_name,
  COALESCE(u.phone, '')  AS customer_phone,
  EXISTS(SELECT 1 FROM reviews r WHERE r.booking_id = b.booking_id) AS has_reviewed
FROM bookings b
LEFT JOIN vehicles v       ON v.vehicle_id        = b.vehicle_id
LEFT JOIN vehicle_models vm ON vm.vehicle_model_id = v.vehicle_model_id
LEFT JOIN users u           ON u.user_id           = b.user_id`

func (r *bookingRepository) GetByID(id int) (*entities.Booking, error) {
	row := r.db.QueryRow(selectBookingDetail+` WHERE b.booking_id = $1`, id)
	b, err := scanBookingDetail(row.Scan)
	if err != nil {
		return nil, err
	}
	return &b, nil
}

func (r *bookingRepository) Create(b *entities.Booking) error {
	query := `INSERT INTO bookings (user_id, vehicle_id, rental_plan_id, start_time, end_time, planned_km, deposit_amount, total_price, status, payment_method, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())
		RETURNING booking_id, created_at`
	return r.db.QueryRow(query,
		b.UserID, b.VehicleID, b.RentalPlanID, b.StartTime, b.EndTime,
		b.PlannedKM, b.DepositAmount, b.TotalPrice, b.Status, b.PaymentMethod,
	).Scan(&b.BookingID, &b.CreatedAt)
}

func (r *bookingRepository) Update(b *entities.Booking) error {
	query := `UPDATE bookings SET user_id=$1, vehicle_id=$2, rental_plan_id=$3, start_time=$4, end_time=$5,
		actual_start_time=$6, actual_end_time=$7, planned_km=$8, actual_km=$9, deposit_amount=$10,
		overtime_fee=$11, over_km_fee=$12, total_price=$13, status=$14 WHERE booking_id=$15`
	_, err := r.db.Exec(query,
		b.UserID, b.VehicleID, b.RentalPlanID, b.StartTime, b.EndTime,
		b.ActualStartTime, b.ActualEndTime, b.PlannedKM, b.ActualKM, b.DepositAmount,
		b.OvertimeFee, b.OverKMFee, b.TotalPrice, b.Status, b.BookingID)
	return err
}

func (r *bookingRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM bookings WHERE booking_id = $1`, id)
	return err
}

func (r *bookingRepository) List(limit, offset int) ([]*entities.Booking, error) {
	rows, err := r.db.Query(selectBookingDetail+` ORDER BY b.booking_id DESC LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanBookings(rows)
}

func (r *bookingRepository) ListByUser(userID int, limit, offset int) ([]*entities.Booking, error) {
	rows, err := r.db.Query(selectBookingDetail+` WHERE b.user_id=$1 ORDER BY b.booking_id DESC LIMIT $2 OFFSET $3`, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanBookings(rows)
}

func scanBookings(rows *sql.Rows) ([]*entities.Booking, error) {
	var bookings []*entities.Booking
	for rows.Next() {
		b, err := scanBookingDetail(rows.Scan)
		if err != nil {
			return nil, err
		}
		bookings = append(bookings, &b)
	}
	return bookings, nil
}

func (r *bookingRepository) ExistsOverlapping(vehicleID int, start, end time.Time) (bool, error) {
	query := `SELECT EXISTS(
		SELECT 1 FROM bookings
		WHERE vehicle_id = $1
		AND NOT (end_time <= $2 OR start_time >= $3)
	)`
	var exists bool
	err := r.db.QueryRow(query, vehicleID, start, end).Scan(&exists)
	return exists, err
}
