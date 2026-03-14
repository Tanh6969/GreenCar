package repository

import (
	"greencar/internal/domain"
	"greencar/pkg/database"
)

// UserRepository defines operations on users.
type UserRepository interface {
	GetByID(id int) (*domain.User, error)
	Create(u *domain.User) error
}

type userRepository struct {
	db *database.DB
}

// NewUserRepository creates a new user repository.
func NewUserRepository(db *database.DB) UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) GetByID(id int) (*domain.User, error) {
	var u domain.User
	query := `SELECT user_id, name, email, password, phone, license_no, role_id, created_at 
		FROM users WHERE user_id = $1`
	err := r.db.QueryRow(query, id).Scan(
		&u.UserID, &u.Name, &u.Email, &u.Password, &u.Phone, &u.LicenseNo, &u.RoleID, &u.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *userRepository) Create(u *domain.User) error {
	query := `INSERT INTO users (name, email, password, phone, license_no, role_id, created_at) 
		VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
		RETURNING user_id, created_at`
	return r.db.QueryRow(query, u.Name, u.Email, u.Password, u.Phone, u.LicenseNo, u.RoleID).
		Scan(&u.UserID, &u.CreatedAt)
}
