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

	_, err = db.Exec("ALTER TABLE owner_registrations DROP CONSTRAINT IF EXISTS owner_registrations_license_plate_key")
	if err != nil {
		log.Fatalf("Drop constraint failed: %v", err)
	}

	fmt.Println("Dropped unique constraint on license_plate in owner_registrations table successfully!")
}
