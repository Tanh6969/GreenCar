package repository

import (
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

type userRepository struct {
	db *database.DB
}

// NewUserRepository creates a new user repository.
// It returns a domain-layer repository interface (port) so the service layer
// depends on the domain abstraction instead of this package.
func NewUserRepository(db *database.DB) adapters.UserRepository {
	return &userRepository{db: db}
}

func (r *userRepository) GetByID(id int) (*entities.User, error) {
	var u entities.User
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

func (r *userRepository) Create(u *entities.User) error {
	query := `INSERT INTO users (name, email, password, phone, license_no, role_id, created_at) 
		VALUES ($1, $2, $3, $4, $5, $6, NOW()) 
		RETURNING user_id, created_at`
	return r.db.QueryRow(query, u.Name, u.Email, u.Password, u.Phone, u.LicenseNo, u.RoleID).
		Scan(&u.UserID, &u.CreatedAt)
}

func (r *userRepository) Update(u *entities.User) error {
	query := `UPDATE users SET name = $1, email = $2, phone = $3, license_no = $4, role_id = $5 
		WHERE user_id = $6`
	_, err := r.db.Exec(query, u.Name, u.Email, u.Phone, u.LicenseNo, u.RoleID, u.UserID)
	return err
}

func (r *userRepository) Delete(id int) error {
	query := `DELETE FROM users WHERE user_id = $1`
	_, err := r.db.Exec(query, id)
	return err
}

func (r *userRepository) List(limit, offset int) ([]*entities.User, error) {
	query := `SELECT user_id, name, email, password, phone, license_no, role_id, created_at 
		FROM users ORDER BY user_id LIMIT $1 OFFSET $2`
	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []*entities.User
	for rows.Next() {
		var u entities.User
		err := rows.Scan(&u.UserID, &u.Name, &u.Email, &u.Password, &u.Phone, &u.LicenseNo, &u.RoleID, &u.CreatedAt)
		if err != nil {
			return nil, err
		}
		users = append(users, &u)
	}
	return users, nil
}

func (r *userRepository) GetByEmail(email string) (*entities.User, error) {
	var u entities.User
	query := `SELECT user_id, name, email, password, phone, license_no, role_id, created_at 
		FROM users WHERE email = $1`
	err := r.db.QueryRow(query, email).Scan(
		&u.UserID, &u.Name, &u.Email, &u.Password, &u.Phone, &u.LicenseNo, &u.RoleID, &u.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &u, nil
}
