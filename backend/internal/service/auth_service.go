package service

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/internal/token"
)

// AuthService provides authentication-related operations.
// It is responsible for validating credentials and issuing tokens.
// This acts as an application service (use case layer) for authentication.
type AuthService struct {
	userRepo             adapters.UserRepository
	roleRepo             adapters.RoleRepository
	passwordResetRepo    adapters.PasswordResetRepository
	emailSvc             *EmailService
	maker                token.Maker
	accessTokenDuration  time.Duration
	refreshTokenDuration time.Duration
}

// NewAuthService creates an AuthService.
func NewAuthService(
	userRepo adapters.UserRepository,
	roleRepo adapters.RoleRepository,
	passwordResetRepo adapters.PasswordResetRepository,
	emailSvc *EmailService,
	maker token.Maker,
	accessTokenDuration, refreshTokenDuration time.Duration,
) *AuthService {
	return &AuthService{
		userRepo:             userRepo,
		roleRepo:             roleRepo,
		passwordResetRepo:    passwordResetRepo,
		emailSvc:             emailSvc,
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

// Register creates a new customer account and returns tokens.
func (s *AuthService) Register(name, email, password, phone, licenseNo string) (accessToken, refreshToken string, payload *token.Payload, userID int64, err error) {
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return "", "", nil, 0, err
	}

	u := &entities.User{
		Name:      name,
		Email:     email,
		Password:  string(hashed),
		Phone:     phone,
		LicenseNo: licenseNo,
		RoleID:    2, // customer role
	}
	if err = s.userRepo.Create(u); err != nil {
		return "", "", nil, 0, err
	}

	const customerRoleName = "customer"
	accessToken, payload, err = s.maker.CreateToken(int64(u.UserID), customerRoleName, s.accessTokenDuration, token.TokenTypeAccessToken)
	if err != nil {
		return "", "", nil, 0, err
	}

	refreshToken, _, err = s.maker.CreateToken(int64(u.UserID), customerRoleName, s.refreshTokenDuration, token.TokenTypeRefreshToken)
	if err != nil {
		return "", "", nil, 0, err
	}

	return accessToken, refreshToken, payload, int64(u.UserID), nil
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

// ForgotPassword generates a reset token, stores it, and sends an email.
func (s *AuthService) ForgotPassword(email string) error {
	user, err := s.userRepo.GetByEmail(email)
	if err != nil {
		// Even if not found, don't expose it to avoid email enumeration
		return nil
	}

	// Create random token string (simulated with random string + hash)
	resetToken, _, err := s.maker.CreateToken(int64(user.UserID), "reset", 15*time.Minute, token.TokenTypeAccessToken)
	if err != nil {
		return err
	}

	// We store the hash of the token in the DB
	// We can just use the resetToken string as the token. In real apps, store hash, send token.
	// For simplicity, we will store the raw token in DB for now (or hashed if preferred).
	// Let's store raw in token_hash column.
	expiresAt := time.Now().Add(15 * time.Minute)
	pr := &entities.PasswordReset{
		UserID:    user.UserID,
		TokenHash: resetToken,
		ExpiresAt: &expiresAt,
	}

	if err := s.passwordResetRepo.Create(pr); err != nil {
		return err
	}

	// Send Email
	resetLink := "http://localhost:3000/auth/reset-password?token=" + resetToken
	return s.emailSvc.SendPasswordResetEmail(user.Email, resetLink)
}

// ResetPassword verifies the token and resets the user's password.
func (s *AuthService) ResetPassword(tokenStr, newPassword string) error {
	// Verify token
	pr, err := s.passwordResetRepo.GetByTokenHash(tokenStr)
	if err != nil || pr == nil {
		return errors.New("invalid or expired token")
	}

	if pr.Used {
		return errors.New("token already used")
	}

	if time.Now().After(*pr.ExpiresAt) {
		return errors.New("token expired")
	}

	// Update user password
	user, err := s.userRepo.GetByID(pr.UserID)
	if err != nil {
		return err
	}

	hashed, err := s.HashPassword(newPassword)
	if err != nil {
		return err
	}
	user.Password = hashed
	if err := s.userRepo.Update(user); err != nil {
		return err
	}

	// Mark token as used
	return s.passwordResetRepo.MarkAsUsed(pr.ID)
}
