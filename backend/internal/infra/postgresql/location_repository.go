package repository

import (
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

// LocationRepository defines operations on locations.
type LocationRepository interface {
	GetByID(id int) (*entities.Location, error)
	Create(l *entities.Location) error
}

type locationRepository struct {
	db *database.DB
}

// NewLocationRepository creates a new location repository.
func NewLocationRepository(db *database.DB) LocationRepository {
	return &locationRepository{db: db}
}

func (r *locationRepository) GetByID(id int) (*entities.Location, error) {
	var l entities.Location
	err := r.db.QueryRow(`SELECT location_id, name, address, city, latitude, longitude FROM locations WHERE location_id = $1`, id).
		Scan(&l.LocationID, &l.Name, &l.Address, &l.City, &l.Latitude, &l.Longitude)
	if err != nil {
		return nil, err
	}
	return &l, nil
}

func (r *locationRepository) Create(l *entities.Location) error {
	return r.db.QueryRow(`INSERT INTO locations (name, address, city, latitude, longitude) VALUES ($1, $2, $3, $4, $5) RETURNING location_id`,
		l.Name, l.Address, l.City, l.Latitude, l.Longitude).Scan(&l.LocationID)
}
