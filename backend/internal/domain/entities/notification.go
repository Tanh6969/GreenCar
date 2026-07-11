package entities

import "time"

type Notification struct {
	NotificationID int       `json:"notification_id"`
	UserID         int       `json:"user_id"`
	Type           string    `json:"type"` // e.g., 'booking_requested', 'chat', 'alert'
	Title          string    `json:"title"`
	Content        string    `json:"content"`
	Link           string    `json:"link,omitempty"`
	IsRead         bool      `json:"is_read"`
	CreatedAt      time.Time `json:"created_at"`
}
