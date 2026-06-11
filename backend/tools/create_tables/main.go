package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"greencar/pkg/database"
)

func main() {
	_ = godotenv.Load("../../.env")
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "host=localhost port=5432 user=postgres password=postgres dbname=greencar sslmode=disable"
	}

	db, err := database.NewFromDSN(dsn)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer db.Close()

	query := `
	CREATE TABLE IF NOT EXISTS owner_registrations (
		id SERIAL PRIMARY KEY,
		user_id INT NOT NULL,
		brand VARCHAR(100),
		model VARCHAR(100),
		year VARCHAR(10),
		license_plate VARCHAR(20),
		color VARCHAR(50),
		seats VARCHAR(10),
		transmission VARCHAR(20),
		fuel_type VARCHAR(20),
		city VARCHAR(100),
		address TEXT,
		price_per_day NUMERIC,
		description TEXT,
		images JSONB,
		status VARCHAR(20) DEFAULT 'pending',
		reject_reason TEXT,
		created_at TIMESTAMP DEFAULT NOW()
	);
	`
	_, err = db.Exec(query)
	if err != nil {
		log.Fatalf("create table: %v", err)
	}
	log.Println("Created table owner_registrations successfully")
}
