package service

import (
	"greencar/internal/domain"
	"greencar/internal/repository"
)

// UserService contains business logic for users.
type UserService struct {
	repo repository.UserRepository
}

// NewUserService creates a new user service.
func NewUserService(repo repository.UserRepository) *UserService {
	return &UserService{repo: repo}
}

// GetUser returns a user by ID.
func (s *UserService) GetUser(id int) (*domain.User, error) {
	return s.repo.GetByID(id)
}

// CreateUser creates a new user.
func (s *UserService) CreateUser(u *domain.User) error {
	return s.repo.Create(u)
}
