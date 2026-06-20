package repository

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/url"
	"strconv"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

// Helper function for geocoding
func geocodeAddress(address, city string) (float64, float64) {
	query := url.QueryEscape(address + ", " + city + ", Vietnam")
	req, _ := http.NewRequest("GET", "https://nominatim.openstreetmap.org/search?q="+query+"&format=json&limit=1", nil)
	req.Header.Set("User-Agent", "GreenCarApp/1.0") // Nominatim requires User-Agent
	client := &http.Client{}
	resp, err := client.Do(req)
	if err == nil {
		defer resp.Body.Close()
		var res []struct {
			Lat string `json:"lat"`
			Lon string `json:"lon"`
		}
		if json.NewDecoder(resp.Body).Decode(&res) == nil && len(res) > 0 {
			lat, _ := strconv.ParseFloat(res[0].Lat, 64)
			lng, _ := strconv.ParseFloat(res[0].Lon, 64)
			if lat != 0 && lng != 0 {
				return lat, lng
			}
		}
	}
	// Fallbacks
	if city == "TP. Hồ Chí Minh" || city == "TP.HCM" || city == "Hồ Chí Minh" {
		return 10.7769, 106.7009
	}
	return 21.0285, 105.8542
}

type ownerRegistrationRepository struct {
	db *database.DB
}

func NewOwnerRegistrationRepository(db *database.DB) adapters.OwnerRegistrationRepository {
	return &ownerRegistrationRepository{db: db}
}

func (r *ownerRegistrationRepository) Create(reg *entities.OwnerRegistration) error {
	imagesJSON, _ := json.Marshal(reg.Images)
	query := `INSERT INTO owner_registrations 
		(user_id, brand, model, year, license_plate, color, seats, transmission, fuel_type, city, address, price_per_day, description, images, status, available_from, available_to)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id, created_at`
	return r.db.QueryRow(query,
		reg.UserID, reg.Brand, reg.Model, reg.Year, reg.LicensePlate,
		reg.Color, reg.Seats, reg.Transmission, reg.FuelType, reg.City,
		reg.Address, reg.PricePerDay, reg.Description, string(imagesJSON), "pending", reg.AvailableFrom, reg.AvailableTo,
	).Scan(&reg.ID, &reg.CreatedAt)
}

