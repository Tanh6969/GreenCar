package repository

import (
	"encoding/json"
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

type ownerRegistrationRepository struct {
	db *database.DB
}

func NewOwnerRegistrationRepository(db *database.DB) adapters.OwnerRegistrationRepository {
	return &ownerRegistrationRepository{db: db}
}

func (r *ownerRegistrationRepository) Create(reg *entities.OwnerRegistration) error {
	imagesJSON, _ := json.Marshal(reg.Images)
	query := `INSERT INTO owner_registrations 
		(user_id, brand, model, year, license_plate, color, seats, transmission, fuel_type, city, address, price_per_day, description, images, status)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15) RETURNING id, created_at`
	return r.db.QueryRow(query,
		reg.UserID, reg.Brand, reg.Model, reg.Year, reg.LicensePlate,
		reg.Color, reg.Seats, reg.Transmission, reg.FuelType, reg.City,
		reg.Address, reg.PricePerDay, reg.Description, string(imagesJSON), "pending",
	).Scan(&reg.ID, &reg.CreatedAt)
}

func (r *ownerRegistrationRepository) GetByUserID(userID int) ([]*entities.OwnerRegistration, error) {
	query := `SELECT id, user_id, brand, model, year, license_plate, color, seats, transmission, fuel_type, city, address, price_per_day, description, images, status, reject_reason, created_at
		FROM owner_registrations WHERE user_id = $1 ORDER BY created_at DESC`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var regs []*entities.OwnerRegistration
	for rows.Next() {
		var reg entities.OwnerRegistration
		var imagesJSON string
		var rejectReason *string
		err := rows.Scan(
			&reg.ID, &reg.UserID, &reg.Brand, &reg.Model, &reg.Year, &reg.LicensePlate,
			&reg.Color, &reg.Seats, &reg.Transmission, &reg.FuelType, &reg.City,
			&reg.Address, &reg.PricePerDay, &reg.Description, &imagesJSON, &reg.Status, &rejectReason, &reg.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		json.Unmarshal([]byte(imagesJSON), &reg.Images)
		if rejectReason != nil {
			reg.RejectReason = *rejectReason
		}
		regs = append(regs, &reg)
	}
	return regs, nil
}

func (r *ownerRegistrationRepository) GetAll() ([]*entities.OwnerRegistration, error) {
	query := `SELECT o.id, o.user_id, o.brand, o.model, o.year, o.license_plate, o.color, o.seats, o.transmission, o.fuel_type, o.city, o.address, o.price_per_day, o.description, o.images, o.status, o.reject_reason, o.created_at, u.name, u.phone
		FROM owner_registrations o JOIN users u ON o.user_id = u.user_id ORDER BY o.created_at DESC`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var regs []*entities.OwnerRegistration
	for rows.Next() {
		var reg entities.OwnerRegistration
		var imagesJSON string
		var rejectReason *string
		err := rows.Scan(
			&reg.ID, &reg.UserID, &reg.Brand, &reg.Model, &reg.Year, &reg.LicensePlate,
			&reg.Color, &reg.Seats, &reg.Transmission, &reg.FuelType, &reg.City,
			&reg.Address, &reg.PricePerDay, &reg.Description, &imagesJSON, &reg.Status, &rejectReason, &reg.CreatedAt,
			&reg.OwnerName, &reg.OwnerPhone,
		)
		if err != nil {
			return nil, err
		}
		json.Unmarshal([]byte(imagesJSON), &reg.Images)
		if rejectReason != nil {
			reg.RejectReason = *rejectReason
		}
		regs = append(regs, &reg)
	}
	return regs, nil
}

func (r *ownerRegistrationRepository) UpdateStatus(id int, status, reason string) error {
	query := `UPDATE owner_registrations SET status = $1, reject_reason = $2 WHERE id = $3`
	_, err := r.db.Exec(query, status, reason, id)
	return err
}
