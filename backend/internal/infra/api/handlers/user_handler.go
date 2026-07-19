package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"greencar/internal/infra/api/dto"
	"greencar/internal/infra/api/mappers"
	"greencar/internal/infra/api/middlewares"
	"greencar/internal/infra/api/response"
	"greencar/internal/service"
	"greencar/pkg/logger"

	"github.com/go-chi/chi/v5"
)

// GetMeHandler returns the profile of the currently authenticated user.
func GetMeHandler(userSvc *service.UserService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}
		u, err := userSvc.GetUser(int(payload.UserId))
		if err != nil {
			log.Warn("get me %d: %v", payload.UserId, err)
			response.WriteError(w, http.StatusNotFound, "user not found")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToUserResponse(u))
	}
}

// GetUserHandler returns a handler for retrieving a user by ID.
func GetUserHandler(userSvc *service.UserService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid user id")
			return
		}

		u, err := userSvc.GetUser(id)
		if err != nil {
			log.Warn("get user %d: %v", id, err)
			response.WriteError(w, http.StatusNotFound, "user not found")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToUserResponse(u))
	}
}

// ListUsersHandler returns a handler for listing users with pagination.
func ListUsersHandler(userSvc *service.UserService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		page, limit, offset := response.ParsePagination(r, 20)

		users, total, err := userSvc.ListUsers(limit, offset)
		if err != nil {
			log.Warn("list users: %v", err)
			response.WriteError(w, http.StatusInternalServerError, "failed to list users")
			return
		}
		response.WritePaginatedJSON(w, http.StatusOK, mappers.ToUserResponses(users), page, limit, total)
	}
}

// CreateUserHandler returns a handler for creating a user.
func CreateUserHandler(userSvc *service.UserService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req dto.CreateUserRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		u := mappers.ToUserCreateParams(&req)
		if err := userSvc.CreateUser(&u); err != nil {
			log.Warn("create user: %v", err)
			response.WriteError(w, http.StatusBadRequest, err.Error())
			return
		}
		response.WriteJSON(w, http.StatusCreated, mappers.ToUserResponse(&u))
	}
}

// UpdateUserHandler returns a handler for updating a user by ID.
func UpdateUserHandler(userSvc *service.UserService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid user id")
			return
		}

		var req dto.UpdateUserRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		u := mappers.ToUserUpdateParams(id, &req)
		if err := userSvc.UpdateUser(&u); err != nil {
			log.Warn("update user %d: %v", id, err)
			response.WriteError(w, http.StatusBadRequest, err.Error())
			return
		}

		updated, err := userSvc.GetUser(id)
		if err != nil {
			log.Warn("get user after update %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to retrieve updated user")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToUserResponse(updated))
	}
}

// DeleteUserHandler returns a handler for deleting a user by ID.
func DeleteUserHandler(userSvc *service.UserService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		id, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid user id")
			return
		}

		if err := userSvc.DeleteUser(id); err != nil {
			log.Warn("delete user %d: %v", id, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to delete user")
			return
		}
		w.WriteHeader(http.StatusNoContent)
	}
}

// SubmitLicenseHandler handles requests from user to submit their license photo URL for verification
func SubmitLicenseHandler(userSvc *service.UserService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		payload := middlewares.GetPayload(r)
		if payload == nil {
			response.WriteError(w, http.StatusUnauthorized, "unauthorized")
			return
		}

		var req dto.SubmitLicenseRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		if req.LicenseFrontURL == "" || req.LicenseBackURL == "" || req.LicenseNo == "" {
			response.WriteError(w, http.StatusBadRequest, "license_no, license_front_url and license_back_url are required")
			return
		}

		err := userSvc.SubmitLicense(int(payload.UserId), req.LicenseNo, req.LicenseFrontURL, req.LicenseBackURL)
		if err != nil {
			log.Warn("submit license error for user %d: %v", payload.UserId, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to submit license")
			return
		}

		updated, err := userSvc.GetUser(int(payload.UserId))
		if err != nil {
			response.WriteError(w, http.StatusInternalServerError, "failed to retrieve updated user")
			return
		}

		response.WriteJSON(w, http.StatusOK, mappers.ToUserResponse(updated))
	}
}

// AdminVerifyLicenseHandler handles driving license verification approvals/rejections by admin
func AdminVerifyLicenseHandler(userSvc *service.UserService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		idStr := chi.URLParam(r, "id")
		userID, err := strconv.Atoi(idStr)
		if err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid user id")
			return
		}

		var req dto.VerifyLicenseRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			response.WriteError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		if req.Status != "verified" && req.Status != "rejected" {
			response.WriteError(w, http.StatusBadRequest, "invalid status, must be verified or rejected")
			return
		}

		if req.Status == "rejected" && req.RejectReason == "" {
			response.WriteError(w, http.StatusBadRequest, "reject_reason is required when rejecting")
			return
		}

		err = userSvc.AdminVerifyLicense(userID, req.Status, req.RejectReason)
		if err != nil {
			log.Warn("admin verify license %d: %v", userID, err)
			response.WriteError(w, http.StatusInternalServerError, "failed to verify license")
			return
		}

		updated, err := userSvc.GetUser(userID)
		if err != nil {
			response.WriteError(w, http.StatusInternalServerError, "failed to retrieve updated user")
			return
		}

		response.WriteJSON(w, http.StatusOK, mappers.ToUserResponse(updated))
	}
}

