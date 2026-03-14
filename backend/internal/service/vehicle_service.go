package service

import (
	"greencar/internal/domain"
	"greencar/internal/repository"
)

// VehicleService contains business logic for vehicles.
type VehicleService struct {
	repo repository.VehicleRepository
}

// NewVehicleService creates a new vehicle service.
func NewVehicleService(repo repository.VehicleRepository) *VehicleService {
	return &VehicleService{repo: repo}
}

// GetVehicle returns a vehicle by ID.
func (s *VehicleService) GetVehicle(id int) (*domain.Vehicle, error) {
	return s.repo.GetByID(id)
}

// CreateVehicle creates a new vehicle.
func (s *VehicleService) CreateVehicle(v *domain.Vehicle) error {
	return s.repo.Create(v)
}
