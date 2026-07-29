package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

func main() {
	dsn := "postgresql://postgres.potvsbuvrgegbsmctawy:StYWBhaleE0wcssN@aws-0-ap-northeast-1.pooler.supabase.com:5432/postgres"

	db, err := sql.Open("postgres", dsn)
	if err != nil {
		log.Fatalf("Unable to connect to database: %v\n", err)
	}
	defer db.Close()

	// Find owner registration
	licensePlate := "30A-88888"
	var id, userID int
	var status string
	err = db.QueryRow("SELECT id, user_id, status FROM owner_registrations WHERE license_plate = $1", licensePlate).Scan(&id, &userID, &status)
	if err != nil {
		if err == sql.ErrNoRows {
			fmt.Println("No registration found with that license plate.")
			return
		}
		log.Fatalf("Error finding registration: %v\n", err)
	}
	fmt.Printf("Found Registration ID: %d, User ID: %d, Status: %s\n", id, userID, status)

	// Delete it
	res, err := db.Exec("DELETE FROM owner_registrations WHERE id = $1", id)
	if err != nil {
		log.Fatalf("Error deleting registration: %v\n", err)
	}
	rowsAffected, _ := res.RowsAffected()
	fmt.Printf("Successfully deleted %d registration(s).\n", rowsAffected)
}
