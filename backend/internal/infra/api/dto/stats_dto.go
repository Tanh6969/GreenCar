package dto

type StatsResponse struct {
	TotalUsers             int64   `json:"total_users"`
	TotalBookings          int64   `json:"total_bookings"`
	TotalRevenue           float64 `json:"total_revenue"`
	AverageBookingDuration float64 `json:"average_booking_duration_days"`
	VehicleUtilizationRate float64 `json:"vehicle_utilization_rate"`
	TotalVehicles          int64   `json:"total_vehicles"`
	ActiveBookings         int64   `json:"active_bookings"`
	CompletedBookings      int64   `json:"completed_bookings"`
}
