package middlewares

import (
	"net/http"
	"time"

	"github.com/go-chi/httprate"
)

// RateLimitMiddleware creates a rate limiting middleware
// Limit: requests per minute per IP
func RateLimitMiddleware(requestsPerMinute int) func(http.Handler) http.Handler {
	return httprate.LimitByIP(requestsPerMinute, 1*time.Minute)
}
