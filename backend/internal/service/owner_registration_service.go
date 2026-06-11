package service

import (
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
)

type OwnerRegistrationService struct {
	repo adapters.OwnerRegistrationRepository
}

func NewOwnerRegistrationService(repo adapters.OwnerRegistrationRepository) *OwnerRegistrationService {
	return &OwnerRegistrationService{repo: repo}
}

func (s *OwnerRegistrationService) Create(reg *entities.OwnerRegistration) error {
	return s.repo.Create(reg)
}

func (s *OwnerRegistrationService) GetMyRegistrations(userID int) ([]*entities.OwnerRegistration, error) {
	return s.repo.GetByUserID(userID)
}

func (s *OwnerRegistrationService) GetAll() ([]*entities.OwnerRegistration, error) {
	return s.repo.GetAll()
}

func (s *OwnerRegistrationService) UpdateStatus(id int, status, reason string) error {
	return s.repo.UpdateStatus(id, status, reason)
}
