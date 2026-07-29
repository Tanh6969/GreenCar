package main

import (
	"database/sql"
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

	_, err = db.Exec("UPDATE blog_posts SET cover_image = '' WHERE cover_image LIKE 'blob:%'")
	if err != nil {
		log.Fatal(err)
	}
}
