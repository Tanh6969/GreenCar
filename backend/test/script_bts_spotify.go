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

	url := "https://i.scdn.co/image/ab6761610000e5eb5704a64f34fe29ff73ab56bb"
	_, err = db.Exec("UPDATE blog_posts SET cover_image = $1 WHERE post_id = (SELECT MAX(post_id) FROM blog_posts)", url)
	if err != nil {
		log.Fatal(err)
	}
}
