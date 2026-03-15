package repository

import (
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

// RoleRepository defines operations on roles.
type RoleRepository interface {
	GetByID(id int) (*entities.Role, error)
	Create(r *entities.Role) error
}

type roleRepository struct {
	db *database.DB
}

// NewRoleRepository creates a new role repository.
func NewRoleRepository(db *database.DB) RoleRepository {
	return &roleRepository{db: db}
}

func (r *roleRepository) GetByID(id int) (*entities.Role, error) {
	var row domain.Role
	err := r.db.QueryRow(`SELECT role_id, role_name FROM roles WHERE role_id = $1`, id).
		Scan(&row.RoleID, &row.RoleName)
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *roleRepository) Create(row *entities.Role) error {
	return r.db.QueryRow(`INSERT INTO roles (role_name) VALUES ($1) RETURNING role_id`, row.RoleName).
		Scan(&row.RoleID)
}
