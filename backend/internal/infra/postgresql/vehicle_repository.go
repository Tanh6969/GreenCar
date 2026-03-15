package repository

import (
	"greencar/internal/domain/entities"
	"greencar/internal/domain/adapters"
	"greencar/pkg/database"
)

type vehicleRepository struct {
	db *database.DB
}

// NewVehicleRepository creates a new vehicle repository.
// It returns the domain-layer vehicle repository interface.
func NewVehicleRepository(db *database.DB) adapters.VehicleRepository {
	return &vehicleRepository{db: db}
}

func (r *vehicleRepository) GetByID(id int) (*entities.Vehicle, error) {
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

func (r *vehicleRepository) Create(v *entities.Vehicle) error {
	query := `INSERT INTO vehicles (vehicle_model_id, license_plate, status, battery_level, battery_health, location_id) 
		VALUES ($1, $2, $3, $4, $5, $6) RETURNING vehicle_id`
	return r.db.QueryRow(query, v.VehicleModelID, v.LicensePlate, v.Status, v.BatteryLevel, v.BatteryHealth, v.LocationID).
		Scan(&v.VehicleID)
}
