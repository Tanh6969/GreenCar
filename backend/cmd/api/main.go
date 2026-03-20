package main

import (
	"net/http"
	"os"
	"time"

	"greencar/internal/infra/api"
	repository "greencar/internal/infra/postgresql"
	"greencar/internal/service"
	"greencar/internal/token"
	"greencar/pkg/database"
	"greencar/pkg/logger"
)

func main() {
	log := logger.New()

	dsn := os.Getenv("DB_DSN")
	if dsn == "" {
		dsn = "host=localhost port=5432 user=postgres password=postgres dbname=greencar sslmode=disable"
	}

	db, err := database.NewFromDSN(dsn)
	if err != nil {
		log.Error("database: %v", err)
		os.Exit(1)
	}
	defer db.Close()

	// Initialize token maker (JWT)
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		secretKey = "your-secret-key-min-32-characters-long-please-change-in-production!" // Change for production
	}
	maker, err := token.NewJWTMaker(secretKey)
	if err != nil {
		log.Error("token maker: %v", err)
		os.Exit(1)
	}

	userRepo := repository.NewUserRepository(db)
	roleRepo := repository.NewRoleRepository(db)
	vehicleRepo := repository.NewVehicleRepository(db)
	vehicleDetailRepo := repository.NewVehicleDetailRepository(db)
	bookingRepo := repository.NewBookingRepository(db)
	postRepo := repository.NewPostRepository(db)

	userSvc := service.NewUserService(userRepo)
	vehicleSvc := service.NewVehicleService(vehicleRepo, vehicleDetailRepo)
	bookingSvc := service.NewBookingService(bookingRepo)
	authSvc := service.NewAuthService(userRepo, roleRepo, maker, 15*time.Minute, 24*time.Hour)
	postSvc := service.NewPostService(postRepo)

	router := api.NewRouter(userSvc, vehicleSvc, bookingSvc, log, authSvc, maker, postSvc, db)

	addr := os.Getenv("HTTP_ADDR")
	if addr == "" {
		addr = ":8080"
	}
	log.Info("API listening on %s", addr)
	if err := http.ListenAndServe(addr, router); err != nil {
		log.Error("server: %v", err)
		os.Exit(1)
	}
}
