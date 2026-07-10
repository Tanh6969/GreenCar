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
func NewRouter(
	userSvc *service.UserService,
	vehicleSvc *service.VehicleService,
	bookingSvc *service.BookingService,
	log *logger.Logger,
	authSvc *service.AuthService,
	maker token.Maker,
	postSvc *service.PostService,
	ownerRegSvc *service.OwnerRegistrationService,
	chatSvc *service.ChatService,
	reviewSvc *service.ReviewService,
	pricingRuleSvc *service.PricingRuleService,
	db *database.DB,
) http.Handler {
	r := chi.NewRouter()

	// Global middleware
	r.Use(middlewares.CORSMiddleware)
	r.Use(middlewares.LoggingMiddleware(log))
	r.Use(middlewares.RateLimitMiddleware(100)) // 100 requests per minute per IP

	r.Get("/health", handlers.HealthHandler())

	// Public auth routes (no authentication needed)
	r.Route("/auth", func(r chi.Router) {
		r.Post("/login", handlers.LoginHandler(authSvc, log))
		r.Post("/register", handlers.RegisterHandler(authSvc, log))
	})

	// Blog handler (used by public, user, and admin routes below)
	postHandler := handlers.NewPostHandler(postSvc)

	// Public blog routes
	r.Route("/blog", func(r chi.Router) {
		r.Get("/posts", postHandler.ListPublished)
		r.Get("/posts/{slug}", postHandler.GetBySlug)
		r.Get("/categories", postHandler.ListCategories)
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
				r.Patch("/status", handlers.SetBookingStatusHandler(bookingSvc, log))
				r.Delete("/", handlers.DeleteBookingHandler(bookingSvc, log))
			})
		})

		// Admin posts management
		r.Route("/posts", func(r chi.Router) {
			r.Get("/", postHandler.AdminListPosts)
			r.Get("/{id}", postHandler.GetPost)
			r.Put("/{id}/status", postHandler.AdminSetStatus)
			r.Delete("/{id}", postHandler.AdminDeletePost)
		})

		// Admin owner registrations
		ownerRegHandler := handlers.NewOwnerRegistrationHandler(ownerRegSvc, log)
		r.Route("/owner-registrations", func(r chi.Router) {
			r.Get("/", ownerRegHandler.GetAll)
			r.Patch("/{id}/status", ownerRegHandler.UpdateStatus)
		})
	})

	// Public vehicle browse
	r.Route("/vehicles", func(r chi.Router) {
		r.Get("/cards", handlers.ListVehicleCardsHandler(vehicleSvc, log))
		routes.RegisterVehicleRoutes(r, vehicleSvc, log)
	})

	// Authenticated user + booking routes
	r.Route("/users", func(r chi.Router) {
		r.Use(auth)
		r.Get("/me", handlers.GetMeHandler(userSvc, log))
		routes.RegisterUserRoutes(r, userSvc, log)
	})

	r.Route("/bookings", func(r chi.Router) {
		r.Use(auth)
		routes.RegisterBookingRoutes(r, bookingSvc, log)
	})

	r.Route("/reviews", func(r chi.Router) {
		r.Use(auth)
		r.Post("/", handlers.CreateReviewHandler(reviewSvc, log))
	})

	// Owner registration routes
	ownerRegHandler := handlers.NewOwnerRegistrationHandler(ownerRegSvc, log)
	r.Route("/owner", func(r chi.Router) {
		r.Use(auth)
		r.Post("/registrations", ownerRegHandler.Create)
		r.Get("/my-registrations", ownerRegHandler.GetMyRegistrations)
		r.Get("/vehicles", handlers.ListOwnerVehiclesHandler(vehicleSvc, log))
		r.Put("/vehicles/{id}/status", handlers.UpdateVehicleStatusHandler(vehicleSvc, log))
		r.Get("/vehicles/{id}/unavailabilities", handlers.GetVehicleUnavailabilitiesHandler(vehicleSvc, log))
		r.Post("/vehicles/{id}/unavailabilities", handlers.AddVehicleUnavailabilityHandler(vehicleSvc, log))
		r.Delete("/vehicles/{id}/unavailabilities/{uid}", handlers.DeleteVehicleUnavailabilityHandler(vehicleSvc, log))
		r.Get("/bookings", handlers.GetOwnerBookingsHandler(bookingSvc, log))
		r.Put("/bookings/{id}/status", handlers.SetBookingStatusHandler(bookingSvc, log))
		r.Post("/bookings/{id}/complete", handlers.CompleteBookingHandler(bookingSvc, log))
		r.Post("/bookings/{id}/approve", handlers.ApproveBookingHandler(bookingSvc, log))
		r.Post("/bookings/{id}/reject", handlers.RejectBookingHandler(bookingSvc, log))
		// Pricing rules
		r.Get("/vehicles/{id}/pricing-rules", handlers.ListPricingRulesHandler(pricingRuleSvc, vehicleSvc, log))
		r.Post("/vehicles/{id}/pricing-rules", handlers.CreatePricingRuleHandler(pricingRuleSvc, vehicleSvc, log))
		r.Put("/vehicles/{id}/pricing-rules/{rid}", handlers.UpdatePricingRuleHandler(pricingRuleSvc, log))
		r.Delete("/vehicles/{id}/pricing-rules/{rid}", handlers.DeletePricingRuleHandler(pricingRuleSvc, log))
	})

	// Public price calculation endpoint
	r.Post("/calculate-price", handlers.CalculatePriceHandler(pricingRuleSvc, log))

	// Authenticated user blog routes
	r.Route("/my/posts", func(r chi.Router) {
		r.Use(auth)
		r.Get("/", postHandler.ListMyPosts)
		r.Post("/", postHandler.CreatePost)
		r.Route("/{id}", func(r chi.Router) {
			r.Put("/", postHandler.UpdatePost)
			r.Delete("/", postHandler.DeletePost)
			r.Post("/submit", postHandler.SubmitPost)
			r.Post("/withdraw", postHandler.WithdrawPost)
		})
	})
	// Chat routes
	chatHandler := handlers.NewChatHandler(chatSvc, log)
	r.Route("/messages", func(r chi.Router) {
		r.Use(auth)
		r.Get("/conversations", chatHandler.GetConversations)
		r.Get("/{bookingId}", chatHandler.GetConversationDetail)
		r.Post("/{bookingId}", chatHandler.SendMessage)
	})

	return r
}
