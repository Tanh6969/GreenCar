package dto

import "time"

// UserResponse is the API response payload for a user.
type UserResponse struct {
	ID                  int       `json:"id"`
	Name                string    `json:"name"`
	Email               string    `json:"email"`
	Phone               string    `json:"phone"`
	LicenseNo           string    `json:"license_no"`
	RoleID              int       `json:"role_id"`
	CreatedAt           time.Time `json:"created_at"`
	LicenseFrontURL     string    `json:"license_front_url"`
	LicenseBackURL      string    `json:"license_back_url"`
	LicenseStatus       string    `json:"license_status"`
	LicenseRejectReason string    `json:"license_reject_reason"`
}

// CreateUserRequest is the request payload to create a user.
type CreateUserRequest struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Phone     string `json:"phone"`
	LicenseNo string `json:"license_no"`
	RoleID    int    `json:"role_id"`
}

// UpdateUserRequest is the request payload to update a user.
type UpdateUserRequest struct {
	Name      string `json:"name"`
	Email     string `json:"email"`
	Phone     string `json:"phone"`
	LicenseNo string `json:"license_no"`
	RoleID    int    `json:"role_id"`
}

type SubmitLicenseRequest struct {
	LicenseNo       string `json:"license_no"`
	LicenseFrontURL string `json:"license_front_url"`
	LicenseBackURL  string `json:"license_back_url"`
}

type VerifyLicenseRequest struct {
	Status       string `json:"status"` // verified | rejected
	RejectReason string `json:"reject_reason,omitempty"`
}
