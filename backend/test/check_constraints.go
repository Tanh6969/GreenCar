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

	rows, err := db.Query(`
		SELECT conname, pg_get_constraintdef(c.oid)
		FROM pg_constraint c
		JOIN pg_namespace n ON n.oid = c.connamespace
		WHERE conrelid = 'owner_registrations'::regclass
	`)
	if err != nil {
		log.Fatalf("Query failed: %v", err)
	}
	defer rows.Close()

	fmt.Println("Constraints for owner_registrations:")
	for rows.Next() {
		var name, def string
		rows.Scan(&name, &def)
		fmt.Printf("- %s: %s\n", name, def)
	}
}
