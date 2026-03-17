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

func (r *vehicleDetailRepository) GetByVehicleID(id int) (*entities.VehicleDetail, error) {
	// Load vehicle
	var v entities.Vehicle
	if err := r.db.QueryRow(
		`SELECT vehicle_id, vehicle_model_id, license_plate, status, battery_level, battery_health, location_id FROM vehicles WHERE vehicle_id = $1`,
		id,
	).Scan(&v.VehicleID, &v.VehicleModelID, &v.LicensePlate, &v.Status, &v.BatteryLevel, &v.BatteryHealth, &v.LocationID); err != nil {
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

	// Load reviews
	reviews := make([]*entities.Review, 0)
	reviewRows, err := r.db.Query(`SELECT review_id, user_id, vehicle_model_id, booking_id, rating, comment, created_at FROM reviews WHERE vehicle_model_id = $1 ORDER BY created_at DESC`, v.VehicleModelID)
	if err != nil {
		return nil, err
	}
	defer reviewRows.Close()
	for reviewRows.Next() {
		var rview entities.Review
		if err := reviewRows.Scan(&rview.ReviewID, &rview.UserID, &rview.VehicleModelID, &rview.BookingID, &rview.Rating, &rview.Comment, &rview.CreatedAt); err != nil {
			return nil, err
		}
		reviews = append(reviews, &rview)
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

	// Determine availability for the current time (vehicle is unavailable if there's an overlapping active booking)
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
		Specs:    specs,
		Pricing:  pricing,
		Reviews:  reviews,
		Meta: &entities.VehicleMeta{
			AvgRating:   avgRating,
			ReviewCount: reviewCount,
			Available:   available,
		},
	}, nil
}
