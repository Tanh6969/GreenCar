package service

import (
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
)

// VehicleService contains business logic for vehicles.
type VehicleService struct {
	repo adapters.VehicleRepository
}

// NewVehicleService creates a new vehicle service.
func NewVehicleService(repo adapters.VehicleRepository) *VehicleService {
	return &VehicleService{repo: repo}
}

// GetVehicle returns a vehicle by ID.
func (s *VehicleService) GetVehicle(id int) (*entities.Vehicle, error) {
	return s.repo.GetByID(id)
}

// CreateVehicle creates a new vehicle.
func (s *VehicleService) CreateVehicle(v *entities.Vehicle) error {
	return s.repo.Create(v)
}

// ListVehicles returns a list of vehicles with pagination.
func (s *VehicleService) ListVehicles(limit, offset int) ([]*entities.Vehicle, error) {
	return s.repo.List(limit, offset)
}

// UpdateVehicle updates an existing vehicle.
func (s *VehicleService) UpdateVehicle(v *entities.Vehicle) error {
	return s.repo.Update(v)
}

// DeleteVehicle deletes a vehicle by ID.
func (s *VehicleService) DeleteVehicle(id int) error {
	return s.repo.Delete(id)
}
