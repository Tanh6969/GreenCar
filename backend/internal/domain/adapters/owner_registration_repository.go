package adapters

import "greencar/internal/domain/entities"

type OwnerRegistrationRepository interface {
	Create(reg *entities.OwnerRegistration) error
	GetByUserID(userID int) ([]*entities.OwnerRegistration, error)
	List(limit, offset int) ([]*entities.OwnerRegistration, int, error)
	UpdateStatus(id int, status, reason string) error
}
