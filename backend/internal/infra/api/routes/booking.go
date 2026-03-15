package routes

import (
	"greencar/internal/infra/api/handlers"
	"greencar/internal/service"
	"greencar/pkg/logger"

	"github.com/go-chi/chi/v5"
)

// RegisterBookingRoutes registers all booking-related routes under the given router.
func RegisterBookingRoutes(r chi.Router, bookingSvc *service.BookingService, log *logger.Logger) {
	r.Get("/", handlers.ListBookingsHandler(bookingSvc, log))
	r.Post("/", handlers.CreateBookingHandler(bookingSvc, log))

	r.Route("/{id}", func(r chi.Router) {
		r.Get("/", handlers.GetBookingHandler(bookingSvc, log))
		r.Put("/", handlers.UpdateBookingHandler(bookingSvc, log))
		r.Delete("/", handlers.DeleteBookingHandler(bookingSvc, log))
	})
}
