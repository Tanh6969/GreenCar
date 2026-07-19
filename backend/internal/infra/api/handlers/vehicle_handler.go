package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"greencar/internal/domain/entities"
	"greencar/internal/infra/api/dto"
	"greencar/internal/infra/api/mappers"
	"greencar/internal/infra/api/middlewares"
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
		start := time.Now()
		v, err := vehicleSvc.GetVehicleDetail(id)
		if err != nil {
			log.Warn("get vehicle detail %d: %v", id, err)
			response.WriteError(w, http.StatusNotFound, "vehicle not found")
			return
		}
		log.Info("GetVehicleDetail DB processing took: %v", time.Since(start))
		response.WriteJSON(w, http.StatusOK, mappers.ToVehicleDetailResponse(v))
	}
}

// ListVehicleCardsHandler returns lightweight vehicle cards with model and location joined.
func ListVehicleCardsHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		q := r.URL.Query()
		limit, offset := 100, 0
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

		cards, err := vehicleSvc.ListVehicleCards(limit, offset)
		if err != nil {
			log.Warn("list vehicle cards: %v", err)
			response.WriteError(w, http.StatusInternalServerError, "failed to list vehicles")
			return
		}
		out := make([]*dto.VehicleCardResponse, 0, len(cards))
		for _, c := range cards {
			out = append(out, mappers.ToVehicleCardResponse(c))
		}
		response.WriteJSON(w, http.StatusOK, out)
	}
}

// ListVehiclesHandler returns a handler for listing vehicles with pagination.
func ListVehiclesHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		page, limit, offset := response.ParsePagination(r, 20)

		q := r.URL.Query()
		// Optional availability filter (find free vehicles).
		var start, end *time.Time
		var locationID, modelID *int
		if s := q.Get("start"); s != "" || q.Get("end") != "" {
			if s == "" || q.Get("end") == "" {
				response.WriteError(w, http.StatusBadRequest, "both start and end are required for availability search")
				return
			}
			parsedStart, err := time.Parse(time.RFC3339, s)
			if err != nil {
				response.WriteError(w, http.StatusBadRequest, "invalid start time format")
				return
			}
			parsedEnd, err := time.Parse(time.RFC3339, q.Get("end"))
			if err != nil {
				response.WriteError(w, http.StatusBadRequest, "invalid end time format")
				return
			}
			start = &parsedStart
			end = &parsedEnd
		}

		if loc := q.Get("location_id"); loc != "" {
			if v, err := strconv.Atoi(loc); err == nil {
				locationID = &v
			}
		}
		if mid := q.Get("model_id"); mid != "" {
			if v, err := strconv.Atoi(mid); err == nil {
				modelID = &v
			}
		}

		var vehicles []*entities.Vehicle
		var total int
		var err error
		if start != nil && end != nil {
			vehicles, err = vehicleSvc.ListAvailableVehicles(start, end, locationID, modelID, limit, offset)
			total = len(vehicles)
		} else {
			vehicles, total, err = vehicleSvc.ListVehicles(limit, offset)
		}
		vehicleResponses := mappers.ToVehicleResponses(vehicles)

		if err != nil {
			log.Warn("list vehicles: %v", err)
			response.WriteError(w, http.StatusInternalServerError, "failed to list vehicles")
			return
		}
		response.WritePaginatedJSON(w, http.StatusOK, vehicleResponses, page, limit, total)
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
		if req.ImageURL != "" {
			if err := vehicleSvc.AddVehicleImage(v.VehicleModelID, req.ImageURL); err != nil {
				log.Warn("add vehicle image: %v", err)
			}
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
		if req.ImageURL != "" {
			if err := vehicleSvc.AddVehicleImage(v.VehicleModelID, req.ImageURL); err != nil {
				log.Warn("add vehicle image on update: %v", err)
			}
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

// ListOwnerVehiclesHandler returns lightweight vehicle cards for the authenticated owner.
func ListOwnerVehiclesHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		cards, err := vehicleSvc.ListVehicleCardsByOwnerID(int(payload.UserId))
		if err != nil {
			log.Warn("list owner vehicles: %v", err)
			response.WriteError(w, http.StatusInternalServerError, "failed to list vehicles")
			return
		}
		
		out := make([]*dto.VehicleCardResponse, 0, len(cards))
		for _, c := range cards {
			out = append(out, mappers.ToVehicleCardResponse(c))
		}
		response.WriteJSON(w, http.StatusOK, out)
	}
}

