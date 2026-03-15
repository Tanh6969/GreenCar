package adapters

import "greencar/internal/domain/entities"

// RoleRepository defines the storage interface for Role.
type RoleRepository interface {
	GetByID(id int) (*entities.Role, error)
	Create(r *entities.Role) error
	Update(r *entities.Role) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.Role, error)
}
