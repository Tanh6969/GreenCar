package main

import (
	"database/sql"
	"fmt"
	"log"
	"os"

	_ "github.com/lib/pq"
	"github.com/joho/godotenv"
)

func main() {
	_ = godotenv.Load(".env")
	db, err := sql.Open("postgres", os.Getenv("DB_DSN"))
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	var id int
	var extraFee sql.NullFloat64
	var extraFeeDesc sql.NullString
	var status string
	var totalPrice float64

	err = db.QueryRow("SELECT booking_id, extra_fee, extra_fee_description, status, total_price FROM bookings WHERE booking_id = 41").Scan(&id, &extraFee, &extraFeeDesc, &status, &totalPrice)
	if err != nil {
		log.Fatal(err)
	}

	fmt.Printf("Booking %d: Status=%s, ExtraFee=%v, ExtraFeeDesc=%v, TotalPrice=%v\n", id, status, extraFee.Float64, extraFeeDesc.String, totalPrice)
}
