package dto

// LoginRequest is the request payload for user login.
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse is the response payload returned after successful login.
type LoginResponse struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	ExpiresAt    string `json:"expires_at"`
	Role         string `json:"role"`
	UserID       int64  `json:"user_id"`
}
