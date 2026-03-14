package main

import (
	"database/sql"
	"fmt"
	"log"

	_ "github.com/lib/pq"
)

// DB wraps sql.DB for database operations
type DB struct {
	*sql.DB
}

// NewDB creates a new database connection
func NewDB(dataSourceName string) (*DB, error) {
	db, err := sql.Open("postgres", dataSourceName)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return &DB{db}, nil
}

// User represents the users table
type User struct {
	UserID    int    `json:"user_id"`
	Name      string `json:"name"`
	Email     string `json:"email"`
	Password  string `json:"password"`
	Phone     string `json:"phone"`
	LicenseNo string `json:"license_no"`
	RoleID    int    `json:"role_id"`
	CreatedAt string `json:"created_at"`
}

// UserRepo interface for user operations
type UserRepo interface {
	GetUser(id int) (*User, error)
	CreateUser(user *User) error
}

// userRepo implements UserRepo
type userRepo struct {
	db *DB
}

// NewUserRepo creates a new user repository
func NewUserRepo(db *DB) UserRepo {
	return &userRepo{db: db}
}

// GetUser retrieves a user by ID
func (r *userRepo) GetUser(id int) (*User, error) {
	var user User
	query := `SELECT user_id, name, email, password, phone, license_no, role_id, created_at FROM users WHERE user_id = $1`
	err := r.db.QueryRow(query, id).Scan(&user.UserID, &user.Name, &user.Email, &user.Password, &user.Phone, &user.LicenseNo, &user.RoleID, &user.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &user, nil
}

// CreateUser inserts a new user
func (r *userRepo) CreateUser(user *User) error {
	query := `INSERT INTO users (name, email, password, phone, license_no, role_id, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())`
	_, err := r.db.Exec(query, user.Name, user.Email, user.Password, user.Phone, user.LicenseNo, user.RoleID)
	return err
}

// Vehicle represents the vehicles table
type Vehicle struct {
	VehicleID      int    `json:"vehicle_id"`
	VehicleModelID int    `json:"vehicle_model_id"`
	LicensePlate   string `json:"license_plate"`
	Status         string `json:"status"`
	BatteryLevel   int    `json:"battery_level"`
	BatteryHealth  int    `json:"battery_health"`
	LocationID     int    `json:"location_id"`
}

// VehicleRepo interface for vehicle operations
type VehicleRepo interface {
	GetVehicle(id int) (*Vehicle, error)
	CreateVehicle(vehicle *Vehicle) error
}

// vehicleRepo implements VehicleRepo
type vehicleRepo struct {
	db *DB
}

// NewVehicleRepo creates a new vehicle repository
func NewVehicleRepo(db *DB) VehicleRepo {
	return &vehicleRepo{db: db}
}

// GetVehicle retrieves a vehicle by ID
func (r *vehicleRepo) GetVehicle(id int) (*Vehicle, error) {
	var vehicle Vehicle
	query := `SELECT vehicle_id, vehicle_model_id, license_plate, status, battery_level, battery_health, location_id FROM vehicles WHERE vehicle_id = $1`
	err := r.db.QueryRow(query, id).Scan(&vehicle.VehicleID, &vehicle.VehicleModelID, &vehicle.LicensePlate, &vehicle.Status, &vehicle.BatteryLevel, &vehicle.BatteryHealth, &vehicle.LocationID)
	if err != nil {
		return nil, err
	}
	return &vehicle, nil
}

// CreateVehicle inserts a new vehicle
func (r *vehicleRepo) CreateVehicle(vehicle *Vehicle) error {
	query := `INSERT INTO vehicles (vehicle_model_id, license_plate, status, battery_level, battery_health, location_id) VALUES ($1, $2, $3, $4, $5, $6)`
	_, err := r.db.Exec(query, vehicle.VehicleModelID, vehicle.LicensePlate, vehicle.Status, vehicle.BatteryLevel, vehicle.BatteryHealth, vehicle.LocationID)
	return err
}

// Example usage in main
func main() {
	// Replace with your actual database connection string
	dataSourceName := "host=localhost port=5432 user=youruser password=yourpassword dbname=greencar sslmode=disable"

	db, err := NewDB(dataSourceName)
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	userRepo := NewUserRepo(db)
	vehicleRepo := NewVehicleRepo(db)

	// Example: Get user with ID 1
	user, err := userRepo.GetUser(1)
	if err != nil {
		log.Println("Error getting user:", err)
	} else {
		fmt.Printf("User: %+v\n", user)
	}

	// Example: Get vehicle with ID 1
	vehicle, err := vehicleRepo.GetVehicle(1)
	if err != nil {
		log.Println("Error getting vehicle:", err)
	} else {
		fmt.Printf("Vehicle: %+v\n", vehicle)
	}
}
