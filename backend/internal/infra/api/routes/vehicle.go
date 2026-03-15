package routes

import (
	"greencar/internal/infra/api/handlers"
	"greencar/internal/service"
	"greencar/pkg/logger"

	"github.com/go-chi/chi/v5"
)

// RegisterVehicleRoutes registers all vehicle-related routes under the given router.
func RegisterVehicleRoutes(r chi.Router, vehicleSvc *service.VehicleService, log *logger.Logger) {
	r.Get("/", handlers.ListVehiclesHandler(vehicleSvc, log))
	r.Post("/", handlers.CreateVehicleHandler(vehicleSvc, log))

	r.Route("/{id}", func(r chi.Router) {
		r.Get("/", handlers.GetVehicleHandler(vehicleSvc, log))
		r.Put("/", handlers.UpdateVehicleHandler(vehicleSvc, log))
		r.Delete("/", handlers.DeleteVehicleHandler(vehicleSvc, log))
	})
}
