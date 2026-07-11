package adapters

import "greencar/internal/domain/entities"

type NotificationRepository interface {
	Create(notification entities.Notification) error
	GetByUserID(userID int) ([]entities.Notification, error)
	GetUnreadCount(userID int) (int, error)
	MarkAsRead(notificationID int, userID int) error
	MarkAllAsRead(userID int) error
}
