package repository

import (
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

// VehicleFeatureRepository defines operations on vehicle_features.
type VehicleFeatureRepository interface {
	GetByID(id int) (*entities.VehicleFeature, error)
	Create(f *entities.VehicleFeature) error
}

type vehicleFeatureRepository struct {
	db *database.DB
}

// NewVehicleFeatureRepository creates a new vehicle feature repository.
func NewVehicleFeatureRepository(db *database.DB) VehicleFeatureRepository {
	return &vehicleFeatureRepository{db: db}
}

func (r *vehicleFeatureRepository) GetByID(id int) (*entities.VehicleFeature, error) {
	var f domain.VehicleFeature
	err := r.db.QueryRow(`SELECT feature_id, feature_name FROM vehicle_features WHERE feature_id = $1`, id).
		Scan(&f.FeatureID, &f.FeatureName)
	if err != nil {
		return nil, err
	}
	return &f, nil
}

func (r *vehicleFeatureRepository) Create(f *entities.VehicleFeature) error {
	return r.db.QueryRow(`INSERT INTO vehicle_features (feature_name) VALUES ($1) RETURNING feature_id`, f.FeatureName).
		Scan(&f.FeatureID)
}
