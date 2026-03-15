package handlers

import (
	"net/http"
	"strconv"

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
