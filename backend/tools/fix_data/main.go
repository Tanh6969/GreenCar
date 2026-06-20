package main

import (
	"log"
	"os"

	"github.com/joho/godotenv"
	"greencar/pkg/database"
)

func main() {
	_ = godotenv.Load(".env")
	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "host=localhost port=5432 user=postgres password=postgres dbname=greencar sslmode=disable"
	}

	db, err := database.NewFromDSN(dsn)
	if err != nil {
		log.Fatalf("database: %v", err)
	}
	defer db.Close()

	// Alter owner_registrations table
	_, err = db.Exec("ALTER TABLE owner_registrations ADD COLUMN IF NOT EXISTS available_from VARCHAR(50); ALTER TABLE owner_registrations ADD COLUMN IF NOT EXISTS available_to VARCHAR(50);")
	if err != nil {
		log.Printf("Error altering owner_registrations: %v", err)
	} else {
		log.Println("owner_registrations altered")
	}

	// Fix pricing for VinFast super pro 2022 to match user expectation (800k / day)
	// Delete existing pricing
	_, err = db.Exec(`DELETE FROM pricing WHERE vehicle_model_id = (SELECT vehicle_model_id FROM vehicle_models WHERE name='VinFast super pro 2022')`)
	if err != nil {
		log.Printf("Error deleting old pricing: %v", err)
	} else {
		log.Println("Old pricing deleted")
	}

	// Insert new pricing
	_, err = db.Exec(`
		INSERT INTO pricing (vehicle_model_id, rental_plan_id, price)
		SELECT vm.vehicle_model_id, rp.rental_plan_id,
		CASE 
			WHEN rp.duration_type='hour' AND rp.name='Gói 4h' THEN 400000 
			WHEN rp.duration_type='hour' AND rp.name='Gói 8h' THEN 600000 
			ELSE 800000 
		END 
		FROM vehicle_models vm 
		CROSS JOIN rental_plans rp 
		WHERE vm.name='VinFast super pro 2022' 
	`)
	if err != nil {
		log.Printf("Error inserting pricing: %v", err)
	} else {
		log.Println("Pricing fixed")
	}

	// Fix availability dates and owner
	_, err = db.Exec(`
		UPDATE vehicles SET available_from='2026-06-13T09:00:00Z', available_to='2026-06-14T20:00:00Z', owner_id=(SELECT user_id FROM users WHERE name='Nguyễn Tuấn Anh' LIMIT 1) 
		WHERE vehicle_model_id = (SELECT vehicle_model_id FROM vehicle_models WHERE name='VinFast super pro 2022' LIMIT 1)
	`)
	if err != nil {
		log.Printf("Error updating availability/owner: %v", err)
	} else {
		log.Println("Availability and owner fixed to Nguyễn Tuấn Anh")
	}

	// Fix location coordinates for the test vehicle if they are 0
	_, err = db.Exec(`
		UPDATE locations SET latitude=21.0163, longitude=105.8273 
		WHERE location_id IN (
			SELECT v.location_id FROM vehicles v 
			JOIN vehicle_models m ON m.vehicle_model_id = v.vehicle_model_id
			WHERE m.name = 'VinFast super pro 2022'
		) 
		AND (latitude=0 OR latitude IS NULL)
	`)
	if err != nil {
		log.Printf("Error updating location: %v", err)
	} else {
		log.Println("Location fixed")
	}
}
