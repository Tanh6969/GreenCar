package repository

import (
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

// VehicleModelRepository defines operations on vehicle_models.
type VehicleModelRepository interface {
	GetByID(id int) (*entities.VehicleModel, error)
	Create(m *entities.VehicleModel) error
}

type vehicleModelRepository struct {
	db *database.DB
}

// NewVehicleModelRepository creates a new vehicle model repository.
func NewVehicleModelRepository(db *database.DB) VehicleModelRepository {
	return &vehicleModelRepository{db: db}
}

func (r *vehicleModelRepository) GetByID(id int) (*entities.VehicleModel, error) {
	var m domain.VehicleModel
	query := `SELECT vehicle_model_id, name, brand, seats, horsepower, range_km, trunk_capacity, airbags, vehicle_type, transmission 
		FROM vehicle_models WHERE vehicle_model_id = $1`
	err := r.db.QueryRow(query, id).Scan(
		&m.VehicleModelID, &m.Name, &m.Brand, &m.Seats, &m.Horsepower, &m.RangeKM,
		&m.TrunkCapacity, &m.Airbags, &m.VehicleType, &m.Transmission,
	)
	if err != nil {
		return nil, err
	}
	return &m, nil
}

func (r *vehicleModelRepository) Create(m *entities.VehicleModel) error {
	query := `INSERT INTO vehicle_models (name, brand, seats, horsepower, range_km, trunk_capacity, airbags, vehicle_type, transmission) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING vehicle_model_id`
	return r.db.QueryRow(query, m.Name, m.Brand, m.Seats, m.Horsepower, m.RangeKM, m.TrunkCapacity, m.Airbags, m.VehicleType, m.Transmission).
		Scan(&m.VehicleModelID)
}
