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
	CCCD      string     `json:"cccd"`
	RoleID              int        `json:"role_id"`
	CreatedAt           *time.Time `json:"created_at"`
	LicenseFrontURL     string     `json:"license_front_url"`
	LicenseBackURL      string     `json:"license_back_url"`
	LicenseStatus       string     `json:"license_status"` // unverified | pending | verified | rejected
	LicenseRejectReason string     `json:"license_reject_reason"`
}
