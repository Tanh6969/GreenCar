package repository

import (
	"greencar/internal/domain"
	"greencar/pkg/database"
)

// VehicleModelRepository defines operations on vehicle_models.
type VehicleModelRepository interface {
	GetByID(id int) (*domain.VehicleModel, error)
	Create(m *domain.VehicleModel) error
}

type vehicleModelRepository struct {
	db *database.DB
}

// NewVehicleModelRepository creates a new vehicle model repository.
func NewVehicleModelRepository(db *database.DB) VehicleModelRepository {
	return &vehicleModelRepository{db: db}
}

func (r *vehicleModelRepository) GetByID(id int) (*domain.VehicleModel, error) {
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

func (r *vehicleModelRepository) Create(m *domain.VehicleModel) error {
	query := `INSERT INTO vehicle_models (name, brand, seats, horsepower, range_km, trunk_capacity, airbags, vehicle_type, transmission) 
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING vehicle_model_id`
	return r.db.QueryRow(query, m.Name, m.Brand, m.Seats, m.Horsepower, m.RangeKM, m.TrunkCapacity, m.Airbags, m.VehicleType, m.Transmission).
		Scan(&m.VehicleModelID)
}
