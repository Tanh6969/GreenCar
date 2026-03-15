package repository

import (
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
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
	var v entities.Vehicle
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

func (r *vehicleRepository) Update(v *entities.Vehicle) error {
	query := `UPDATE vehicles SET vehicle_model_id = $1, license_plate = $2, status = $3, battery_level = $4, battery_health = $5, location_id = $6 
		WHERE vehicle_id = $7`
	_, err := r.db.Exec(query, v.VehicleModelID, v.LicensePlate, v.Status, v.BatteryLevel, v.BatteryHealth, v.LocationID, v.VehicleID)
	return err
}

func (r *vehicleRepository) Delete(id int) error {
	query := `DELETE FROM vehicles WHERE vehicle_id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *vehicleRepository) List(limit, offset int) ([]*entities.Vehicle, error) {
	query := `SELECT vehicle_id, vehicle_model_id, license_plate, status, battery_level, battery_health, location_id 
		FROM vehicles ORDER BY vehicle_id LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var vehicles []*entities.Vehicle
	for rows.Next() {
		var v entities.Vehicle
		err := rows.Scan(&v.VehicleID, &v.VehicleModelID, &v.LicensePlate, &v.Status, &v.BatteryLevel, &v.BatteryHealth, &v.LocationID)
		if err != nil {
			return nil, err
		}
		vehicles = append(vehicles, &v)
	}
	return vehicles, nil
}

func (r *vehicleRepository) ListByLocation(locationID int, limit, offset int) ([]*entities.Vehicle, error) {
	query := `SELECT vehicle_id, vehicle_model_id, license_plate, status, battery_level, battery_health, location_id 
		FROM vehicles WHERE location_id = $1 ORDER BY vehicle_id LIMIT $2 OFFSET $3`
	rows, err := r.db.Query(query, locationID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var vehicles []*entities.Vehicle
	for rows.Next() {
		var v entities.Vehicle
		err := rows.Scan(&v.VehicleID, &v.VehicleModelID, &v.LicensePlate, &v.Status, &v.BatteryLevel, &v.BatteryHealth, &v.LocationID)
		if err != nil {
			return nil, err
		}
		vehicles = append(vehicles, &v)
	}
	return vehicles, nil
}
