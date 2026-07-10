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
	var overtimeFee, overKMFee, extraFee sql.NullFloat64
	var paymentMethod, extraFeeDesc, ownerNote sql.NullString
	var customerEmail, customerLicenseNo sql.NullString
	var customerTripCount sql.NullInt64
	err := scan(
		&b.BookingID, &b.UserID, &b.VehicleID, &b.RentalPlanID,
		&b.StartTime, &b.EndTime, &actualStart, &actualEnd,
		&b.PlannedKM, &actualKM, &b.DepositAmount, &overtimeFee, &overKMFee,
		&extraFee, &extraFeeDesc,
		&b.TotalPrice, &b.Status, &paymentMethod, &ownerNote, &b.CreatedAt,
		&b.VehicleModelID, &b.VehicleBrand, &b.VehicleName, &b.LicensePlate,
		&b.CustomerName, &b.CustomerPhone, &customerEmail, &customerLicenseNo, &customerTripCount,
		&b.HasReviewed,
	)
	if err != nil {
		return b, err
	}
	if actualStart.Valid       { b.ActualStartTime    = &actualStart.Time }
	if actualEnd.Valid         { b.ActualEndTime      = &actualEnd.Time }
	if actualKM.Valid          { b.ActualKM           = int(actualKM.Int64) }
	if overtimeFee.Valid       { b.OvertimeFee        = overtimeFee.Float64 }
	if overKMFee.Valid         { b.OverKMFee          = overKMFee.Float64 }
	if extraFee.Valid          { b.ExtraFee           = extraFee.Float64 }
	if extraFeeDesc.Valid      { b.ExtraFeeDesc       = extraFeeDesc.String }
	if paymentMethod.Valid     { b.PaymentMethod      = paymentMethod.String }
	if ownerNote.Valid         { b.OwnerNote          = ownerNote.String }
	if customerEmail.Valid     { b.CustomerEmail      = customerEmail.String }
	if customerLicenseNo.Valid { b.CustomerLicenseNo  = customerLicenseNo.String }
	if customerTripCount.Valid { b.CustomerTripCount  = int(customerTripCount.Int64) }
	return b, nil
}

const selectBookingDetail = `
SELECT b.booking_id, b.user_id, b.vehicle_id, b.rental_plan_id,
  b.start_time, b.end_time, b.actual_start_time, b.actual_end_time,
  b.planned_km, b.actual_km, b.deposit_amount, b.overtime_fee, b.over_km_fee,
  b.extra_fee, b.extra_fee_description,
  b.total_price, b.status, b.payment_method, b.owner_note, b.created_at,
  COALESCE(vm.vehicle_model_id, 0) AS vehicle_model_id,
  COALESCE(vm.brand, '') AS vehicle_brand,
  COALESCE(vm.name, '')  AS vehicle_name,
  COALESCE(v.license_plate, '') AS license_plate,
  COALESCE(u.name, '')   AS customer_name,
  COALESCE(u.phone, '')  AS customer_phone,
  COALESCE(u.email, '')  AS customer_email,
  COALESCE(u.license_no, '') AS customer_license_no,
  (SELECT COUNT(*) FROM bookings cb WHERE cb.user_id = b.user_id AND cb.status IN ('completed','pending_payment','paid')) AS customer_trip_count,
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
		overtime_fee=$11, over_km_fee=$12, extra_fee=$13, extra_fee_description=$14, total_price=$15, status=$16, owner_note=$17 WHERE booking_id=$18`
	_, err := r.db.Exec(query,
		b.UserID, b.VehicleID, b.RentalPlanID, b.StartTime, b.EndTime,
		b.ActualStartTime, b.ActualEndTime, b.PlannedKM, b.ActualKM, b.DepositAmount,
		b.OvertimeFee, b.OverKMFee, b.ExtraFee, b.ExtraFeeDesc, b.TotalPrice, b.Status, b.OwnerNote, b.BookingID)
	return err
}

func (r *bookingRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM bookings WHERE booking_id = $1`, id)
	return err
}

func (r *bookingRepository) List(limit, offset int) ([]*entities.Booking, error) {
	// Auto-cancel pending bookings that are past their start time
	_, _ = r.db.Exec(`UPDATE bookings SET status = 'cancelled', owner_note = 'Tự động hủy do quá hạn xác nhận' WHERE status = 'pending' AND start_time < NOW()`)
	// Auto-cancel confirmed bookings that are past their start time (never picked up)
	_, _ = r.db.Exec(`UPDATE bookings SET status = 'cancelled', owner_note = 'Tự động hủy do quá hạn nhận xe' WHERE status = 'confirmed' AND start_time < NOW()`)

	rows, err := r.db.Query(selectBookingDetail+` ORDER BY b.booking_id DESC LIMIT $1 OFFSET $2`, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanBookings(rows)
}

func (r *bookingRepository) ListByUser(userID int, limit, offset int) ([]*entities.Booking, error) {
	// Auto-cancel pending bookings that are past their start time
	_, _ = r.db.Exec(`UPDATE bookings SET status = 'cancelled', owner_note = 'Tự động hủy do quá hạn xác nhận' WHERE status = 'pending' AND start_time < NOW()`)
	// Auto-cancel confirmed bookings that are past their start time (never picked up)
	_, _ = r.db.Exec(`UPDATE bookings SET status = 'cancelled', owner_note = 'Tự động hủy do quá hạn nhận xe' WHERE status = 'confirmed' AND start_time < NOW()`)

	// Filter out bookings where the user booked their own car
	rows, err := r.db.Query(selectBookingDetail+` WHERE b.user_id=$1 AND (v.owner_id != $1 OR v.owner_id IS NULL) ORDER BY b.booking_id DESC LIMIT $2 OFFSET $3`, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	return scanBookings(rows)
}

func (r *bookingRepository) ListByOwner(ownerID int, limit, offset int) ([]*entities.Booking, error) {
	// Auto-cancel pending bookings that are past their start time
	_, _ = r.db.Exec(`UPDATE bookings SET status = 'cancelled', owner_note = 'Tự động hủy do quá hạn xác nhận' WHERE status = 'pending' AND start_time < NOW()`)
	// Auto-cancel confirmed bookings that are past their start time (never picked up)
	_, _ = r.db.Exec(`UPDATE bookings SET status = 'cancelled', owner_note = 'Tự động hủy do quá hạn nhận xe' WHERE status = 'confirmed' AND start_time < NOW()`)

	rows, err := r.db.Query(selectBookingDetail+` WHERE v.owner_id=$1 ORDER BY b.booking_id DESC LIMIT $2 OFFSET $3`, ownerID, limit, offset)
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
		WHERE vehicle_id = $1 AND status != 'cancelled'
		AND NOT (end_time <= $2 OR start_time >= $3)
	) OR EXISTS (
		SELECT 1 FROM vehicle_unavailabilities
		WHERE vehicle_id = $1
		AND NOT (end_time <= $2 OR start_time >= $3)
	)`
	var exists bool
	err := r.db.QueryRow(query, vehicleID, start, end).Scan(&exists)
	return exists, err
}

func (r *bookingRepository) GetRentalPlanRates(bookingID int) (maxKM int, overKMPrice float64, overtimePrice float64, err error) {
	query := `SELECT p.max_km, p.over_km_price, p.overtime_price 
		FROM bookings b 
		JOIN rental_plans p ON b.rental_plan_id = p.rental_plan_id 
		WHERE b.booking_id = $1`
	err = r.db.QueryRow(query, bookingID).Scan(&maxKM, &overKMPrice, &overtimePrice)
	return
}
