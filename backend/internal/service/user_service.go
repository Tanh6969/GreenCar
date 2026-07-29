package service

import (
	"golang.org/x/crypto/bcrypt"

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
	if u == nil {
		return nil
	}
	if u.Password != "" {
		hashed, err := bcrypt.GenerateFromPassword([]byte(u.Password), bcrypt.DefaultCost)
		if err != nil {
			return err
		}
		u.Password = string(hashed)
	}
	return s.repo.Create(u)
}

// ListUsers returns a list of users with pagination.
func (s *UserService) ListUsers(limit, offset int) ([]*entities.User, int, error) {
	return s.repo.List(limit, offset)
}

// UpdateUser updates an existing user.
func (s *UserService) UpdateUser(u *entities.User) error {
	return s.repo.Update(u)
}

// DeleteUser deletes a user by ID.
func (s *UserService) DeleteUser(id int) error {
	return s.repo.Delete(id)
}

// SubmitLicense updates user's driving license information and sets status to verified directly.
func (s *UserService) SubmitLicense(userID int, licenseNo, frontURL, backURL string) error {
	u, err := s.repo.GetByID(userID)
	if err != nil {
		return err
	}
	u.LicenseNo = licenseNo
	u.LicenseFrontURL = frontURL
	u.LicenseBackURL = backURL
	u.LicenseStatus = "pending"
	u.LicenseRejectReason = ""
	return s.repo.Update(u)
}

// AdminVerifyLicense updates a user's driving license status and reject reason.
func (s *UserService) AdminVerifyLicense(userID int, status string, rejectReason string) error {
	u, err := s.repo.GetByID(userID)
	if err != nil {
		return err
	}
	u.LicenseStatus = status
	if status == "rejected" {
		u.LicenseRejectReason = rejectReason
	} else {
		u.LicenseRejectReason = ""
	}
	return s.repo.Update(u)
}

