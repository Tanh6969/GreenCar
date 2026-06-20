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
		SELECT v.vehicle_id, v.license_plate, u.name, m.name
		FROM vehicles v
		JOIN users u ON v.owner_id = u.user_id
		JOIN vehicle_models m ON v.vehicle_model_id = m.vehicle_model_id
		ORDER BY v.vehicle_id DESC LIMIT 10
	`)
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var plate, owner, model string
		rows.Scan(&id, &plate, &owner, &model)
		log.Printf("Vehicle %d: plate='%s', owner='%s', model='%s'", id, plate, owner, model)
	}
}
