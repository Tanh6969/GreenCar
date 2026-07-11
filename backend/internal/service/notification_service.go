package service

import (
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
)

type NotificationService interface {
	CreateNotification(userID int, nType, title, content, link string) error
	GetNotifications(userID int) ([]entities.Notification, error)
	GetUnreadCount(userID int) (int, error)
	MarkAsRead(notificationID, userID int) error
	MarkAllAsRead(userID int) error
}

type notificationService struct {
	repo adapters.NotificationRepository
}

func NewNotificationService(repo adapters.NotificationRepository) NotificationService {
	return &notificationService{repo: repo}
}

func (s *notificationService) CreateNotification(userID int, nType, title, content, link string) error {
	n := entities.Notification{
		UserID:  userID,
		Type:    nType,
		Title:   title,
		Content: content,
		Link:    link,
	}
	return s.repo.Create(n)
}

func (s *notificationService) GetNotifications(userID int) ([]entities.Notification, error) {
	return s.repo.GetByUserID(userID)
}

func (s *notificationService) GetUnreadCount(userID int) (int, error) {
	return s.repo.GetUnreadCount(userID)
}

func (s *notificationService) MarkAsRead(notificationID, userID int) error {
	return s.repo.MarkAsRead(notificationID, userID)
}

func (s *notificationService) MarkAllAsRead(userID int) error {
	return s.repo.MarkAllAsRead(userID)
}
