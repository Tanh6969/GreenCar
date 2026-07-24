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

	res, err := db.Exec("UPDATE users SET license_status = 'verified'")
	if err != nil {
		log.Fatalf("Update failed: %v", err)
	}

	rows, _ := res.RowsAffected()
	fmt.Printf("Updated %d users' license_status to 'verified' successfully!\n", rows)
}
