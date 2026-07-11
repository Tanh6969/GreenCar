package repository

import (
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

type notificationRepository struct {
	db *database.DB
}

func NewNotificationRepository(db *database.DB) adapters.NotificationRepository {
	return &notificationRepository{db: db}
}

func (r *notificationRepository) Create(n entities.Notification) error {
	query := `
		INSERT INTO notifications (user_id, type, title, content, link)
		VALUES ($1, $2, $3, $4, $5)
	`
	_, err := r.db.Exec(query, n.UserID, n.Type, n.Title, n.Content, n.Link)
	return err
}

func (r *notificationRepository) GetByUserID(userID int) ([]entities.Notification, error) {
	query := `
		SELECT notification_id, user_id, type, title, content, link, is_read, created_at
		FROM notifications
		WHERE user_id = $1
		ORDER BY created_at DESC
		LIMIT 50
	`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var list []entities.Notification
	for rows.Next() {
		var n entities.Notification
		var link *string
		err := rows.Scan(
			&n.NotificationID, &n.UserID, &n.Type, &n.Title, &n.Content, &link, &n.IsRead, &n.CreatedAt,
		)
		if err != nil {
			return nil, err
		}
		if link != nil {
			n.Link = *link
		}
		list = append(list, n)
	}
	return list, nil
}

func (r *notificationRepository) GetUnreadCount(userID int) (int, error) {
	query := `SELECT COUNT(*) FROM notifications WHERE user_id = $1 AND is_read = false`
	var count int
	err := r.db.QueryRow(query, userID).Scan(&count)
	return count, err
}

func (r *notificationRepository) MarkAsRead(notificationID int, userID int) error {
	query := `UPDATE notifications SET is_read = true WHERE notification_id = $1 AND user_id = $2`
	_, err := r.db.Exec(query, notificationID, userID)
	return err
}

func (r *notificationRepository) MarkAllAsRead(userID int) error {
	query := `UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false`
	_, err := r.db.Exec(query, userID)
	return err
}
