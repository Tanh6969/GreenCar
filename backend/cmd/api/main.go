// Package main is the entry point of the GreenCar API.
package main

import (
	"net/http"
	"os"

	"greencar/internal/infra/api"
	repository "greencar/internal/infra/postgresql"
	"greencar/internal/service"
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

	userRepo := repository.NewUserRepository(db)
	vehicleRepo := repository.NewVehicleRepository(db)
	bookingRepo := repository.NewBookingRepository(db)

	userSvc := service.NewUserService(userRepo)
	vehicleSvc := service.NewVehicleService(vehicleRepo)
	bookingSvc := service.NewBookingService(bookingRepo)

	router := api.NewRouter(userSvc, vehicleSvc, bookingSvc, log)

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
