package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"greencar/internal/infra/api/dto"
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

// GetVehicleDetailHandler returns a handler for retrieving a vehicle's detail view.
func GetVehicleDetailHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid vehicle id")
			return
		}
		v, err := vehicleSvc.GetVehicleDetail(id)
		if err != nil {
			log.Warn("get vehicle detail %d: %v", id, err)
			response.WriteError(w, http.StatusNotFound, "vehicle not found")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToVehicleDetailResponse(v))
	}
}

// ListVehiclesHandler returns a handler for listing vehicles with pagination.
func ListVehiclesHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query()
		limit := 20
		offset := 0
		if l := q.Get("limit"); l != "" {
			if v, err := strconv.Atoi(l); err == nil && v > 0 {
				limit = v
			}
		}
		if o := q.Get("offset"); o != "" {
			if v, err := strconv.Atoi(o); err == nil && v >= 0 {
				offset = v
			}
		}

		vehicles, err := vehicleSvc.ListVehicles(limit, offset)
		if err != nil {
			log.Warn("list vehicles: %v", err)
			response.WriteError(w, http.StatusInternalServerError, "failed to list vehicles")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToVehicleResponses(vehicles))
	}
}

// CreateVehicleHandler returns a handler for creating a vehicle.
func CreateVehicleHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req dto.CreateVehicleRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		v := mappers.ToVehicleCreateParams(&req)
		if err := vehicleSvc.CreateVehicle(&v); err != nil {
			log.Warn("create vehicle: %v", err)
			response.WriteError(w, http.StatusBadRequest, err.Error())
			return
		}
		response.WriteJSON(w, http.StatusCreated, mappers.ToVehicleResponse(&v))
	}
}

// UpdateVehicleHandler returns a handler for updating a vehicle by ID.
func UpdateVehicleHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid vehicle id")
			return
		}

		var req dto.UpdateVehicleRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		v := mappers.ToVehicleUpdateParams(id, &req)
		if err := vehicleSvc.UpdateVehicle(&v); err != nil {
			log.Warn("update vehicle %d: %v", id, err)
			response.WriteError(w, http.StatusBadRequest, err.Error())
			return
		}

		updated, err := vehicleSvc.GetVehicle(id)
		if err != nil {
			log.Warn("get vehicle after update %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to retrieve updated vehicle")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToVehicleResponse(updated))
	}
}

// DeleteVehicleHandler returns a handler for deleting a vehicle by ID.
func DeleteVehicleHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid vehicle id")
			return
		}

		if err := vehicleSvc.DeleteVehicle(id); err != nil {
			log.Warn("delete vehicle %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to delete vehicle")
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}
