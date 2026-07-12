package repository

import (
	"database/sql"
	"sync"
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
		       COALESCE((SELECT price FROM pricing WHERE vehicle_model_id = v.vehicle_model_id AND rental_plan_id = 1 LIMIT 1), 0) AS price_4h,
			   (SELECT COUNT(*) FROM bookings b WHERE b.vehicle_id = v.vehicle_id AND b.status IN ('completed', 'paid')) AS trip_count,
			   0 AS revenue,
			   (SELECT COALESCE(AVG(rv.rating), 0) FROM reviews rv JOIN bookings b ON b.booking_id = rv.booking_id WHERE b.vehicle_id = v.vehicle_id) AS avg_rating,
			   COALESCE((SELECT MAX(discount_percent) FROM vehicle_pricing_rules WHERE vehicle_id = v.vehicle_id AND is_active = true AND rule_type IN ('promo', 'multi_day') AND promo_start_date <= CURRENT_DATE AND promo_end_date >= CURRENT_DATE), 0) AS promo_discount,
			   (SELECT MAX(promo_end_date) FROM vehicle_pricing_rules WHERE vehicle_id = v.vehicle_id AND is_active = true AND rule_type IN ('promo', 'multi_day') AND promo_start_date <= CURRENT_DATE AND promo_end_date >= CURRENT_DATE) AS promo_end_date
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
		var tripCount int
		var revenue, avgRating, promoDiscount float64
		var promoEndDate *time.Time
		err := rows.Scan(
			&v.VehicleID, &v.VehicleModelID, &v.LicensePlate, &v.Status, &v.BatteryLevel, &v.BatteryHealth, &v.LocationID, &v.OwnerID, &v.AvailableFrom, &v.AvailableTo,
			&m.VehicleModelID, &m.Name, &m.Brand, &m.Seats, &m.Horsepower, &m.RangeKM, &m.TrunkCapacity, &m.Airbags, &m.VehicleType, &m.Transmission,
			&loc.LocationID, &loc.Name, &loc.Address, &loc.City, &loc.Latitude, &loc.Longitude,
			&imageURL, &price24h, &price4h, &tripCount, &revenue, &avgRating, &promoDiscount, &promoEndDate,
		)
		if err != nil {
			return nil, err
		}
		cards = append(cards, &entities.VehicleCard{
			Vehicle:       &v,
			Model:         &m,
			Location:      &loc,
			ImageURL:      imageURL,
			Price24h:      price24h,
			Price4h:       price4h,
			TripCount:     tripCount,
			Revenue:       revenue,
			AvgRating:     avgRating,
			PromoDiscount: promoDiscount,
			PromoEndDate:  promoEndDate,
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
		       COALESCE((SELECT price FROM pricing WHERE vehicle_model_id = v.vehicle_model_id AND rental_plan_id = 1 LIMIT 1), 0) AS price_4h,
			   (SELECT COUNT(*) FROM bookings b WHERE b.vehicle_id = v.vehicle_id AND b.status IN ('completed', 'paid')) AS trip_count,
			   (SELECT COALESCE(SUM(b.total_price), 0) FROM bookings b WHERE b.vehicle_id = v.vehicle_id AND b.status IN ('completed', 'paid')) AS revenue,
			   (SELECT COALESCE(AVG(rv.rating), 0) FROM reviews rv JOIN bookings b ON b.booking_id = rv.booking_id WHERE b.vehicle_id = v.vehicle_id) AS avg_rating,
			   COALESCE((SELECT MAX(discount_percent) FROM vehicle_pricing_rules WHERE vehicle_id = v.vehicle_id AND is_active = true AND rule_type IN ('promo', 'multi_day') AND promo_start_date <= CURRENT_DATE AND promo_end_date >= CURRENT_DATE), 0) AS promo_discount,
			   (SELECT MAX(promo_end_date) FROM vehicle_pricing_rules WHERE vehicle_id = v.vehicle_id AND is_active = true AND rule_type IN ('promo', 'multi_day') AND promo_start_date <= CURRENT_DATE AND promo_end_date >= CURRENT_DATE) AS promo_end_date
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
		var tripCount int
		var revenue, avgRating, promoDiscount float64
		var promoEndDate *time.Time
		err := rows.Scan(
			&v.VehicleID, &v.VehicleModelID, &v.LicensePlate, &v.Status, &v.BatteryLevel, &v.BatteryHealth, &v.LocationID, &v.OwnerID, &v.AvailableFrom, &v.AvailableTo,
			&m.VehicleModelID, &m.Name, &m.Brand, &m.Seats, &m.Horsepower, &m.RangeKM, &m.TrunkCapacity, &m.Airbags, &m.VehicleType, &m.Transmission,
			&loc.LocationID, &loc.Name, &loc.Address, &loc.City, &loc.Latitude, &loc.Longitude,
			&imageURL, &price24h, &price4h, &tripCount, &revenue, &avgRating, &promoDiscount, &promoEndDate,
		)
		if err != nil {
			return nil, err
		}
		cards = append(cards, &entities.VehicleCard{
			Vehicle:       &v,
			Model:         &m,
			Location:      &loc,
			ImageURL:      imageURL,
			Price24h:      price24h,
			Price4h:       price4h,
			TripCount:     tripCount,
			Revenue:       revenue,
			AvgRating:     avgRating,
			PromoDiscount: promoDiscount,
			PromoEndDate:  promoEndDate,
		})
	}
	return cards, rows.Err()
}

func (r *vehicleDetailRepository) GetByVehicleID(id int) (*entities.VehicleDetail, error) {
	// Load vehicle, model, location, and basic owner info in a single round trip
	var v entities.Vehicle
	var m entities.VehicleModel
	var loc entities.Location
	var ownerName, ownerPhone string
	var ownerIDVal sql.NullInt64

	query := `
		SELECT 
			v.vehicle_id, v.vehicle_model_id, v.license_plate, v.status, v.battery_level, v.battery_health, v.location_id, v.owner_id, v.available_from, v.available_to,
			m.vehicle_model_id, m.name, m.brand, m.seats, m.horsepower, m.range_km, m.trunk_capacity, m.airbags, m.vehicle_type, m.transmission,
			l.location_id, l.name, l.address, l.city, l.latitude, l.longitude,
			COALESCE(u.name, ''), COALESCE(u.phone, '')
		FROM vehicles v
		JOIN vehicle_models m ON m.vehicle_model_id = v.vehicle_model_id
		JOIN locations l ON l.location_id = v.location_id
		LEFT JOIN users u ON u.user_id = v.owner_id
		WHERE v.vehicle_id = $1`

	err := r.db.QueryRow(query, id).Scan(
		&v.VehicleID, &v.VehicleModelID, &v.LicensePlate, &v.Status, &v.BatteryLevel, &v.BatteryHealth, &v.LocationID, &ownerIDVal, &v.AvailableFrom, &v.AvailableTo,
		&m.VehicleModelID, &m.Name, &m.Brand, &m.Seats, &m.Horsepower, &m.RangeKM, &m.TrunkCapacity, &m.Airbags, &m.VehicleType, &m.Transmission,
		&loc.LocationID, &loc.Name, &loc.Address, &loc.City, &loc.Latitude, &loc.Longitude,
		&ownerName, &ownerPhone,
	)
	if err != nil {
		return nil, err
	}
	if ownerIDVal.Valid {
		v.OwnerID = int(ownerIDVal.Int64)
	}

	var owner entities.OwnerPublic
	if v.OwnerID > 0 {
		owner.UserID = v.OwnerID
		owner.Name = ownerName
		owner.Phone = ownerPhone
	}

	var images []*entities.VehicleImage
	var features []*entities.VehicleFeature
	var specs []*entities.VehicleSpec
	var pricing []*entities.VehiclePricing
	var reviews []*entities.Review
	var activeBookings []*entities.TimeRange
	var available bool

	var wg sync.WaitGroup
	var errs = make(chan error, 10)

	// Task 3: Load owner public info stats (batched queries)
	if v.OwnerID > 0 {
		wg.Add(1)
		go func() {
			defer wg.Done()
			var tripCount, totalBookings, rejectedBookings, totalConvos, repliedConvos int
			var avgRating float64
			err := r.db.QueryRow(
				`SELECT 
					(SELECT COUNT(*) FROM bookings b JOIN vehicles vv ON vv.vehicle_id = b.vehicle_id WHERE vv.owner_id = $1 AND b.status IN ('completed', 'paid')) AS trip_count,
					(SELECT COALESCE(AVG(rv.rating),0.0) FROM reviews rv JOIN vehicles vv ON vv.vehicle_model_id = rv.vehicle_model_id WHERE vv.owner_id = $1) AS avg_rating,
					(SELECT COUNT(*) FROM bookings b JOIN vehicles vv ON vv.vehicle_id = b.vehicle_id WHERE vv.owner_id = $1) AS total_bookings,
					(SELECT COUNT(*) FROM bookings b JOIN vehicles vv ON vv.vehicle_id = b.vehicle_id WHERE vv.owner_id = $1 AND b.status = 'cancelled' AND (b.owner_note IS NOT NULL AND b.owner_note != '')) AS rejected_bookings,
					(SELECT COUNT(*) FROM conversations WHERE owner_id = $1) AS total_convos,
					(SELECT COUNT(DISTINCT conversation_id) FROM messages WHERE sender_id = $1) AS replied_convos`,
				v.OwnerID,
			).Scan(&tripCount, &avgRating, &totalBookings, &rejectedBookings, &totalConvos, &repliedConvos)
			
			if err != nil {
				// Do not block the page if stats fail, just log or skip
				return
			}
			owner.TripCount = tripCount
			owner.AvgRating = avgRating
			if totalBookings > 0 {
				owner.ApprovalRate = float64(totalBookings-rejectedBookings) / float64(totalBookings) * 100
			} else {
				owner.ApprovalRate = 100
			}
			if totalConvos > 0 {
				owner.ResponseRate = float64(repliedConvos) / float64(totalConvos) * 100
			} else {
				owner.ResponseRate = 100
			}
			owner.ResponseTime = "<1h"
		}()
	}

	// Task 4: Load images
	wg.Add(1)
	go func() {
		defer wg.Done()
		rows, err := r.db.Query(`SELECT image_id, vehicle_model_id, image_url FROM vehicle_images WHERE vehicle_model_id = $1 ORDER BY image_id`, v.VehicleModelID)
		if err != nil {
			errs <- err
			return
		}
		defer rows.Close()
		var list []*entities.VehicleImage
		for rows.Next() {
			var img entities.VehicleImage
			if err := rows.Scan(&img.ImageID, &img.VehicleModelID, &img.ImageURL); err != nil {
				errs <- err
				return
			}
			list = append(list, &img)
		}
		images = list
	}()

	// Task 5: Load features
	wg.Add(1)
	go func() {
		defer wg.Done()
		featureRows, err := r.db.Query(
			`SELECT f.feature_id, f.feature_name
			 FROM vehicle_features f
			 JOIN vehicle_model_features mf ON mf.feature_id = f.feature_id
			 WHERE mf.vehicle_model_id = $1 ORDER BY f.feature_id`,
			v.VehicleModelID,
		)
		if err != nil {
			errs <- err
			return
		}
		defer featureRows.Close()
		var list []*entities.VehicleFeature
		for featureRows.Next() {
			var f entities.VehicleFeature
			if err := featureRows.Scan(&f.FeatureID, &f.FeatureName); err != nil {
				errs <- err
				return
			}
			list = append(list, &f)
		}
		features = list
	}()

	// Task 6: Load specs
	wg.Add(1)
	go func() {
		defer wg.Done()
		specRows, err := r.db.Query(`SELECT spec_id, vehicle_model_id, spec_name, spec_value FROM vehicle_specs WHERE vehicle_model_id = $1 ORDER BY spec_id`, v.VehicleModelID)
		if err != nil {
			errs <- err
			return
		}
		defer specRows.Close()
		var list []*entities.VehicleSpec
		for specRows.Next() {
			var s entities.VehicleSpec
			if err := specRows.Scan(&s.SpecID, &s.VehicleModelID, &s.SpecName, &s.SpecValue); err != nil {
				errs <- err
				return
			}
			list = append(list, &s)
		}
		specs = list
	}()

	// Task 7: Load pricing
	wg.Add(1)
	go func() {
		defer wg.Done()
		pricingRows, err := r.db.Query(`
			SELECT p.pricing_id, p.vehicle_model_id, p.rental_plan_id, p.price,
			       r.rental_plan_id, r.name, r.duration_type, r.max_km, r.overtime_price, r.over_km_price
			FROM pricing p
			JOIN rental_plans r ON p.rental_plan_id = r.rental_plan_id
			WHERE p.vehicle_model_id = $1
			ORDER BY p.pricing_id`, v.VehicleModelID)
		if err != nil {
			errs <- err
			return
		}
		defer pricingRows.Close()
		var list []*entities.VehiclePricing
		for pricingRows.Next() {
			var p entities.Pricing
			var rp entities.RentalPlan
			if err := pricingRows.Scan(
				&p.PricingID, &p.VehicleModelID, &p.RentalPlanID, &p.Price,
				&rp.RentalPlanID, &rp.Name, &rp.DurationType, &rp.MaxKM, &rp.OvertimePrice, &rp.OverKMPrice,
			); err != nil {
				errs <- err
				return
			}
			list = append(list, &entities.VehiclePricing{Pricing: &p, RentalPlan: &rp})
		}
		pricing = list
	}()

	// Task 8: Load reviews
	wg.Add(1)
	go func() {
		defer wg.Done()
		reviewRows, err := r.db.Query(
			`SELECT rv.review_id, rv.user_id, COALESCE(u.name,''), rv.vehicle_model_id, rv.booking_id, rv.rating, rv.comment, rv.created_at
			 FROM reviews rv
			 LEFT JOIN users u ON u.user_id = rv.user_id
			 WHERE rv.vehicle_model_id = $1
			 ORDER BY rv.created_at DESC`,
			v.VehicleModelID,
		)
		if err != nil {
			errs <- err
			return
		}
		defer reviewRows.Close()
		var list []*entities.Review
		for reviewRows.Next() {
			var rview entities.Review
			if err := reviewRows.Scan(&rview.ReviewID, &rview.UserID, &rview.ReviewerName, &rview.VehicleModelID, &rview.BookingID, &rview.Rating, &rview.Comment, &rview.CreatedAt); err != nil {
				errs <- err
				return
			}
			list = append(list, &rview)
		}
		reviews = list
	}()

	// Task 9: Load active bookings
	wg.Add(1)
	go func() {
		defer wg.Done()
		bookingRows, err := r.db.Query(
			`SELECT start_time, end_time FROM bookings 
			 WHERE vehicle_id = $1 AND status IN ('pending', 'confirmed', 'active', 'running')
			 AND end_time > NOW()
			 UNION ALL
			 SELECT start_time, end_time FROM vehicle_unavailabilities
			 WHERE vehicle_id = $1 AND end_time > NOW()`,
			id,
		)
		if err != nil {
			// Do not block the whole page if this query fails
			return
		}
		defer bookingRows.Close()
		var list []*entities.TimeRange
		for bookingRows.Next() {
			var start, end time.Time
			if err := bookingRows.Scan(&start, &end); err == nil {
				list = append(list, &entities.TimeRange{
					StartTime: start.Format(time.RFC3339),
					EndTime:   end.Format(time.RFC3339),
				})
			}
		}
		activeBookings = list
	}()

	// Task 10: Load availability status
	wg.Add(1)
	go func() {
		defer wg.Done()
		now := time.Now().UTC()
		_ = r.db.QueryRow(
			`SELECT NOT EXISTS (
				SELECT 1
				FROM bookings
				WHERE vehicle_id = $1
				  AND status != 'cancelled'
				  AND start_time < $2
				  AND end_time > $2
			) AND NOT EXISTS (
				SELECT 1
				FROM vehicle_unavailabilities
				WHERE vehicle_id = $1
				  AND start_time < $2
				  AND end_time > $2
			)`,
			v.VehicleID, now,
		).Scan(&available)
	}()

	wg.Wait()

	// Check if any critical tasks failed
	select {
	case err := <-errs:
		return nil, err
	default:
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
		OwnerInfo:      &owner,
		ActiveBookings: activeBookings,
	}, nil
}
