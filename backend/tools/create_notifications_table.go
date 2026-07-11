package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	dsn := "host=localhost user=postgres password=Megake123 dbname=greencar port=5432 sslmode=disable"
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Error opening db: %v\n", err)
	}
	defer db.Close()

	query := `
	CREATE TABLE IF NOT EXISTS notifications (
		notification_id SERIAL PRIMARY KEY,
		user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
		type VARCHAR(50) NOT NULL,
		title VARCHAR(255) NOT NULL,
		content TEXT NOT NULL,
		link VARCHAR(255),
		is_read BOOLEAN DEFAULT FALSE,
		created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
	);
	
	CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
	`

	_, err = db.Exec(query)
	if err != nil {
		log.Fatalf("Error creating notifications table: %v\n", err)
	}

	fmt.Println("Created notifications table successfully.")
}
