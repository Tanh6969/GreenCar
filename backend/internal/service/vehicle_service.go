package service

import (
	"time"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
)

// VehicleService contains business logic for vehicles.
type VehicleService struct {
	repo       adapters.VehicleRepository
	detailRepo adapters.VehicleDetailRepository
}

// NewVehicleService creates a new vehicle service.
func NewVehicleService(repo adapters.VehicleRepository, detailRepo adapters.VehicleDetailRepository) *VehicleService {
	return &VehicleService{repo: repo, detailRepo: detailRepo}
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
func (s *VehicleService) ListVehicles(limit, offset int) ([]*entities.Vehicle, int, error) {
	return s.repo.List(limit, offset)
}

// ListAvailableVehicles returns vehicles that are free in the given time window.
// If start or end is nil, no availability filtering is applied.
func (s *VehicleService) ListAvailableVehicles(start, end *time.Time, locationID, modelID *int, limit, offset int) ([]*entities.Vehicle, error) {
	return s.repo.ListAvailable(start, end, locationID, modelID, limit, offset)
}

// UpdateVehicle updates an existing vehicle.
func (s *VehicleService) UpdateVehicle(v *entities.Vehicle) error {
	return s.repo.Update(v)
}

// DeleteVehicle deletes a vehicle by ID (archives it with a reason).
func (s *VehicleService) DeleteVehicle(id int, reason string) error {
	return s.repo.Delete(id, reason)
}

// AddVehicleImage adds an image URL for the given vehicle model.
func (s *VehicleService) AddVehicleImage(modelID int, url string) error {
	return s.repo.AddImage(modelID, url)
}

// GetVehicleDetail returns enriched vehicle detail including model, pricing, reviews, and location.
func (s *VehicleService) GetVehicleDetail(id int) (*entities.VehicleDetail, error) {
	return s.detailRepo.GetByVehicleID(id)
}

// ListVehicleCards returns lightweight vehicle cards with model and location joined.
func (s *VehicleService) ListVehicleCards(limit, offset int) ([]*entities.VehicleCard, error) {
	return s.detailRepo.ListCards(limit, offset)
}

// ListVehicleCardsByOwnerID returns lightweight vehicle cards for a specific owner.
func (s *VehicleService) ListVehicleCardsByOwnerID(ownerID int) ([]*entities.VehicleCard, error) {
	return s.detailRepo.ListByOwnerID(ownerID)
}

func (s *VehicleService) AddVehicleUnavailability(u *entities.VehicleUnavailability) error {
	return s.repo.AddUnavailability(u)
}

func (s *VehicleService) RemoveVehicleUnavailability(id int) error {
	return s.repo.RemoveUnavailability(id)
}

func (s *VehicleService) ListVehicleUnavailabilities(vehicleID int) ([]*entities.VehicleUnavailability, error) {
	return s.repo.ListUnavailabilities(vehicleID)
}
