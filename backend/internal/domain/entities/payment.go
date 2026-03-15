package entities

import "time"

// Payment represents the payments table.
type Payment struct {
	PaymentID     int        `json:"payment_id"`
	BookingID     int        `json:"booking_id"`
	Amount        float64    `json:"amount"`
	PaymentMethod string     `json:"payment_method"`
	PaymentStatus string     `json:"payment_status"`
	PaidAt        *time.Time `json:"paid_at"`
}
