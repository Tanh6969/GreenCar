package routes

import (
	"greencar/internal/infra/api/handlers"
	"greencar/internal/service"
	"greencar/pkg/logger"

	"github.com/go-chi/chi/v5"
)

// RegisterUserRoutes registers all user-related routes under the given router.
func RegisterUserRoutes(r chi.Router, userSvc *service.UserService, log *logger.Logger) {
	r.Get("/", handlers.ListUsersHandler(userSvc, log))
	r.Post("/", handlers.CreateUserHandler(userSvc, log))

	r.Route("/{id}", func(r chi.Router) {
		r.Get("/", handlers.GetUserHandler(userSvc, log))
		r.Put("/", handlers.UpdateUserHandler(userSvc, log))
		r.Delete("/", handlers.DeleteUserHandler(userSvc, log))
	})
}
