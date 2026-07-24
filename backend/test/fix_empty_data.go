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

	// Update records that have empty license_plate or price_per_day = 0
	res, err := db.Exec(`
		UPDATE owner_registrations 
		SET license_plate = CASE WHEN license_plate = '' OR license_plate IS NULL THEN '30A-88888' ELSE license_plate END,
		    fuel_type = CASE WHEN fuel_type = '' OR fuel_type IS NULL THEN 'electric' ELSE fuel_type END,
		    price_per_day = CASE WHEN price_per_day = 0 THEN 850000 ELSE price_per_day END
		WHERE license_plate = '' OR license_plate IS NULL OR fuel_type = '' OR fuel_type IS NULL OR price_per_day = 0
	`)
	if err != nil {
		log.Fatalf("Update failed: %v", err)
	}

	rows, _ := res.RowsAffected()
	fmt.Printf("Updated %d owner registrations with mock values for missing data.\n", rows)
}
