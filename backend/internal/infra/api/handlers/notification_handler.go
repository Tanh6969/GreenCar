package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"greencar/internal/infra/api/middlewares"
	"greencar/internal/service"
)

type NotificationHandler struct {
	notifService service.NotificationService
}

func NewNotificationHandler(s service.NotificationService) *NotificationHandler {
	return &NotificationHandler{notifService: s}
}

func (h *NotificationHandler) GetNotifications(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	userID := int(payload.UserId)

	notifs, err := h.notifService.GetNotifications(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(notifs)
}

func (h *NotificationHandler) GetUnreadCount(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	userID := int(payload.UserId)

	count, err := h.notifService.GetUnreadCount(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(map[string]int{"count": count})
}

func (h *NotificationHandler) MarkAsRead(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	userID := int(payload.UserId)

	// In Go 1.22+, if we use pattern `PUT /notifications/{id}/read`
	idStr := r.PathValue("id")
	notifID, err := strconv.Atoi(idStr)
	if err != nil {
		http.Error(w, "Invalid notification ID", http.StatusBadRequest)
		return
	}

	err = h.notifService.MarkAsRead(notifID, userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (h *NotificationHandler) MarkAllAsRead(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}
	userID := int(payload.UserId)

	err := h.notifService.MarkAllAsRead(userID)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
}
