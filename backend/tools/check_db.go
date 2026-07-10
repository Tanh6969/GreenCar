package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"greencar/pkg/database"
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
		SELECT booking_id, status, total_price, deposit_amount
		FROM bookings
		ORDER BY booking_id DESC LIMIT 10
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var status string
		var price, deposit float64
		rows.Scan(&id, &status, &price, &deposit)
		log.Printf("Booking %d: status='[%s]', price=%f, deposit=%f", id, status, price, deposit)
	}
}
