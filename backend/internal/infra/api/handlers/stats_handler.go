package handlers

import (
	"context"
	"database/sql"
	"encoding/json"
	"net/http"

	"greencar/internal/infra/api/dto"
)

type StatsHandler struct {
	db *sql.DB
}

func NewStatsHandler(db *sql.DB) *StatsHandler {
	return &StatsHandler{db: db}
}

func (h *StatsHandler) GetStats(w http.ResponseWriter, r *http.Request) {
	ctx := context.Background()

	stats := &dto.StatsResponse{}

	// Total Users
	err := h.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM users").Scan(&stats.TotalUsers)
	if err != nil {
		http.Error(w, "Failed to get user stats", http.StatusInternalServerError)
		return
	}

	// Total Vehicles
	err = h.db.QueryRowContext(ctx, "SELECT COUNT(*) FROM vehicles").Scan(&stats.TotalVehicles)
	if err != nil {
		http.Error(w, "Failed to get vehicle stats", http.StatusInternalServerError)
		return
	}

	// Total Bookings, Revenue, Active/Completed Bookings
	query := `
		SELECT 
			COUNT(*) as total,
			COALESCE(SUM(total_price), 0) as revenue,
			COALESCE(SUM(CASE WHEN start_date > NOW() THEN 1 ELSE 0 END), 0) as active,
			COALESCE(SUM(CASE WHEN end_date < NOW() THEN 1 ELSE 0 END), 0) as completed
		FROM bookings
		WHERE status != 'cancelled'
	`
	err = h.db.QueryRowContext(ctx, query).Scan(
		&stats.TotalBookings,
		&stats.TotalRevenue,
		&stats.ActiveBookings,
		&stats.CompletedBookings,
	)
	if err != nil {
		http.Error(w, "Failed to get booking stats", http.StatusInternalServerError)
		return
	}

	// Average Booking Duration
	durationQuery := `
		SELECT COALESCE(AVG(EXTRACT(DAY FROM (end_date - start_date))), 0)
		FROM bookings
		WHERE status != 'cancelled'
	`
	err = h.db.QueryRowContext(ctx, durationQuery).Scan(&stats.AverageBookingDuration)
	if err != nil {
		http.Error(w, "Failed to get booking duration", http.StatusInternalServerError)
		return
	}

	// Vehicle Utilization Rate
	utilizationQuery := `
		SELECT CASE 
			WHEN tv.total = 0 THEN 0
			ELSE (CAST(used_vehicles AS NUMERIC) / tv.total) * 100
		END
		FROM (
			SELECT COUNT(DISTINCT vehicle_id) as used_vehicles
			FROM bookings
			WHERE status != 'cancelled' AND end_date >= NOW()
		) bv,
		(SELECT COUNT(*) as total FROM vehicles) tv
	`
	err = h.db.QueryRowContext(ctx, utilizationQuery).Scan(&stats.VehicleUtilizationRate)
	if err != nil {
		http.Error(w, "Failed to get utilization rate", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(stats)
}
