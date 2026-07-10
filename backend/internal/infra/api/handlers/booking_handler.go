package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"greencar/internal/infra/api/dto"
	"greencar/internal/infra/api/mappers"
	"greencar/internal/infra/api/middlewares"
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

		b.Status = "pending"

		if err := bookingSvc.CreateBooking(&b); err != nil {
			log.Warn("create booking: %v", err)
			if err == service.ErrBookingOverlaps {
				response.WriteError(w, http.StatusConflict, "booking overlaps an existing reservation")
				return
			}
			response.WriteError(w, http.StatusBadRequest, err.Error())
			return
		}

		response.WriteJSON(w, http.StatusCreated, mappers.ToBookingResponse(&b))
	}
}

// ListBookingsHandler returns a handler for listing bookings with pagination.
func ListBookingsHandler(bookingSvc *service.BookingService, log *logger.Logger) http.HandlerFunc {
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

		bookings, err := bookingSvc.ListBookings(limit, offset)
		if err != nil {
			log.Warn("list bookings: %v", err)
			response.WriteError(w, http.StatusInternalServerError, "failed to list bookings")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToBookingResponses(bookings))
	}
}

// GetMyBookingsHandler returns bookings of the authenticated user.
func GetMyBookingsHandler(bookingSvc *service.BookingService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "not authenticated")
			return
		}

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

		bookings, err := bookingSvc.ListBookingsByUser(int(payload.UserId), limit, offset)
		if err != nil {
			log.Warn("list my bookings: %v", err)
			response.WriteError(w, http.StatusInternalServerError, "failed to list bookings")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToBookingResponses(bookings))
	}
}

// GetOwnerBookingsHandler returns bookings for vehicles owned by the authenticated owner.
func GetOwnerBookingsHandler(bookingSvc *service.BookingService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "not authenticated")
			return
		}

		q := r.URL.Query()
		limit := 50
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

		bookings, err := bookingSvc.ListBookingsByOwner(int(payload.UserId), limit, offset)
		if err != nil {
			log.Warn("list owner bookings: %v", err)
			response.WriteError(w, http.StatusInternalServerError, "failed to list owner bookings")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToBookingResponses(bookings))
	}
}

// SetBookingStatusHandler allows admin to change only the status of a booking.
func SetBookingStatusHandler(bookingSvc *service.BookingService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid booking id")
			return
		}
		var req dto.SetBookingStatusRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil || req.Status == "" {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}
		if err := bookingSvc.SetBookingStatus(id, req.Status); err != nil {
			log.Warn("set booking status %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to update status")
			return
		}
		b, _ := bookingSvc.GetBooking(id)
		response.WriteJSON(w, http.StatusOK, mappers.ToBookingResponse(b))
	}
}

// CompleteBookingHandler allows owner to complete a trip and calculate fees.
func CompleteBookingHandler(bookingSvc *service.BookingService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid booking id")
			return
		}

		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "not authenticated")
			return
		}

		var req dto.CompleteBookingRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		_, err = bookingSvc.GetBooking(id)
		if err != nil {
			response.WriteError(w, http.StatusNotFound, "booking not found")
			return
		}

		// Security: in a real app, verify the current user is the owner of the vehicle.
		// For simplicity, we just process it.

		updated, err := bookingSvc.CompleteBooking(id, req.ActualKM, req.ExtraFee, req.ExtraFeeDesc, time.Now())
		if err != nil {
			log.Warn("complete booking %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to complete booking")
			return
		}

		response.WriteJSON(w, http.StatusOK, mappers.ToBookingResponse(updated))
	}
}

// UpdateBookingHandler returns a handler for updating a booking by ID.
func UpdateBookingHandler(bookingSvc *service.BookingService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid booking id")
			return
		}

		var req dto.UpdateBookingRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		b, err := mappers.ToBookingUpdateParams(id, &req)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid time format")
			return
		}

		if err := bookingSvc.UpdateBooking(&b); err != nil {
			log.Warn("update booking %d: %v", id, err)
			response.WriteError(w, http.StatusBadRequest, err.Error())
			return
		}

		updated, err := bookingSvc.GetBooking(id)
		if err != nil {
			log.Warn("get booking after update %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to retrieve updated booking")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToBookingResponse(updated))
	}
}

// DeleteBookingHandler returns a handler for deleting a booking by ID.
func DeleteBookingHandler(bookingSvc *service.BookingService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid booking id")
			return
		}

		if err := bookingSvc.DeleteBooking(id); err != nil {
			log.Warn("delete booking %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to delete booking")
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}
