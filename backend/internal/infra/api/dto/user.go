package dto

import "time"

// UserResponse is the API response payload for a user.
type UserResponse struct {
	ID        int       `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Phone     string    `json:"phone"`
	LicenseNo string    `json:"license_no"`
	RoleID    int       `json:"role_id"`
	CreatedAt time.Time `json:"created_at"`
}
