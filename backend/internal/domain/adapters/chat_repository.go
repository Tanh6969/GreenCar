package adapters

import "greencar/internal/domain/entities"

type ChatRepository interface {
	GetConversationsByUserID(userID int) ([]*entities.Conversation, error)
	GetConversationByID(conversationID int) (*entities.Conversation, error)
	GetConversationByVehicleAndCustomer(vehicleID, customerID int) (*entities.Conversation, error)
	GetMessagesByConversationID(conversationID int) ([]*entities.Message, error)
	CreateMessage(msg *entities.Message) error
	EnsureConversation(vehicleID, customerID, ownerID int) (*entities.Conversation, error)
	MarkMessagesAsRead(conversationID, receiverID int) error
	GetOwnerIdByVehicleID(vehicleID int) (int, error)
}
