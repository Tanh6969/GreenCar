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

func (s *ChatService) GetConversationDetail(bookingID, userID int) (*entities.Conversation, []*entities.Message, error) {
	booking, err := s.bookingSvc.GetBooking(bookingID)
	if err != nil {
		return nil, nil, err
	}
	if booking == nil {
		return nil, nil, errors.New("booking not found")
	}

	ownerID, err := s.repo.GetOwnerIdByBookingID(bookingID)
	if err != nil {
		return nil, nil, err
	}

	// Ensure conversation exists
	c, err := s.repo.EnsureConversation(bookingID, booking.UserID, ownerID)
	if err != nil {
		return nil, nil, err
	}

	if c.CustomerID != userID && c.OwnerID != userID {
		return nil, nil, errors.New("unauthorized to view this conversation")
	}

	// Mark messages as read for receiver
	_ = s.repo.MarkMessagesAsRead(c.ConversationID, userID)

	msgs, err := s.repo.GetMessagesByConversationID(c.ConversationID)
	return c, msgs, err
}

func (s *ChatService) SendMessage(bookingID, senderID int, content string) (*entities.Message, error) {
	booking, err := s.bookingSvc.GetBooking(bookingID)
	if err != nil || booking == nil {
		return nil, errors.New("booking not found")
	}

	// Wait, is "active" or "confirmed" required? Yes, or maybe "completed". Let's say all valid bookings.
	// We'll allow chatting if it's not cancelled.
	if booking.Status == "cancelled" {
		return nil, errors.New("cannot chat on cancelled bookings")
	}

	ownerID, err := s.repo.GetOwnerIdByBookingID(bookingID)
	if err != nil {
		return nil, err
	}

	// Ensure conversation
	c, err := s.repo.EnsureConversation(bookingID, booking.UserID, ownerID)
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
