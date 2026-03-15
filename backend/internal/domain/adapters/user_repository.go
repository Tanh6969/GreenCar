package adapters

import "greencar/internal/domain/entities"

// UserRepository defines the storage interface for User.
// Concrete implementations (Postgres, in-memory, ...) should implement this interface.
type UserRepository interface {
	GetByID(id int) (*entities.User, error)
	Create(u *entities.User) error
	Update(u *entities.User) error
	Delete(id int) error
	List(limit, offset int) ([]*entities.User, error)
	GetByEmail(email string) (*entities.User, error)
}
