package entities

import "time"

// User represents the users table.
type User struct {
	UserID    int        `json:"user_id"`
	Name      string     `json:"name"`
	Email     string     `json:"email"`
	Password  string     `json:"-"`
	Phone     string     `json:"phone"`
	LicenseNo string     `json:"license_no"`
	RoleID    int        `json:"role_id"`
	CreatedAt *time.Time `json:"created_at"`
}
