package database

import (
	"database/sql"

	_ "github.com/lib/pq"
)

// DB wraps sql.DB for database operations.
type DB struct {
	*sql.DB
}

// Config holds database connection options.
type Config struct {
	Host     string
	Port     string
	User     string
	Password string
	DBName   string
	SSLMode  string
}

// New creates a new database connection.
func New(cfg Config) (*DB, error) {
	dsn := "host=" + cfg.Host + " port=" + cfg.Port + " user=" + cfg.User +
		" password=" + cfg.Password + " dbname=" + cfg.DBName + " sslmode=" + cfg.SSLMode
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return &DB{db}, nil
}

// NewFromDSN creates a new database connection from a full DSN string.
func NewFromDSN(dsn string) (*DB, error) {
	db, err := sql.Open("postgres", dsn)
	if err != nil {
		return nil, err
	}
	if err = db.Ping(); err != nil {
		return nil, err
	}
	return &DB{db}, nil
}
