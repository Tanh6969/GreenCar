package adapters

import "greencar/internal/domain/entities"

type ChatRepository interface {
	GetConversationsByUserID(userID int) ([]*entities.Conversation, error)
	GetConversationByBookingID(bookingID int) (*entities.Conversation, error)
	GetMessagesByConversationID(conversationID int) ([]*entities.Message, error)
	CreateMessage(msg *entities.Message) error
	EnsureConversation(bookingID, customerID, ownerID int) (*entities.Conversation, error)
	MarkMessagesAsRead(conversationID, receiverID int) error
	GetOwnerIdByBookingID(bookingID int) (int, error)
}
