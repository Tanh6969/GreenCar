package repository

import (
	"greencar/internal/domain"
	"greencar/pkg/database"
)

// VehicleRepository defines operations on vehicles.
type VehicleRepository interface {
	GetByID(id int) (*domain.Vehicle, error)
	Create(v *domain.Vehicle) error
}

type vehicleRepository struct {
	db *database.DB
}

// NewVehicleRepository creates a new vehicle repository.
func NewVehicleRepository(db *database.DB) VehicleRepository {
	return &vehicleRepository{db: db}
}

func (r *vehicleRepository) GetByID(id int) (*domain.Vehicle, error) {
	var v domain.Vehicle
	query := `SELECT vehicle_id, vehicle_model_id, license_plate, status, battery_level, battery_health, location_id 
		FROM vehicles WHERE vehicle_id = $1`
	err := r.db.QueryRow(query, id).Scan(
		&v.VehicleID, &v.VehicleModelID, &v.LicensePlate, &v.Status,
		&v.BatteryLevel, &v.BatteryHealth, &v.LocationID,
	)
	if err != nil {
		return nil, err
	}
	return &v, nil
}

func (r *vehicleRepository) Create(v *domain.Vehicle) error {
	query := `INSERT INTO vehicles (vehicle_model_id, license_plate, status, battery_level, battery_health, location_id) 
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING vehicle_id`
	return r.db.QueryRow(query, v.VehicleModelID, v.LicensePlate, v.Status, v.BatteryLevel, v.BatteryHealth, v.LocationID).
		Scan(&v.VehicleID)
}
