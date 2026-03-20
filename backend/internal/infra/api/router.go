package api

import (
	"net/http"

	"greencar/internal/infra/api/handlers"
	"greencar/internal/infra/api/middlewares"
	"greencar/internal/infra/api/routes"
	"greencar/internal/service"
	"greencar/internal/token"
	"greencar/pkg/database"
	"greencar/pkg/logger"

	"github.com/go-chi/chi/v5"
)

// NewRouter creates an HTTP handler with all API routes wired.
func NewRouter(userSvc *service.UserService, vehicleSvc *service.VehicleService, bookingSvc *service.BookingService, log *logger.Logger, authSvc *service.AuthService, maker token.Maker, postSvc *service.PostService, db *database.DB) http.Handler {
	r := chi.NewRouter()

	// Global middleware
	r.Use(middlewares.LoggingMiddleware(log))
	r.Use(middlewares.RateLimitMiddleware(100)) // 100 requests per minute per IP

	r.Get("/health", handlers.HealthHandler())

	// Public auth routes (no authentication needed)
	r.Route("/auth", func(r chi.Router) {
		r.Post("/login", handlers.LoginHandler(authSvc, log))
	})

	// Protected routes with authentication middleware
	auth := middlewares.Authenticator(maker)

	// Customer routes (only authenticated users)
	r.Route("/customers", func(r chi.Router) {
		r.Use(auth)
		r.Get("/me/bookings", handlers.GetMyBookingsHandler(bookingSvc, log))
	})

	// Admin routes (only admin users)
	admin := middlewares.RequireRole("admin")

	r.Route("/admin", func(r chi.Router) {
		r.Use(auth)
		r.Use(admin)

		// Admin statistics
		r.Get("/stats", handlers.NewStatsHandler(db.DB).GetStats)

		// Admin user management
		r.Route("/users", func(r chi.Router) {
			r.Get("/", handlers.ListUsersHandler(userSvc, log))
			r.Post("/", handlers.CreateUserHandler(userSvc, log))
			r.Route("/{id}", func(r chi.Router) {
				r.Get("/", handlers.GetUserHandler(userSvc, log))
				r.Put("/", handlers.UpdateUserHandler(userSvc, log))
				r.Delete("/", handlers.DeleteUserHandler(userSvc, log))
			})
		})

		// Admin vehicle management
		r.Route("/vehicles", func(r chi.Router) {
			r.Get("/", handlers.ListVehiclesHandler(vehicleSvc, log))
			r.Post("/", handlers.CreateVehicleHandler(vehicleSvc, log))
			r.Route("/{id}", func(r chi.Router) {
				r.Get("/", handlers.GetVehicleHandler(vehicleSvc, log))
				r.Put("/", handlers.UpdateVehicleHandler(vehicleSvc, log))
				r.Delete("/", handlers.DeleteVehicleHandler(vehicleSvc, log))
			})
		})

		// Admin booking management
		r.Route("/bookings", func(r chi.Router) {
			r.Get("/", handlers.ListBookingsHandler(bookingSvc, log))
			r.Route("/{id}", func(r chi.Router) {
				r.Get("/", handlers.GetBookingHandler(bookingSvc, log))
				r.Put("/", handlers.UpdateBookingHandler(bookingSvc, log))
				r.Delete("/", handlers.DeleteBookingHandler(bookingSvc, log))
			})
		})

		// Admin posts management
		postHandler := handlers.NewPostHandler(postSvc)
		r.Route("/posts", func(r chi.Router) {
			r.Get("/", postHandler.ListPosts)
			r.Post("/", postHandler.CreatePost)
			r.Get("/{id}", postHandler.GetPost)
			r.Put("/{id}", postHandler.UpdatePost)
			r.Delete("/{id}", postHandler.DeletePost)
		})
	})

	// Public vehicle browse
	r.Route("/vehicles", func(r chi.Router) {
		routes.RegisterVehicleRoutes(r, vehicleSvc, log)
	})

	// Authenticated user + booking routes
	r.Route("/users", func(r chi.Router) {
		r.Use(auth)
		routes.RegisterUserRoutes(r, userSvc, log)
	})

	r.Route("/bookings", func(r chi.Router) {
		r.Use(auth)
		routes.RegisterBookingRoutes(r, bookingSvc, log)
	})

	return r
}
