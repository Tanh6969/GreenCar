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

		users, err := userSvc.ListUsers(limit, offset)
		if err != nil {
			log.Warn("list users: %v", err)
			response.WriteError(w, http.StatusInternalServerError, "failed to list users")
			return
		}
		response.WriteJSON(w, http.StatusOK, mappers.ToUserResponses(users))
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
