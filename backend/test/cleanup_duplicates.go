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
		log.Fatalf("Open failed: %v", err)
	}
	defer db.Close()

	// Keep the most recent registration for each user_id + license_plate combination, and delete the rest
	query := `
		DELETE FROM owner_registrations 
		WHERE id NOT IN (
			SELECT DISTINCT ON (user_id, license_plate) id
			FROM owner_registrations
			ORDER BY user_id, license_plate, created_at DESC
		)
		AND status != 'approved'
	`

	res, err := db.Exec(query)
	if err != nil {
		log.Fatalf("Cleanup failed: %v", err)
	}

	rows, _ := res.RowsAffected()
	fmt.Printf("Cleaned up %d duplicate/rejected registrations successfully!\n", rows)
}
