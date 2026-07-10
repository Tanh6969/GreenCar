package main

import (
	"log"
	"os"

	"greencar/pkg/database"

	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load(".env")
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "host=localhost port=5432 user=postgres password=postgres dbname=greencar sslmode=disable"
	}
	db, err := database.NewFromDSN(dsn)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer db.Close()

	rows, err := db.Query(`
		SELECT status, COUNT(*)
		FROM bookings
		GROUP BY status
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var status string
		var count int
		rows.Scan(&status, &count)
		log.Printf("Status: %s, Count: %d", status, count)
	}
}
