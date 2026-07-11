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

// ApproveBookingHandler allows owner to approve a pending booking.
func ApproveBookingHandler(bookingSvc *service.BookingService, notifSvc service.NotificationService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid booking id")
			return
		}
		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}
		if err := bookingSvc.SetBookingStatus(id, "confirmed"); err != nil {
			log.Warn("approve booking %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to approve booking")
			return
		}
		b, _ := bookingSvc.GetBooking(id)
		
		// Send notification to customer
		_ = notifSvc.CreateNotification(
			b.UserID,
			"booking_approved",
			"Đơn thuê xe đã được duyệt",
			"Tuyệt vời! Chủ xe đã chấp nhận yêu cầu thuê xe của bạn.",
			"/customer/my-bookings",
		)

		response.WriteJSON(w, http.StatusOK, mappers.ToBookingResponse(b))
	}
}

// RejectBookingHandler allows owner to reject a pending booking with a reason.
func RejectBookingHandler(bookingSvc *service.BookingService, notifSvc service.NotificationService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid booking id")
			return
		}
		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}
		var req dto.ApproveBookingRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			req.OwnerNote = ""
		}
		b, err := bookingSvc.GetBooking(id)
		if err != nil {
			response.WriteError(w, http.StatusNotFound, "booking not found")
			return
		}
		b.Status = "cancelled"
		b.OwnerNote = req.OwnerNote
		if err := bookingSvc.UpdateBooking(b); err != nil {
			log.Warn("reject booking %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to reject booking")
			return
		}
		
		// Send notification to customer
		_ = notifSvc.CreateNotification(
			b.UserID,
			"booking_rejected",
			"Đơn thuê xe đã bị từ chối",
			"Rất tiếc, đơn thuê xe của bạn đã bị từ chối. Tiền cọc sẽ được hoàn lại.",
			"/customer/my-bookings",
		)

		response.WriteJSON(w, http.StatusOK, mappers.ToBookingResponse(b))
	}
}

// --- Pricing Rules Handlers ---

// ListPricingRulesHandler returns all pricing rules for a vehicle.
func ListPricingRulesHandler(pricingSvc *service.PricingRuleService, vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		vehicleID, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid vehicle id")
			return
		}
		rules, err := pricingSvc.ListRules(vehicleID)
		if err != nil {
			log.Warn("list pricing rules %d: %v", vehicleID, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to list rules")
			return
		}
		if rules == nil {
			rules = []*entities.PricingRule{}
		}
		response.WriteJSON(w, http.StatusOK, rules)
	}
}

// CreatePricingRuleHandler creates a new pricing rule for a vehicle.
func CreatePricingRuleHandler(pricingSvc *service.PricingRuleService, vehicleSvc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		vehicleID, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid vehicle id")
			return
		}
		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}
		var req dto.PricingRuleRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}
		rule := &entities.PricingRule{
			VehicleID:       vehicleID,
			RuleType:        req.RuleType,
			DiscountPercent: req.DiscountPercent,
			ExtraPercent:    req.ExtraPercent,
			MinDays:         req.MinDays,
			IsActive:        req.IsActive,
		}
		if req.PromoStartDate != "" {
			t, err := time.Parse("2006-01-02", req.PromoStartDate)
			if err == nil {
				rule.PromoStartDate = &t
			}
		}
		if req.PromoEndDate != "" {
			t, err := time.Parse("2006-01-02", req.PromoEndDate)
			if err == nil {
				rule.PromoEndDate = &t
			}
		}
		if err := pricingSvc.CreateRule(rule); err != nil {
			log.Warn("create pricing rule: %v", err)
			response.WriteError(w, http.StatusInternalServerError, "failed to create rule")
			return
		}
		response.WriteJSON(w, http.StatusCreated, rule)
	}
}

// UpdatePricingRuleHandler updates an existing pricing rule.
func UpdatePricingRuleHandler(pricingSvc *service.PricingRuleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ruleIDStr := chi.URLParam(r, "rid")
		ruleID, err := strconv.Atoi(ruleIDStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid rule id")
			return
		}
		var req dto.PricingRuleRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}
		rule := &entities.PricingRule{
			ID:              ruleID,
			RuleType:        req.RuleType,
			DiscountPercent: req.DiscountPercent,
			ExtraPercent:    req.ExtraPercent,
			MinDays:         req.MinDays,
			IsActive:        req.IsActive,
		}
		if req.PromoStartDate != "" {
			t, err := time.Parse("2006-01-02", req.PromoStartDate)
			if err == nil {
				rule.PromoStartDate = &t
			}
		}
		if req.PromoEndDate != "" {
			t, err := time.Parse("2006-01-02", req.PromoEndDate)
			if err == nil {
				rule.PromoEndDate = &t
			}
		}
		if err := pricingSvc.UpdateRule(rule); err != nil {
			log.Warn("update pricing rule %d: %v", ruleID, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to update rule")
			return
		}
		response.WriteJSON(w, http.StatusOK, rule)
	}
}

// DeletePricingRuleHandler deletes a pricing rule.
func DeletePricingRuleHandler(pricingSvc *service.PricingRuleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		ruleIDStr := chi.URLParam(r, "rid")
		ruleID, err := strconv.Atoi(ruleIDStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid rule id")
			return
		}
		if err := pricingSvc.DeleteRule(ruleID); err != nil {
			log.Warn("delete pricing rule %d: %v", ruleID, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to delete rule")
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

// CalculatePriceHandler allows frontend to preview adjusted price before booking.
func CalculatePriceHandler(pricingSvc *service.PricingRuleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req dto.CalculatePriceRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}
		start, err := time.Parse(time.RFC3339, req.StartTime)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid start_time")
			return
		}
		end, err := time.Parse(time.RFC3339, req.EndTime)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid end_time")
			return
		}
		finalPrice, appliedRules, err := pricingSvc.CalculateAdjustedPrice(req.VehicleID, req.BasePrice, start, end)
		if err != nil {
			log.Warn("calculate price: %v", err)
			finalPrice = req.BasePrice
			appliedRules = []string{}
		}
		response.WriteJSON(w, http.StatusOK, &dto.CalculatePriceResponse{
			OriginalPrice: req.BasePrice,
			FinalPrice:    finalPrice,
			AppliedRules:  appliedRules,
		})
	}
}
