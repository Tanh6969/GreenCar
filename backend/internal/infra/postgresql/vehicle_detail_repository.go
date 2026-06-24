package repository

import (
	"time"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

type vehicleDetailRepository struct {
	db *database.DB
}

// NewVehicleDetailRepository creates a new repository for vehicle details.
func NewVehicleDetailRepository(db *database.DB) adapters.VehicleDetailRepository {
	return &vehicleDetailRepository{db: db}
}

func (r *vehicleDetailRepository) ListCards(limit, offset int) ([]*entities.VehicleCard, error) {
	query := `
		SELECT v.vehicle_id, v.vehicle_model_id, v.license_plate, v.status, v.battery_level, v.battery_health, v.location_id, COALESCE(v.owner_id, 0), v.available_from, v.available_to,
		       m.vehicle_model_id, m.name, m.brand, m.seats, m.horsepower, m.range_km, m.trunk_capacity, m.airbags, m.vehicle_type, m.transmission,
		       l.location_id, l.name, l.address, l.city, l.latitude, l.longitude,
		       COALESCE((SELECT image_url FROM vehicle_images WHERE vehicle_model_id = v.vehicle_model_id ORDER BY image_id LIMIT 1), '') AS image_url,
		       COALESCE((SELECT price FROM pricing WHERE vehicle_model_id = v.vehicle_model_id AND rental_plan_id = 3 LIMIT 1), 0) AS price_24h,
		       COALESCE((SELECT price FROM pricing WHERE vehicle_model_id = v.vehicle_model_id AND rental_plan_id = 1 LIMIT 1), 0) AS price_4h
		FROM vehicles v
		JOIN vehicle_models m ON m.vehicle_model_id = v.vehicle_model_id
		JOIN locations l ON l.location_id = v.location_id
		ORDER BY v.vehicle_id DESC
		LIMIT $1 OFFSET $2`

	rows, err := r.db.Query(query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cards []*entities.VehicleCard
	for rows.Next() {
		var v entities.Vehicle
		var m entities.VehicleModel
		var loc entities.Location
		var imageURL string
		var price24h, price4h float64
		err := rows.Scan(
			&v.VehicleID, &v.VehicleModelID, &v.LicensePlate, &v.Status, &v.BatteryLevel, &v.BatteryHealth, &v.LocationID, &v.OwnerID, &v.AvailableFrom, &v.AvailableTo,
			&m.VehicleModelID, &m.Name, &m.Brand, &m.Seats, &m.Horsepower, &m.RangeKM, &m.TrunkCapacity, &m.Airbags, &m.VehicleType, &m.Transmission,
			&loc.LocationID, &loc.Name, &loc.Address, &loc.City, &loc.Latitude, &loc.Longitude,
			&imageURL, &price24h, &price4h,
		)
		if err != nil {
			return nil, err
		}
		cards = append(cards, &entities.VehicleCard{
			Vehicle:  &v,
			Model:    &m,
			Location: &loc,
			ImageURL: imageURL,
			Price24h: price24h,
			Price4h:  price4h,
		})
	}
	return cards, rows.Err()
}

func (r *vehicleDetailRepository) ListByOwnerID(ownerID int) ([]*entities.VehicleCard, error) {
	query := `
		SELECT v.vehicle_id, v.vehicle_model_id, v.license_plate, v.status, v.battery_level, v.battery_health, v.location_id, COALESCE(v.owner_id, 0), v.available_from, v.available_to,
		       m.vehicle_model_id, m.name, m.brand, m.seats, m.horsepower, m.range_km, m.trunk_capacity, m.airbags, m.vehicle_type, m.transmission,
		       l.location_id, l.name, l.address, l.city, l.latitude, l.longitude,
		       COALESCE((SELECT image_url FROM vehicle_images WHERE vehicle_model_id = v.vehicle_model_id ORDER BY image_id LIMIT 1), '') AS image_url,
		       COALESCE((SELECT price FROM pricing WHERE vehicle_model_id = v.vehicle_model_id AND rental_plan_id = 3 LIMIT 1), 0) AS price_24h,
		       COALESCE((SELECT price FROM pricing WHERE vehicle_model_id = v.vehicle_model_id AND rental_plan_id = 1 LIMIT 1), 0) AS price_4h
		FROM vehicles v
		JOIN vehicle_models m ON m.vehicle_model_id = v.vehicle_model_id
		JOIN locations l ON l.location_id = v.location_id
		WHERE v.owner_id = $1
		ORDER BY v.vehicle_id`

	rows, err := r.db.Query(query, ownerID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var cards []*entities.VehicleCard
	for rows.Next() {
		var v entities.Vehicle
		var m entities.VehicleModel
		var loc entities.Location
		var imageURL string
		var price24h, price4h float64
		err := rows.Scan(
			&v.VehicleID, &v.VehicleModelID, &v.LicensePlate, &v.Status, &v.BatteryLevel, &v.BatteryHealth, &v.LocationID, &v.OwnerID, &v.AvailableFrom, &v.AvailableTo,
			&m.VehicleModelID, &m.Name, &m.Brand, &m.Seats, &m.Horsepower, &m.RangeKM, &m.TrunkCapacity, &m.Airbags, &m.VehicleType, &m.Transmission,
			&loc.LocationID, &loc.Name, &loc.Address, &loc.City, &loc.Latitude, &loc.Longitude,
			&imageURL, &price24h, &price4h,
		)
		if err != nil {
			return nil, err
		}
		cards = append(cards, &entities.VehicleCard{
			Vehicle:  &v,
			Model:    &m,
			Location: &loc,
			ImageURL: imageURL,
			Price24h: price24h,
			Price4h:  price4h,
		})
	}
	return cards, rows.Err()
}

func (r *vehicleDetailRepository) GetByVehicleID(id int) (*entities.VehicleDetail, error) {
	// Load vehicle (with owner_id)
	var v entities.Vehicle
	if err := r.db.QueryRow(
		`SELECT vehicle_id, vehicle_model_id, license_plate, status, battery_level, battery_health, location_id, COALESCE(owner_id,0), available_from, available_to FROM vehicles WHERE vehicle_id = $1`,
		id,
	).Scan(&v.VehicleID, &v.VehicleModelID, &v.LicensePlate, &v.Status, &v.BatteryLevel, &v.BatteryHealth, &v.LocationID, &v.OwnerID, &v.AvailableFrom, &v.AvailableTo); err != nil {
		return nil, err
	}

	// Load vehicle model
	var m entities.VehicleModel
	if err := r.db.QueryRow(
		`SELECT vehicle_model_id, name, brand, seats, horsepower, range_km, trunk_capacity, airbags, vehicle_type, transmission FROM vehicle_models WHERE vehicle_model_id = $1`,
		v.VehicleModelID,
	).Scan(&m.VehicleModelID, &m.Name, &m.Brand, &m.Seats, &m.Horsepower, &m.RangeKM, &m.TrunkCapacity, &m.Airbags, &m.VehicleType, &m.Transmission); err != nil {
		return nil, err
	}

	// Load location
	var loc entities.Location
	if err := r.db.QueryRow(
		`SELECT location_id, name, address, city, latitude, longitude FROM locations WHERE location_id = $1`,
		v.LocationID,
	).Scan(&loc.LocationID, &loc.Name, &loc.Address, &loc.City, &loc.Latitude, &loc.Longitude); err != nil {
		return nil, err
	}

	// Load owner public info
	var owner entities.OwnerPublic
	if v.OwnerID > 0 {
		var tripCount int
		var avgRating float64
		r.db.QueryRow(
			`SELECT COUNT(*) FROM bookings b
			 JOIN vehicles vv ON vv.vehicle_id = b.vehicle_id
			 WHERE vv.owner_id = $1 AND b.status = 'completed'`,
			v.OwnerID,
		).Scan(&tripCount)
		r.db.QueryRow(
			`SELECT COALESCE(AVG(rv.rating),0.0)
			 FROM reviews rv
			 JOIN vehicles vv ON vv.vehicle_model_id = rv.vehicle_model_id
			 WHERE vv.owner_id = $1`,
			v.OwnerID,
		).Scan(&avgRating)
		r.db.QueryRow(
			`SELECT user_id, name, phone FROM users WHERE user_id = $1`,
			v.OwnerID,
		).Scan(&owner.UserID, &owner.Name, &owner.Phone)
		owner.TripCount = tripCount
		owner.AvgRating = avgRating
	}

	// Load images
	images := make([]*entities.VehicleImage, 0)
	rows, err := r.db.Query(`SELECT image_id, vehicle_model_id, image_url FROM vehicle_images WHERE vehicle_model_id = $1 ORDER BY image_id`, v.VehicleModelID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var img entities.VehicleImage
		if err := rows.Scan(&img.ImageID, &img.VehicleModelID, &img.ImageURL); err != nil {
			return nil, err
		}
		images = append(images, &img)
	}

	// Load features
	features := make([]*entities.VehicleFeature, 0)
	featureRows, err := r.db.Query(
		`SELECT f.feature_id, f.feature_name
		 FROM vehicle_features f
		 JOIN vehicle_model_features mf ON mf.feature_id = f.feature_id
		 WHERE mf.vehicle_model_id = $1 ORDER BY f.feature_id`,
		v.VehicleModelID,
	)
	if err != nil {
		return nil, err
	}
	defer featureRows.Close()
	for featureRows.Next() {
		var f entities.VehicleFeature
		if err := featureRows.Scan(&f.FeatureID, &f.FeatureName); err != nil {
			return nil, err
		}
		features = append(features, &f)
	}

	// Load specs
	specs := make([]*entities.VehicleSpec, 0)
	specRows, err := r.db.Query(`SELECT spec_id, vehicle_model_id, spec_name, spec_value FROM vehicle_specs WHERE vehicle_model_id = $1 ORDER BY spec_id`, v.VehicleModelID)
	if err != nil {
		return nil, err
	}
	defer specRows.Close()
	for specRows.Next() {
		var s entities.VehicleSpec
		if err := specRows.Scan(&s.SpecID, &s.VehicleModelID, &s.SpecName, &s.SpecValue); err != nil {
			return nil, err
		}
		specs = append(specs, &s)
	}

	// Load pricing + rental plan
	pricing := make([]*entities.VehiclePricing, 0)
	pricingRows, err := r.db.Query(`
		SELECT p.pricing_id, p.vehicle_model_id, p.rental_plan_id, p.price,
		       r.rental_plan_id, r.name, r.duration_type, r.max_km, r.overtime_price, r.over_km_price
		FROM pricing p
		JOIN rental_plans r ON p.rental_plan_id = r.rental_plan_id
		WHERE p.vehicle_model_id = $1
		ORDER BY p.pricing_id`, v.VehicleModelID)
	if err != nil {
		return nil, err
	}
	defer pricingRows.Close()
	for pricingRows.Next() {
		var p entities.Pricing
		var rp entities.RentalPlan
		if err := pricingRows.Scan(
			&p.PricingID, &p.VehicleModelID, &p.RentalPlanID, &p.Price,
			&rp.RentalPlanID, &rp.Name, &rp.DurationType, &rp.MaxKM, &rp.OvertimePrice, &rp.OverKMPrice,
		); err != nil {
			return nil, err
		}
		pricing = append(pricing, &entities.VehiclePricing{Pricing: &p, RentalPlan: &rp})
	}

	// Load reviews with reviewer name (JOIN users)
	reviews := make([]*entities.Review, 0)
	reviewRows, err := r.db.Query(
		`SELECT rv.review_id, rv.user_id, COALESCE(u.name,''), rv.vehicle_model_id, rv.booking_id, rv.rating, rv.comment, rv.created_at
		 FROM reviews rv
		 LEFT JOIN users u ON u.user_id = rv.user_id
		 WHERE rv.vehicle_model_id = $1
		 ORDER BY rv.created_at DESC`,
		v.VehicleModelID,
	)
	if err != nil {
		return nil, err
	}
	defer reviewRows.Close()
	for reviewRows.Next() {
		var rview entities.Review
		if err := reviewRows.Scan(&rview.ReviewID, &rview.UserID, &rview.ReviewerName, &rview.VehicleModelID, &rview.BookingID, &rview.Rating, &rview.Comment, &rview.CreatedAt); err != nil {
			return nil, err
		}
		reviews = append(reviews, &rview)
	}

	// Load active bookings (time ranges)
	activeBookings := make([]*entities.TimeRange, 0)
	bookingRows, err := r.db.Query(
		`SELECT start_time, end_time FROM bookings 
		 WHERE vehicle_id = $1 AND status IN ('pending', 'confirmed', 'active', 'running')
		 AND end_time > NOW()`, 
		id,
	)
	if err == nil {
		defer bookingRows.Close()
		for bookingRows.Next() {
			importTime := true
			_ = importTime
			var start, end time.Time
			if err := bookingRows.Scan(&start, &end); err == nil {
				activeBookings = append(activeBookings, &entities.TimeRange{
					StartTime: start.Format(time.RFC3339),
					EndTime:   end.Format(time.RFC3339),
				})
			}
		}
	}

	// Compute meta
	reviewCount := len(reviews)
	avgRating := 0.0
	if reviewCount > 0 {
		total := 0
		for _, r := range reviews {
			total += r.Rating
		}
		avgRating = float64(total) / float64(reviewCount)
	}

	// Determine availability
	now := time.Now().UTC()
	var available bool
	if err := r.db.QueryRow(
		`SELECT NOT EXISTS (
			SELECT 1
			FROM bookings
			WHERE vehicle_id = $1
			  AND status != 'cancelled'
			  AND start_time < $2
			  AND end_time > $2
		)`,
		v.VehicleID, now,
	).Scan(&available); err != nil {
		return nil, err
	}

	return &entities.VehicleDetail{
		Vehicle:  &v,
		Model:    &m,
		Location: &loc,
		Images:   images,
		Features: features,
		Specs:    specs,
		Pricing:  pricing,
		Reviews:  reviews,
		Meta: &entities.VehicleMeta{
			AvgRating:   avgRating,
			ReviewCount: reviewCount,
			Available:   available,
		},
		OwnerInfo: &owner,
		ActiveBookings: activeBookings,
	}, nil
}
