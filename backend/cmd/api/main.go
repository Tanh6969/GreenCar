// Package main is the entry point of the GreenCar API.
package main

import (
	"encoding/json"
	"net/http"
	"os"
	"strconv"

	"greencar/internal/repository"
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

	mux := http.NewServeMux()

	mux.HandleFunc("GET /users/{id}", handleGetUser(userSvc, log))
	mux.HandleFunc("GET /vehicles/{id}", handleGetVehicle(vehicleSvc, log))
	mux.HandleFunc("GET /bookings/{id}", handleGetBooking(bookingSvc, log))

	mux.HandleFunc("GET /health", func(w http.ResponseWriter, _ *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(map[string]string{"status": "ok"})
	})

	addr := os.Getenv("HTTP_ADDR")
	if addr == "" {
		addr = ":8080"
	}
	log.Info("API listening on %s", addr)
	if err := http.ListenAndServe(addr, mux); err != nil {
		log.Error("server: %v", err)
		os.Exit(1)
	}
}

func handleGetUser(svc *service.UserService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			http.Error(w, "invalid user id", http.StatusBadRequest)
			return
		}
		u, err := svc.GetUser(id)
		if err != nil {
			log.Warn("get user %d: %v", id, err)
			http.Error(w, "not found", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(u)
	}
}

func handleGetVehicle(svc *service.VehicleService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			http.Error(w, "invalid vehicle id", http.StatusBadRequest)
			return
		}
		v, err := svc.GetVehicle(id)
		if err != nil {
			log.Warn("get vehicle %d: %v", id, err)
			http.Error(w, "not found", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(v)
	}
}

func handleGetBooking(svc *service.BookingService, log *logger.Logger) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(r.PathValue("id"))
		if err != nil {
			http.Error(w, "invalid booking id", http.StatusBadRequest)
			return
		}
		b, err := svc.GetBooking(id)
		if err != nil {
			log.Warn("get booking %d: %v", id, err)
			http.Error(w, "not found", http.StatusNotFound)
			return
		}
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(b)
	}
}
