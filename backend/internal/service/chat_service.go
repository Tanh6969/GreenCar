package service

import (
	"errors"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/logger"
)

type ChatService struct {
	repo       adapters.ChatRepository
	bookingSvc *BookingService
	log        *logger.Logger
}

func NewChatService(repo adapters.ChatRepository, bookingSvc *BookingService, log *logger.Logger) *ChatService {
	return &ChatService{repo: repo, bookingSvc: bookingSvc, log: log}
}

func (s *ChatService) GetConversations(userID int) ([]*entities.Conversation, error) {
	return s.repo.GetConversationsByUserID(userID)
}

func (s *ChatService) GetConversationDetail(conversationID, userID int) (*entities.Conversation, []*entities.Message, error) {
	c, err := s.repo.GetConversationByID(conversationID)
	if err != nil {
		return nil, nil, err
	}
	if c == nil {
		return nil, nil, errors.New("conversation not found")
	}

	if c.CustomerID != userID && c.OwnerID != userID {
		return nil, nil, errors.New("unauthorized to view this conversation")
	}

	// Mark messages as read for receiver
	_ = s.repo.MarkMessagesAsRead(c.ConversationID, userID)

	msgs, err := s.repo.GetMessagesByConversationID(c.ConversationID)
	return c, msgs, err
}

func (s *ChatService) SendMessage(conversationID, senderID int, content string) (*entities.Message, error) {
	c, err := s.repo.GetConversationByID(conversationID)
	if err != nil {
		return nil, err
	}
	if c == nil {
		return nil, errors.New("conversation not found")
	}

	if c.CustomerID != senderID && c.OwnerID != senderID {
		return nil, errors.New("unauthorized to send message to this conversation")
	}

	msg := &entities.Message{
		ConversationID: c.ConversationID,
		SenderID:       senderID,
		Content:        content,
	}

	err = s.repo.CreateMessage(msg)
	return msg, err
}

func (s *ChatService) SendMessageByBooking(bookingID, senderID int, content string) (*entities.Message, error) {
	booking, err := s.bookingSvc.GetBooking(bookingID)
	if err != nil || booking == nil {
		return nil, errors.New("booking not found")
	}

	ownerID, err := s.repo.GetOwnerIdByVehicleID(booking.VehicleID)
	if err != nil {
		return nil, err
	}

	// Ensure conversation
	c, err := s.repo.EnsureConversation(booking.VehicleID, booking.UserID, ownerID)
	if err != nil {
		return nil, err
	}

	if c.CustomerID != senderID && c.OwnerID != senderID {
		return nil, errors.New("unauthorized to send message to this conversation")
	}

	msg := &entities.Message{
		ConversationID: c.ConversationID,
		SenderID:       senderID,
		Content:        content,
	}

	err = s.repo.CreateMessage(msg)
	return msg, err
}
