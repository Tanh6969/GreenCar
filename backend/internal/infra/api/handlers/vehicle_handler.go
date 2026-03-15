package handlers

import (
	"net/http"
	"strconv"

	"greencar/internal/infra/api/mappers"
	"greencar/internal/infra/api/response"
	"greencar/internal/service"
	"greencar/pkg/logger"

	"github.com/go-chi/chi/v5"
)

// GetVehicleHandler returns a handler for retrieving a vehicle by ID.
func GetVehicleHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid vehicle id")
			return
		}
		v, err := vehicleSvc.GetVehicle(id)
		if err != nil {
			log.Warn("get vehicle %d: %v", id, err)
			response.WriteError(w, http.StatusNotFound, "vehicle not found")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToVehicleResponse(v))
	}
}
