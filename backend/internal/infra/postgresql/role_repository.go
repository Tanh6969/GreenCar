package repository

import (
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

type roleRepository struct {
	db *database.DB
}

// NewRoleRepository creates a new role repository.
func NewRoleRepository(db *database.DB) adapters.RoleRepository {
	return &roleRepository{db: db}
}

func (r *roleRepository) GetByID(id int) (*entities.Role, error) {
	var row entities.Role
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

func (r *roleRepository) Update(row *entities.Role) error {
	query := `UPDATE roles SET role_name = $1 WHERE role_id = $2`
	_, err := r.db.Exec(query, row.RoleName, row.RoleID)
	return err
}

func (r *roleRepository) Delete(id int) error {
	query := `DELETE FROM roles WHERE role_id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *roleRepository) List(limit, offset int) ([]*entities.Role, error) {
	query := `SELECT role_id, role_name FROM roles LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var roles []*entities.Role
	for rows.Next() {
		var r entities.Role
		err := rows.Scan(&r.RoleID, &r.RoleName)
		if err != nil {
			return nil, err
		}
		roles = append(roles, &r)
	}
	return roles, nil
}
