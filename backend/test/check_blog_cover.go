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

	rows, err := db.Query("SELECT post_id, title, substr(cover_image, 1, 50) FROM blog_posts ORDER BY post_id DESC LIMIT 5")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id int
		var title string
		var cover sql.NullString
		rows.Scan(&id, &title, &cover)
		fmt.Printf("Post %d: %s | Cover: %s\n", id, title, cover.String)
	}
}