// UpdateVehicleStatusHandler allows the owner to change their vehicle status (available, maintenance).
func UpdateVehicleStatusHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid vehicle id")
			return
		}

		var req struct {
			Status        string  `json:"status"`
			AvailableFrom *string `json:"available_from"`
			AvailableTo   *string `json:"available_to"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		v, err := vehicleSvc.GetVehicle(id)
		if err != nil || v.OwnerID != int(payload.UserId) {
			response.WriteError(w, http.StatusForbidden, "not allowed to update this vehicle")
			return
		}

		v.Status = req.Status
		if req.AvailableFrom != nil {
			v.AvailableFrom = req.AvailableFrom
		}
		if req.AvailableTo != nil {
			v.AvailableTo = req.AvailableTo
		}
		
		if err := vehicleSvc.UpdateVehicle(v); err != nil {
			log.Warn("update vehicle status %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to update vehicle status")
			return
		}

		response.WriteJSON(w, http.StatusOK, map[string]string{"message": "status updated successfully"})
	}
}

// GetVehicleUnavailabilitiesHandler returns all blocked dates for a vehicle
func GetVehicleUnavailabilitiesHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid vehicle id")
			return
		}

		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		v, err := vehicleSvc.GetVehicle(id)
		if err != nil || v.OwnerID != int(payload.UserId) {
			response.WriteError(w, http.StatusForbidden, "not allowed")
			return
		}

		list, err := vehicleSvc.ListVehicleUnavailabilities(id)
		if err != nil {
			log.Warn("list unavailabilities %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to get unavailabilities")
			return
		}
		response.WriteJSON(w, http.StatusOK, list)
	}
}

// AddVehicleUnavailabilityHandler adds a new blocked date range
func AddVehicleUnavailabilityHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid vehicle id")
			return
		}

		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		v, err := vehicleSvc.GetVehicle(id)
		if err != nil || v.OwnerID != int(payload.UserId) {
			response.WriteError(w, http.StatusForbidden, "not allowed")
			return
		}

		var req struct {
			StartTime string `json:"start_time"`
			EndTime   string `json:"end_time"`
			Type      string `json:"type"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		start, err := time.Parse(time.RFC3339, req.StartTime)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid start_time format")
			return
		}
		end, err := time.Parse(time.RFC3339, req.EndTime)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid end_time format")
			return
		}

		u := &entities.VehicleUnavailability{
			VehicleID: id,
			StartTime: start,
			EndTime:   end,
			Type:      req.Type,
		}

		if u.Type == "" {
			u.Type = "blocked"
		}

		if err := vehicleSvc.AddVehicleUnavailability(u); err != nil {
			log.Warn("add unavailability %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to add unavailability")
			return
		}

		response.WriteJSON(w, http.StatusCreated, u)
	}
}

// DeleteVehicleUnavailabilityHandler removes a blocked date range
func DeleteVehicleUnavailabilityHandler(vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid vehicle id")
			return
		}

		uidStr := chi.URLParam(r, "uid")
		uid, err := strconv.Atoi(uidStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid unavailability id")
			return
		}

		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		v, err := vehicleSvc.GetVehicle(id)
		if err != nil || v.OwnerID != int(payload.UserId) {
			response.WriteError(w, http.StatusForbidden, "not allowed")
			return
		}

		if err := vehicleSvc.RemoveVehicleUnavailability(uid); err != nil {
			log.Warn("delete unavailability %d: %v", uid, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to delete unavailability")
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}

