package handlers

import (
	"encoding/json"
	"net/http"

	"greencar/internal/domain/entities"
	"greencar/internal/infra/api/middlewares"
	"greencar/internal/infra/api/response"
	"greencar/internal/service"
	"greencar/pkg/logger"
)

func CreateReviewHandler(reviewSvc *service.ReviewService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		var req struct {
			VehicleModelID int    `json:"vehicle_model_id"`
			BookingID      int    `json:"booking_id"`
			Rating         int    `json:"rating"`
			Comment        string `json:"comment"`
		}

		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request payload")
			return
		}

		if req.Rating < 1 || req.Rating > 5 {
			response.WriteError(w, http.StatusBadRequest, "rating must be between 1 and 5")
			return
		}

		review := &entities.Review{
			UserID:         int(payload.UserId),
			VehicleModelID: req.VehicleModelID,
			BookingID:      req.BookingID,
			Rating:         req.Rating,
			Comment:        req.Comment,
		}

		if err := reviewSvc.CreateReview(review); err != nil {
			log.Warn("failed to create review: %v", err)
			response.WriteError(w, http.StatusInternalServerError, "failed to create review")
			return
		}

		response.WriteJSON(w, http.StatusCreated, map[string]interface{}{
			"message": "Review submitted successfully",
			"review_id": review.ReviewID,
		})
	}
}
