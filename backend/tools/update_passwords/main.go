package main

import (
	"log"
	"os"

	"golang.org/x/crypto/bcrypt"
	"github.com/joho/godotenv"
	"greencar/pkg/database"
)

func main() {
	_ = godotenv.Load("../../.env")
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "host=localhost port=5432 user=postgres password=postgres dbname=greencar sslmode=disable"
	}

	db, err := database.NewFromDSN(dsn)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer db.Close()

	password := "123456"
	hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		log.Fatalf("bcrypt: %v", err)
	}

	res, err := db.Exec("UPDATE users SET password = $1", string(hashed))
	if err != nil {
		log.Fatalf("update: %v", err)
	}

	rowsAffected, _ := res.RowsAffected()
	log.Printf("Successfully updated %d users' passwords to '123456'", rowsAffected)
}
