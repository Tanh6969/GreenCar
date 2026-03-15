package api

import (
	"net/http"

	"greencar/internal/infra/api/handlers"
	"greencar/internal/infra/api/routes"
	"greencar/internal/service"
	"greencar/pkg/logger"

	"github.com/go-chi/chi/v5"
)

// NewRouter creates an HTTP handler with all API routes wired.
func NewRouter(userSvc *service.UserService, vehicleSvc *service.VehicleService, bookingSvc *service.BookingService, log *logger.Logger) http.Handler {
	r := chi.NewRouter()

	r.Get("/health", handlers.HealthHandler())

	r.Route("/users", func(r chi.Router) {
		routes.RegisterUserRoutes(r, userSvc, log)
	})

	r.Route("/vehicles", func(r chi.Router) {
		routes.RegisterVehicleRoutes(r, vehicleSvc, log)
	})

	r.Route("/bookings", func(r chi.Router) {
		routes.RegisterBookingRoutes(r, bookingSvc, log)
	})

	return r
}
