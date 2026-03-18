package service

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"

	"greencar/internal/domain/adapters"
	"greencar/internal/token"
)

// AuthService provides authentication-related operations.
// It is responsible for validating credentials and issuing tokens.
// This acts as an application service (use case layer) for authentication.
type AuthService struct {
	userRepo             adapters.UserRepository
	roleRepo             adapters.RoleRepository
	maker                token.Maker
	accessTokenDuration  time.Duration
	refreshTokenDuration time.Duration
}

// NewAuthService creates an AuthService.
func NewAuthService(
	userRepo adapters.UserRepository,
	roleRepo adapters.RoleRepository,
	maker token.Maker,
	accessTokenDuration, refreshTokenDuration time.Duration,
) *AuthService {
	return &AuthService{
		userRepo:             userRepo,
		roleRepo:             roleRepo,
		maker:                maker,
		accessTokenDuration:  accessTokenDuration,
		refreshTokenDuration: refreshTokenDuration,
	}
}

// Login authenticates a user and returns access + refresh tokens.
func (s *AuthService) Login(email, password string) (accessToken, refreshToken string, payload *token.Payload, err error) {
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		return "", "", nil, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password)); err != nil {
		return "", "", nil, errors.New("invalid credentials")
	}

	role, err := s.roleRepo.GetByID(user.RoleID)
	if err != nil {
		return "", "", nil, err
	}

	accessToken, payload, err = s.maker.CreateToken(int64(user.UserID), role.RoleName, s.accessTokenDuration, token.TokenTypeAccessToken)
	if err != nil {
		return "", "", nil, err
	}

	refreshToken, _, err = s.maker.CreateToken(int64(user.UserID), role.RoleName, s.refreshTokenDuration, token.TokenTypeRefreshToken)
	if err != nil {
		return "", "", nil, err
	}

	return accessToken, refreshToken, payload, nil
}

// HashPassword generates a bcrypt hash of the password.
func (s *AuthService) HashPassword(password string) (string, error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", err
	}
	return string(hashed), nil
}

// ComparePassword compares hashed and plain-text password.
func (s *AuthService) ComparePassword(hashedPassword, password string) error {
	return bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(password))
}
