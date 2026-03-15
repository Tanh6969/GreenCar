package repository

import (
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

// VehicleImageRepository defines operations on vehicle_images.
type VehicleImageRepository interface {
	GetByID(id int) (*entities.VehicleImage, error)
	Create(img *entities.VehicleImage) error
}

type vehicleImageRepository struct {
	db *database.DB
}

// NewVehicleImageRepository creates a new vehicle image repository.
func NewVehicleImageRepository(db *database.DB) VehicleImageRepository {
	return &vehicleImageRepository{db: db}
}

func (r *vehicleImageRepository) GetByID(id int) (*entities.VehicleImage, error) {
	var img entities.VehicleImage
	err := r.db.QueryRow(`SELECT image_id, vehicle_model_id, image_url FROM vehicle_images WHERE image_id = $1`, id).
		Scan(&img.ImageID, &img.VehicleModelID, &img.ImageURL)
	if err != nil {
		return nil, err
	}
	return &img, nil
}

func (r *vehicleImageRepository) Create(img *entities.VehicleImage) error {
	return r.db.QueryRow(`INSERT INTO vehicle_images (vehicle_model_id, image_url) VALUES ($1, $2) RETURNING image_id`, img.VehicleModelID, img.ImageURL).
		Scan(&img.ImageID)
}
