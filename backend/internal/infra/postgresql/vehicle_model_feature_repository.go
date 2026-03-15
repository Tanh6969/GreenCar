package repository

import (
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

// VehicleModelFeatureRepository defines operations on vehicle_model_features (junction table).
type VehicleModelFeatureRepository interface {
	Create(mf *entities.VehicleModelFeature) error
	ListByVehicleModelID(vehicleModelID int) ([]domain.VehicleModelFeature, error)
	ListByFeatureID(featureID int) ([]domain.VehicleModelFeature, error)
	Delete(vehicleModelID, featureID int) error
}

type vehicleModelFeatureRepository struct {
	db *database.DB
}

// NewVehicleModelFeatureRepository creates a new vehicle model feature repository.
func NewVehicleModelFeatureRepository(db *database.DB) VehicleModelFeatureRepository {
	return &vehicleModelFeatureRepository{db: db}
}

func (r *vehicleModelFeatureRepository) Create(mf *entities.VehicleModelFeature) error {
	_, err := r.db.Exec(`INSERT INTO vehicle_model_features (vehicle_model_id, feature_id) VALUES ($1, $2)`, mf.VehicleModelID, mf.FeatureID)
	return err
}

func (r *vehicleModelFeatureRepository) ListByVehicleModelID(vehicleModelID int) ([]domain.VehicleModelFeature, error) {
	rows, err := r.db.Query(`SELECT vehicle_model_id, feature_id FROM vehicle_model_features WHERE vehicle_model_id = $1`, vehicleModelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var list []domain.VehicleModelFeature
	for rows.Next() {
		var mf domain.VehicleModelFeature
		if err := rows.Scan(&mf.VehicleModelID, &mf.FeatureID); err != nil {
			return nil, err
		}
		list = append(list, mf)
	}
	return list, rows.Err()
}

func (r *vehicleModelFeatureRepository) ListByFeatureID(featureID int) ([]domain.VehicleModelFeature, error) {
	rows, err := r.db.Query(`SELECT vehicle_model_id, feature_id FROM vehicle_model_features WHERE feature_id = $1`, featureID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var list []domain.VehicleModelFeature
	for rows.Next() {
		var mf domain.VehicleModelFeature
		if err := rows.Scan(&mf.VehicleModelID, &mf.FeatureID); err != nil {
			return nil, err
		}
		list = append(list, mf)
	}
	return list, rows.Err()
}

func (r *vehicleModelFeatureRepository) Delete(vehicleModelID, featureID int) error {
	_, err := r.db.Exec(`DELETE FROM vehicle_model_features WHERE vehicle_model_id = $1 AND feature_id = $2`, vehicleModelID, featureID)
	return err
}
