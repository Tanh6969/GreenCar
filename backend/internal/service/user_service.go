package service

import (
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
)

// UserService contains business logic for users.
type UserService struct {
	repo adapters.UserRepository
}

// NewUserService creates a new user service.
func NewUserService(repo adapters.UserRepository) *UserService {
	return &UserService{repo: repo}
}

// GetUser returns a user by ID.
func (s *UserService) GetUser(id int) (*entities.User, error) {
	return s.repo.GetByID(id)
}

// CreateUser creates a new user.
func (s *UserService) CreateUser(u *entities.User) error {
	return s.repo.Create(u)
}
