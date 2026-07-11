package adapters

import "greencar/internal/domain/entities"

type PasswordResetRepository interface {
	Create(pr *entities.PasswordReset) error
	GetByTokenHash(hash string) (*entities.PasswordReset, error)
	MarkAsUsed(id int) error
}