func (r *ownerRegistrationRepository) GetByUserID(userID int) ([]*entities.OwnerRegistration, error) {
	query := `SELECT id, user_id, brand, model, year, license_plate, color, seats, transmission, fuel_type, city, address, price_per_day, description, images, status, reject_reason, created_at, COALESCE(available_from, ''), COALESCE(available_to, '')
		FROM owner_registrations WHERE user_id = $1 ORDER BY created_at DESC`
	rows, err := r.db.Query(query, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var regs []*entities.OwnerRegistration
	for rows.Next() {
		var reg entities.OwnerRegistration
		var imagesJSON string
		var rejectReason *string
		err := rows.Scan(
			&reg.ID, &reg.UserID, &reg.Brand, &reg.Model, &reg.Year, &reg.LicensePlate,
			&reg.Color, &reg.Seats, &reg.Transmission, &reg.FuelType, &reg.City,
			&reg.Address, &reg.PricePerDay, &reg.Description, &imagesJSON, &reg.Status, &rejectReason, &reg.CreatedAt, &reg.AvailableFrom, &reg.AvailableTo,
		)
		if err != nil {
			return nil, err
		}
		json.Unmarshal([]byte(imagesJSON), &reg.Images)
		if rejectReason != nil {
			reg.RejectReason = *rejectReason
		}
		regs = append(regs, &reg)
	}
	return regs, nil
}

func (r *ownerRegistrationRepository) GetAll() ([]*entities.OwnerRegistration, error) {
	query := `SELECT o.id, o.user_id, o.brand, o.model, o.year, o.license_plate, o.color, o.seats, o.transmission, o.fuel_type, o.city, o.address, o.price_per_day, o.description, o.images, o.status, o.reject_reason, o.created_at, u.name, u.phone, COALESCE(o.available_from, ''), COALESCE(o.available_to, '')
		FROM owner_registrations o JOIN users u ON o.user_id = u.user_id ORDER BY o.created_at DESC`
	rows, err := r.db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var regs []*entities.OwnerRegistration
	for rows.Next() {
		var reg entities.OwnerRegistration
		var imagesJSON string
		var rejectReason *string
		err := rows.Scan(
			&reg.ID, &reg.UserID, &reg.Brand, &reg.Model, &reg.Year, &reg.LicensePlate,
			&reg.Color, &reg.Seats, &reg.Transmission, &reg.FuelType, &reg.City,
			&reg.Address, &reg.PricePerDay, &reg.Description, &imagesJSON, &reg.Status, &rejectReason, &reg.CreatedAt,
			&reg.OwnerName, &reg.OwnerPhone, &reg.AvailableFrom, &reg.AvailableTo,
		)
		if err != nil {
			return nil, err
		}
		json.Unmarshal([]byte(imagesJSON), &reg.Images)
		if rejectReason != nil {
			reg.RejectReason = *rejectReason
		}
		regs = append(regs, &reg)
	}
	return regs, nil
}

func (r *ownerRegistrationRepository) UpdateStatus(id int, status, reason string) error {
	// Update the registration status
	query := `UPDATE owner_registrations SET status = $1, reject_reason = $2 WHERE id = $3`
	_, err := r.db.Exec(query, status, reason, id)
	if err != nil {
		return err
	}

	// When approved, create the actual vehicle in the system
	if status == "approved" {
		return r.createVehicleFromRegistration(id)
	}
	return nil
}

// createVehicleFromRegistration creates vehicle_model, location, and vehicle records
// from an approved owner registration so the vehicle appears on the platform.
func (r *ownerRegistrationRepository) createVehicleFromRegistration(regID int) error {
	// 1. Fetch the registration data
	var reg entities.OwnerRegistration
	var imagesJSON string
	err := r.db.QueryRow(
		`SELECT id, user_id, brand, model, year, license_plate, color, seats, transmission, fuel_type, city, address, price_per_day, description, images, available_from, available_to
		 FROM owner_registrations WHERE id = $1`, regID,
	).Scan(&reg.ID, &reg.UserID, &reg.Brand, &reg.Model, &reg.Year, &reg.LicensePlate,
		&reg.Color, &reg.Seats, &reg.Transmission, &reg.FuelType, &reg.City,
		&reg.Address, &reg.PricePerDay, &reg.Description, &imagesJSON, &reg.AvailableFrom, &reg.AvailableTo)
	if err != nil {
		return fmt.Errorf("fetch registration %d: %w", regID, err)
	}
	json.Unmarshal([]byte(imagesJSON), &reg.Images)

	// Check if vehicle with same license plate already exists (prevent duplicates on re-approval)
	var existingCount int
	r.db.QueryRow(`SELECT COUNT(*) FROM vehicles WHERE license_plate = $1`, reg.LicensePlate).Scan(&existingCount)
	if existingCount > 0 {
		return nil // Vehicle already created, skip
	}

	// Parse seats (default to 5 if invalid)
	seatsInt := 5
	if s, err := strconv.Atoi(reg.Seats); err == nil && s > 0 {
		seatsInt = s
	}

	// Determine vehicle type from fuel_type
	vehicleType := "sedan"
	if reg.FuelType == "electric" {
		vehicleType = "electric"
	}

	// 2. Find or create vehicle_model
	var modelID int
	// Try to find exact match first without year
	err = r.db.QueryRow(
		`SELECT vehicle_model_id FROM vehicle_models WHERE brand = $1 AND name = $2`,
		reg.Brand, reg.Model,
	).Scan(&modelID)
	
	if err != nil {
		// Try with year
		modelName := reg.Model + " " + reg.Year
		err = r.db.QueryRow(
			`SELECT vehicle_model_id FROM vehicle_models WHERE brand = $1 AND name = $2`,
			reg.Brand, modelName,
		).Scan(&modelID)
		
		if err != nil {
			// Model doesn't exist, create it with reasonable defaults
			err = r.db.QueryRow(
				`INSERT INTO vehicle_models (name, brand, seats, horsepower, range_km, trunk_capacity, airbags, vehicle_type, transmission)
				 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING vehicle_model_id`,
				modelName, reg.Brand, seatsInt, 200, 400, 450, 6, vehicleType, reg.Transmission,
			).Scan(&modelID)
			if err != nil {
				return fmt.Errorf("create vehicle model: %w", err)
			}
		}
	}

	// 3. Find or create location
	var locationID int
	err = r.db.QueryRow(
		`SELECT location_id FROM locations WHERE city = $1 AND address = $2`,
		reg.City, reg.Address,
	).Scan(&locationID)
	if err != nil {
		// Location doesn't exist, create it with default coordinates (Hanoi center)
		locationName := reg.City
		if reg.Address != "" {
			locationName = reg.Address
		}
		lat, lng := geocodeAddress(reg.Address, reg.City)

		err = r.db.QueryRow(
			`INSERT INTO locations (name, address, city, latitude, longitude) 
			 VALUES ($1, $2, $3, $4, $5) RETURNING location_id`,
			locationName, reg.Address, reg.City, lat, lng,
		).Scan(&locationID)
		if err != nil {
			return fmt.Errorf("create location: %w", err)
		}
	}

	// 4. Create the vehicle record with owner_id
	var vehicleID int
	
	// Convert available dates to NULL if empty string to avoid db type issues if it's timestamp
	// Wait, available_from in vehicles is usually a timestamp. But in db schema it is timestamp or varchar?
	// It's likely varchar or timestamp. Let's pass it as is or nil if empty.
	var availFrom, availTo interface{}
	availFrom = reg.AvailableFrom
	availTo = reg.AvailableTo
	if reg.AvailableFrom == "" { availFrom = nil }
	if reg.AvailableTo == "" { availTo = nil }

	err = r.db.QueryRow(
		`INSERT INTO vehicles (vehicle_model_id, license_plate, status, battery_level, battery_health, location_id, owner_id, available_from, available_to)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING vehicle_id`,
		modelID, reg.LicensePlate, "available", 100, 100, locationID, reg.UserID, availFrom, availTo,
	).Scan(&vehicleID)
	if err != nil {
		return fmt.Errorf("create vehicle: %w", err)
	}

	// 5. Save images to vehicle_images
	for _, img := range reg.Images {
		if img.URL != "" {
			r.db.Exec(
				`INSERT INTO vehicle_images (vehicle_model_id, image_url) VALUES ($1, $2)`,
				modelID, img.URL,
			)
		}
	}

	// 6. Create pricing records for the vehicle model if none exist
	var pricingCount int
	r.db.QueryRow(`SELECT COUNT(*) FROM pricing WHERE vehicle_model_id = $1`, modelID).Scan(&pricingCount)
	if pricingCount == 0 && reg.PricePerDay > 0 {
		// Fetch all rental plans
		rows, err := r.db.Query(`SELECT rental_plan_id, duration_type, name FROM rental_plans`)
		if err == nil {
			defer rows.Close()
			for rows.Next() {
				var planID int
				var durationType, planName string
				if err := rows.Scan(&planID, &durationType, &planName); err == nil {
					price := reg.PricePerDay
					if durationType == "hour" {
						if planName == "Gói 4h" {
							price = reg.PricePerDay * 0.5
						} else if planName == "Gói 8h" {
							price = reg.PricePerDay * 0.75
						} else {
							price = reg.PricePerDay * 0.6
						}
					}
					r.db.Exec(
						`INSERT INTO pricing (vehicle_model_id, rental_plan_id, price) VALUES ($1, $2, $3)`,
						modelID, planID, price,
					)
				}
			}
		}
	}

	return nil
}
