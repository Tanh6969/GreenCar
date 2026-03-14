package repository

import (
	"greencar/internal/domain"
	"greencar/pkg/database"
)

// VehicleSpecRepository defines operations on vehicle_specs.
type VehicleSpecRepository interface {
	GetByID(id int) (*domain.VehicleSpec, error)
	Create(s *domain.VehicleSpec) error
}

type vehicleSpecRepository struct {
	db *database.DB
}

// NewVehicleSpecRepository creates a new vehicle spec repository.
func NewVehicleSpecRepository(db *database.DB) VehicleSpecRepository {
	return &vehicleSpecRepository{db: db}
}

func (r *vehicleSpecRepository) GetByID(id int) (*domain.VehicleSpec, error) {
	var s domain.VehicleSpec
	err := r.db.QueryRow(`SELECT spec_id, vehicle_model_id, spec_name, spec_value FROM vehicle_specs WHERE spec_id = $1`, id).
		Scan(&s.SpecID, &s.VehicleModelID, &s.SpecName, &s.SpecValue)
	if err != nil {
		return nil, err
	}
	return &s, nil
}

func (r *vehicleSpecRepository) Create(s *domain.VehicleSpec) error {
	return r.db.QueryRow(`INSERT INTO vehicle_specs (vehicle_model_id, spec_name, spec_value) VALUES ($1, $2, $3) RETURNING spec_id`,
		s.VehicleModelID, s.SpecName, s.SpecValue).Scan(&s.SpecID)
}
