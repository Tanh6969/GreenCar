package main
import (
	"fmt"
	"database/sql"
	_ "github.com/lib/pq"
)
func main() {
	db, err := sql.Open("postgres", "host=localhost user=postgres password=postgres dbname=greencar sslmode=disable")
	if err != nil { panic(err) }
	var fee float64
	err = db.QueryRow("SELECT extra_fee FROM bookings LIMIT 1").Scan(&fee)
	fmt.Println("Result:", err, fee)
}
