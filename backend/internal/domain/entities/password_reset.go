package entities

import "time"

type PasswordReset struct {
	ID        int        `json:"id"`
	UserID    int        `json:"user_id"`
	TokenHash string     `json:"token_hash"`
	ExpiresAt *time.Time `json:"expires_at"`
	Used      bool       `json:"used"`
	CreatedAt *time.Time `json:"created_at"`
}
