package repository

import (
	"time"

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
	query := `SELECT vehicle_id, vehicle_model_id, license_plate, status, battery_level, battery_health, location_id, owner_id, available_from, available_to 
		FROM vehicles WHERE vehicle_id = $1`
	err := r.db.QueryRow(query, id).Scan(
		&v.VehicleID, &v.VehicleModelID, &v.LicensePlate, &v.Status,
		&v.BatteryLevel, &v.BatteryHealth, &v.LocationID, &v.OwnerID, &v.AvailableFrom, &v.AvailableTo,
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
	query := `UPDATE vehicles SET vehicle_model_id = $1, license_plate = $2, status = $3, battery_level = $4, battery_health = $5, location_id = $6, available_from = $7, available_to = $8
		WHERE vehicle_id = $9`
	_, err := r.db.Exec(query, v.VehicleModelID, v.LicensePlate, v.Status, v.BatteryLevel, v.BatteryHealth, v.LocationID, v.AvailableFrom, v.AvailableTo, v.VehicleID)
	return err
}

func (r *vehicleRepository) Delete(id int) error {
	query := `DELETE FROM vehicles WHERE vehicle_id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *vehicleRepository) AddImage(modelID int, url string) error {
	_, err := r.db.Exec(
		`INSERT INTO vehicle_images (vehicle_model_id, image_url) VALUES ($1, $2)`,
		modelID, url,
	)
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

func (r *vehicleRepository) ListAvailable(start, end *time.Time, locationID, modelID *int, limit, offset int) ([]*entities.Vehicle, error) {
	query := `SELECT vehicle_id, vehicle_model_id, license_plate, status, battery_level, battery_health, location_id
		FROM vehicles v
		WHERE ($1::timestamptz IS NULL OR NOT EXISTS (
			SELECT 1 FROM bookings b
			WHERE b.vehicle_id = v.vehicle_id
			  AND b.status != 'cancelled'
			  AND b.start_time < $2
			  AND b.end_time > $1
		))
		  AND ($1::timestamptz IS NULL OR NOT EXISTS (
			SELECT 1 FROM vehicle_unavailabilities u
			WHERE u.vehicle_id = v.vehicle_id
			  AND u.start_time < $2
			  AND u.end_time > $1
		))
		  AND ($3 IS NULL OR v.location_id = $3)
		  AND ($4 IS NULL OR v.vehicle_model_id = $4)
		ORDER BY vehicle_id LIMIT $5 OFFSET $6`

	rows, err := r.db.Query(query, start, end, locationID, modelID, limit, offset)
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

func (r *vehicleRepository) AddUnavailability(u *entities.VehicleUnavailability) error {
	query := `INSERT INTO vehicle_unavailabilities (vehicle_id, start_time, end_time, type) 
		VALUES ($1, $2, $3, $4) RETURNING id`
	return r.db.QueryRow(query, u.VehicleID, u.StartTime, u.EndTime, u.Type).Scan(&u.ID)
}

func (r *vehicleRepository) RemoveUnavailability(id int) error {
	query := `DELETE FROM vehicle_unavailabilities WHERE id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *vehicleRepository) ListUnavailabilities(vehicleID int) ([]*entities.VehicleUnavailability, error) {
	query := `SELECT id, vehicle_id, start_time, end_time, type FROM vehicle_unavailabilities WHERE vehicle_id = $1 ORDER BY start_time`
	rows, err := r.db.Query(query, vehicleID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []*entities.VehicleUnavailability
	for rows.Next() {
		var u entities.VehicleUnavailability
		if err := rows.Scan(&u.ID, &u.VehicleID, &u.StartTime, &u.EndTime, &u.Type); err != nil {
			return nil, err
		}
		list = append(list, &u)
	}
	return list, nil
}
