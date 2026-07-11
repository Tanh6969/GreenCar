package handlers

import (
	"encoding/json"
	"net/http"

	"greencar/internal/infra/api/dto"
	"greencar/internal/infra/api/response"
	"greencar/internal/service"
	"greencar/pkg/logger"
)

// RegisterHandler returns a handler for user registration.
func RegisterHandler(authSvc *service.AuthService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req dto.RegisterRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}
		if req.Name == "" || req.Email == "" || req.Password == "" {
			response.WriteError(w, http.StatusBadRequest, "name, email and password are required")
			return
		}

		accessToken, refreshToken, payload, userID, err := authSvc.Register(req.Name, req.Email, req.Password, req.Phone, req.LicenseNo)
		if err != nil {
			log.Warn("register failed: %v", err)
			response.WriteError(w, http.StatusBadRequest, err.Error())
			return
		}

		response.WriteJSON(w, http.StatusCreated, dto.LoginResponse{
			AccessToken:  accessToken,
			RefreshToken: refreshToken,
			ExpiresAt:    payload.ExpiredAt.Format("2006-01-02T15:04:05Z07:00"),
			Role:         payload.Role,
			UserID:       userID,
		})
	}
}

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

// ForgotPasswordHandler handles forgot password requests.
func ForgotPasswordHandler(authSvc *service.AuthService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Email string `json:"email"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}
		if req.Email == "" {
			response.WriteError(w, http.StatusBadRequest, "email is required")
			return
		}

		if err := authSvc.ForgotPassword(req.Email); err != nil {
			log.Warn("forgot password failed: %v", err)
			response.WriteError(w, http.StatusInternalServerError, "failed to process forgot password")
			return
		}

		response.WriteJSON(w, http.StatusOK, map[string]string{"message": "If email exists, a reset link has been sent"})
	}
}

// ResetPasswordHandler handles reset password requests.
func ResetPasswordHandler(authSvc *service.AuthService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req struct {
			Token       string `json:"token"`
			NewPassword string `json:"new_password"`
		}
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}
		if req.Token == "" || req.NewPassword == "" {
			response.WriteError(w, http.StatusBadRequest, "token and new_password are required")
			return
		}

		if err := authSvc.ResetPassword(req.Token, req.NewPassword); err != nil {
			log.Warn("reset password failed: %v", err)
			response.WriteError(w, http.StatusBadRequest, err.Error())
			return
		}

		response.WriteJSON(w, http.StatusOK, map[string]string{"message": "Password successfully reset"})
	}
}

