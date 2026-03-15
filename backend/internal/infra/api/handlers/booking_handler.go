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

// GetBookingHandler returns a handler for retrieving a booking by ID.
func GetBookingHandler(bookingSvc *service.BookingService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid booking id")
			return
		}

		b, err := bookingSvc.GetBooking(id)
		if err != nil {
			log.Warn("get booking %d: %v", id, err)
			response.WriteError(w, http.StatusNotFound, "booking not found")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToBookingResponse(b))
	}
}

// CreateBookingHandler returns a handler for creating a new booking.
func CreateBookingHandler(bookingSvc *service.BookingService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req dto.CreateBookingRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		b, err := mappers.ToBookingCreateParams(&req)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid time format")
			return
		}

		// Default booking status (can be adjusted to match business rules).
		b.Status = "pending"

		if err := bookingSvc.CreateBooking(&b); err != nil {
			log.Warn("create booking: %v", err)
			response.WriteError(w, http.StatusBadRequest, err.Error())
			return
		}

		response.WriteJSON(w, http.StatusCreated, mappers.ToBookingResponse(&b))
	}
}
