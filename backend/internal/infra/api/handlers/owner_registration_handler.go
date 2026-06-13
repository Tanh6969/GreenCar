package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"

	"greencar/internal/domain/entities"
	"greencar/internal/infra/api/middlewares"
	"greencar/internal/infra/api/response"
	"greencar/internal/service"
	"greencar/pkg/logger"
)

type OwnerRegistrationHandler struct {
	svc *service.OwnerRegistrationService
	log *logger.Logger
}

func NewOwnerRegistrationHandler(svc *service.OwnerRegistrationService, log *logger.Logger) *OwnerRegistrationHandler {
	return &OwnerRegistrationHandler{svc: svc, log: log}
}

func (h *OwnerRegistrationHandler) Create(w http.ResponseWriter, r *http.Request) {
	var reg entities.OwnerRegistration
	if err := json.NewDecoder(r.Body).Decode(&reg); err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid request payload")
		return
	}

	payload := middlewares.GetPayload(r)
	if payload == nil {
		response.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	reg.UserID = int(payload.UserId)

	if err := h.svc.Create(&reg); err != nil {
		h.log.Error("failed to create owner registration: %v", err)
		response.WriteError(w, http.StatusInternalServerError, "failed to create registration")
		return
	}

	response.WriteJSON(w, http.StatusCreated, reg)
}

func (h *OwnerRegistrationHandler) GetMyRegistrations(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		response.WriteError(w, http.StatusUnauthorized, "unauthorized")
		return
	}
	regs, err := h.svc.GetMyRegistrations(int(payload.UserId))
	if err != nil {
		h.log.Error("failed to get my registrations: %v", err)
		response.WriteError(w, http.StatusInternalServerError, "failed to get registrations")
		return
	}

	response.WriteJSON(w, http.StatusOK, regs)
}

func (h *OwnerRegistrationHandler) GetAll(w http.ResponseWriter, r *http.Request) {
	regs, err := h.svc.GetAll()
	if err != nil {
		h.log.Error("failed to get all registrations: %v", err)
		response.WriteError(w, http.StatusInternalServerError, "failed to get all registrations")
		return
	}

	response.WriteJSON(w, http.StatusOK, regs)
}

func (h *OwnerRegistrationHandler) UpdateStatus(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.Atoi(idStr)
	if err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid id")
		return
	}

	var req struct {
		Status       string `json:"status"`
		RejectReason string `json:"reject_reason"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteError(w, http.StatusBadRequest, "invalid request payload")
		return
	}

	if err := h.svc.UpdateStatus(id, req.Status, req.RejectReason); err != nil {
		h.log.Error("failed to update status: %v", err)
		response.WriteError(w, http.StatusInternalServerError, "failed to update status")
		return
	}

	response.WriteJSON(w, http.StatusOK, map[string]string{"message": "status updated successfully"})
}
