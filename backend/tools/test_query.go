package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	db, err := sql.Open("postgres", "host=localhost port=5432 user=postgres password=Megake123 dbname=greencar sslmode=disable")
	if err != nil {
		log.Fatal(err)
	}

	query := `SELECT b.booking_id, COALESCE(u.name, ''), COALESCE(u.email, ''), COALESCE(u.license_no, ''), 
	(SELECT COUNT(*) FROM bookings cb WHERE cb.user_id = b.user_id AND cb.status IN ('completed','pending_payment','paid')) AS customer_trip_count
	FROM bookings b LEFT JOIN users u ON u.user_id = b.user_id WHERE b.booking_id = 44`

	var id int
	var name, email, license string
	var count int
	err = db.QueryRow(query).Scan(&id, &name, &email, &license, &count)
	if err != nil {
		fmt.Println("Error:", err)
		return
	}
	fmt.Printf("Booking: %d\nName: %s\nEmail: %s\nLicense: %s\nCount: %d\n", id, name, email, license, count)
}
