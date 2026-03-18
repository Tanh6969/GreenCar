package handlers

import (
	"encoding/json"
	"net/http"

	"greencar/internal/infra/api/dto"
	"greencar/internal/infra/api/response"
	"greencar/internal/service"
	"greencar/pkg/logger"
)

// LoginHandler returns a handler for user login.
func LoginHandler(authSvc *service.AuthService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req dto.LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		accessToken, refreshToken, payload, err := authSvc.Login(req.Email, req.Password)
		if err != nil {
			log.Warn("login failed: %v", err)
			response.WriteError(w, http.StatusUnauthorized, "invalid credentials")
			return
		}

		response.WriteJSON(w, http.StatusOK, dto.LoginResponse{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
			ExpiresAt:    payload.ExpiredAt.Format("2006-01-02T15:04:05Z07:00"),
			Role:         payload.Role,
			UserID:       payload.UserId,
		})
	}
}
