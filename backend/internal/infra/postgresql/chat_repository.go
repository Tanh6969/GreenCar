package repository

import (
	"database/sql"
	"errors"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

type chatRepository struct {
	db *database.DB
}

// NewChatRepository creates a new chat repository.
func NewChatRepository(db *database.DB) adapters.ChatRepository {
	return &chatRepository{db: db}
}

func (r *chatRepository) GetConversationsByUserID(userID int) ([]*entities.Conversation, error) {
	query := `
		SELECT c.conversation_id, c.vehicle_id, c.customer_id, c.owner_id, c.last_message_at, c.created_at,
		       cu.name AS customer_name, ou.name AS owner_name, vm.name AS vehicle_name,
		       (SELECT content FROM messages m WHERE m.conversation_id = c.conversation_id ORDER BY m.created_at DESC LIMIT 1) AS last_message,
		       (SELECT COUNT(*) FROM messages m WHERE m.conversation_id = c.conversation_id AND m.sender_id != $1 AND m.is_read = FALSE) AS unread_count
		FROM conversations c
		JOIN users cu ON c.customer_id = cu.user_id
		JOIN users ou ON c.owner_id = ou.user_id
		JOIN vehicles v ON c.vehicle_id = v.vehicle_id
		JOIN vehicle_models vm ON v.vehicle_model_id = vm.vehicle_model_id
		WHERE c.customer_id = $1 OR c.owner_id = $1
		ORDER BY c.last_message_at DESC
	`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var convos []*entities.Conversation
	for rows.Next() {
		var c entities.Conversation
		var lastMsg sql.NullString
		if err := rows.Scan(
			&c.ConversationID, &c.VehicleID, &c.CustomerID, &c.OwnerID, &c.LastMessageAt, &c.CreatedAt,
			&c.CustomerName, &c.OwnerName, &c.VehicleName,
			&lastMsg, &c.UnreadCount,
		); err != nil {
			return nil, err
		}
		if lastMsg.Valid {
			c.LastMessage = lastMsg.String
		}
		convos = append(convos, &c)
	}
	return convos, rows.Err()
}

func (r *chatRepository) GetConversationByID(conversationID int) (*entities.Conversation, error) {
	query := `
		SELECT conversation_id, vehicle_id, customer_id, owner_id, last_message_at, created_at
		FROM conversations
		WHERE conversation_id = $1
	`
	var c entities.Conversation
	err := r.db.QueryRow(query, conversationID).Scan(
		&c.ConversationID, &c.VehicleID, &c.CustomerID, &c.OwnerID, &c.LastMessageAt, &c.CreatedAt,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *chatRepository) GetConversationByVehicleAndCustomer(vehicleID, customerID int) (*entities.Conversation, error) {
	query := `
		SELECT conversation_id, vehicle_id, customer_id, owner_id, last_message_at, created_at
		FROM conversations
		WHERE vehicle_id = $1 AND customer_id = $2
	`
	var c entities.Conversation
	err := r.db.QueryRow(query, vehicleID, customerID).Scan(
		&c.ConversationID, &c.VehicleID, &c.CustomerID, &c.OwnerID, &c.LastMessageAt, &c.CreatedAt,
	)
	if errors.Is(err, sql.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *chatRepository) GetMessagesByConversationID(conversationID int) ([]*entities.Message, error) {
	query := `
		SELECT message_id, conversation_id, sender_id, content, is_read, created_at
		FROM messages
		WHERE conversation_id = $1
		ORDER BY created_at ASC
	`
	rows, err := r.db.Query(query, conversationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var msgs []*entities.Message
	for rows.Next() {
		var m entities.Message
		if err := rows.Scan(
			&m.MessageID, &m.ConversationID, &m.SenderID, &m.Content, &m.IsRead, &m.CreatedAt,
		); err != nil {
			return nil, err
		}
		msgs = append(msgs, &m)
	}
	return msgs, rows.Err()
}

func (r *chatRepository) CreateMessage(msg *entities.Message) error {
	query := `
		INSERT INTO messages (conversation_id, sender_id, content, is_read, created_at)
		VALUES ($1, $2, $3, false, now())
		RETURNING message_id, created_at
	`
	err := r.db.QueryRow(query, msg.ConversationID, msg.SenderID, msg.Content).Scan(&msg.MessageID, &msg.CreatedAt)
	if err != nil {
		return err
	}

	// Update conversation last_message_at
	_, err = r.db.Exec(`UPDATE conversations SET last_message_at = $1 WHERE conversation_id = $2`, msg.CreatedAt, msg.ConversationID)
	return err
}

func (r *chatRepository) EnsureConversation(vehicleID, customerID, ownerID int) (*entities.Conversation, error) {
	c, err := r.GetConversationByVehicleAndCustomer(vehicleID, customerID)
	if err != nil {
		return nil, err
	}
	if c != nil {
		return c, nil
	}

	// Create new conversation
	query := `
		INSERT INTO conversations (vehicle_id, customer_id, owner_id, created_at, last_message_at)
		VALUES ($1, $2, $3, now(), now())
		RETURNING conversation_id, vehicle_id, customer_id, owner_id, last_message_at, created_at
	`
	var newC entities.Conversation
	err = r.db.QueryRow(query, vehicleID, customerID, ownerID).Scan(
		&newC.ConversationID, &newC.VehicleID, &newC.CustomerID, &newC.OwnerID, &newC.LastMessageAt, &newC.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &newC, nil
}

func (r *chatRepository) MarkMessagesAsRead(conversationID, receiverID int) error {
	query := `
		UPDATE messages
		SET is_read = true
		WHERE conversation_id = $1 AND sender_id != $2 AND is_read = false
	`
	_, err := r.db.Exec(query, conversationID, receiverID)
	return err
}

func (r *chatRepository) GetOwnerIdByVehicleID(vehicleID int) (int, error) {
	var ownerID int
	query := `
		SELECT COALESCE(owner_id, 0)
		FROM vehicles
		WHERE vehicle_id = $1
	`
	err := r.db.QueryRow(query, vehicleID).Scan(&ownerID)
	return ownerID, err
}
