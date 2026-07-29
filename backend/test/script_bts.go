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

	url := "https://upload.wikimedia.org/wikipedia/commons/4/4d/BTS_during_a_White_House_press_conference_May_31%2C_2022_%28cropped%29.jpg"
	_, err = db.Exec("UPDATE blog_posts SET cover_image = $1 WHERE post_id = (SELECT MAX(post_id) FROM blog_posts)", url)
	if err != nil {
		log.Fatal(err)
	}
}
