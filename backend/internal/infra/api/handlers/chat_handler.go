package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"greencar/internal/infra/api/middlewares"
	"greencar/internal/infra/api/response"
	"greencar/internal/service"
	"greencar/pkg/logger"

	"github.com/go-chi/chi/v5"
)

type ChatHandler struct {
	svc *service.ChatService
	log *logger.Logger
}

func NewChatHandler(svc *service.ChatService, log *logger.Logger) *ChatHandler {
	return &ChatHandler{svc: svc, log: log}
}

func (h *ChatHandler) GetConversations(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		response.WriteError(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	userID := int(payload.UserId)
	convos, err := h.svc.GetConversations(userID)
	if err != nil {
		h.log.Error("GetConversations", err)
		response.WriteError(w, http.StatusInternalServerError, "Lỗi lấy danh sách tin nhắn")
		return
	}
	response.WriteJSON(w, http.StatusOK, convos)
}

func (h *ChatHandler) GetConversationDetail(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		response.WriteError(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	userID := int(payload.UserId)
	conversationID, _ := strconv.Atoi(chi.URLParam(r, "conversationId"))

	c, msgs, err := h.svc.GetConversationDetail(conversationID, userID)
	if err != nil {
		h.log.Error("GetConversationDetail", err)
		response.WriteError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.WriteJSON(w, http.StatusOK, map[string]interface{}{
		"conversation": c,
		"messages":     msgs,
	})
}

func (h *ChatHandler) SendMessage(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		response.WriteError(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	userID := int(payload.UserId)
	conversationID, _ := strconv.Atoi(chi.URLParam(r, "conversationId"))

	var req struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	msg, err := h.svc.SendMessage(conversationID, userID, req.Content)
	if err != nil {
		h.log.Error("SendMessage", err)
		response.WriteError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.WriteJSON(w, http.StatusOK, msg)
}

func (h *ChatHandler) SendMessageByBooking(w http.ResponseWriter, r *http.Request) {
	payload := middlewares.GetPayload(r)
	if payload == nil {
		response.WriteError(w, http.StatusUnauthorized, "not authenticated")
		return
	}
	userID := int(payload.UserId)
	bookingID, _ := strconv.Atoi(chi.URLParam(r, "bookingId"))

	var req struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		response.WriteError(w, http.StatusBadRequest, "Invalid request body")
		return
	}

	msg, err := h.svc.SendMessageByBooking(bookingID, userID, req.Content)
	if err != nil {
		h.log.Error("SendMessageByBooking", err)
		response.WriteError(w, http.StatusInternalServerError, err.Error())
		return
	}

	response.WriteJSON(w, http.StatusOK, msg)
}
