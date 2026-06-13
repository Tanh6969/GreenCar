package entities

import "time"

// Conversation represents the conversations table
type Conversation struct {
	ConversationID int        `json:"conversation_id"`
	BookingID      int        `json:"booking_id"`
	CustomerID     int        `json:"customer_id"`
	OwnerID        int        `json:"owner_id"`
	LastMessageAt  *time.Time `json:"last_message_at"`
	CreatedAt      *time.Time `json:"created_at"`

	// Joined fields for frontend display
	CustomerName   string `json:"customer_name,omitempty"`
	OwnerName      string `json:"owner_name,omitempty"`
	VehicleName    string `json:"vehicle_name,omitempty"`
	UnreadCount    int    `json:"unread_count"`
	LastMessage    string `json:"last_message,omitempty"`
}

// Message represents the messages table
type Message struct {
	MessageID      int        `json:"message_id"`
	ConversationID int        `json:"conversation_id"`
	SenderID       int        `json:"sender_id"`
	Content        string     `json:"content"`
	IsRead         bool       `json:"is_read"`
	CreatedAt      *time.Time `json:"created_at"`
}
