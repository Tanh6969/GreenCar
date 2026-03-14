package repository

import (
	"greencar/internal/domain"
	"greencar/pkg/database"
)

// ReviewRepository defines operations on reviews.
type ReviewRepository interface {
	GetByID(id int) (*domain.Review, error)
	Create(r *domain.Review) error
}

type reviewRepository struct {
	db *database.DB
}

// NewReviewRepository creates a new review repository.
func NewReviewRepository(db *database.DB) ReviewRepository {
	return &reviewRepository{db: db}
}

func (r *reviewRepository) GetByID(id int) (*domain.Review, error) {
	var row domain.Review
	err := r.db.QueryRow(`SELECT review_id, user_id, vehicle_model_id, booking_id, rating, comment, created_at FROM reviews WHERE review_id = $1`, id).
		Scan(&row.ReviewID, &row.UserID, &row.VehicleModelID, &row.BookingID, &row.Rating, &row.Comment, &row.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *reviewRepository) Create(row *domain.Review) error {
	return r.db.QueryRow(`INSERT INTO reviews (user_id, vehicle_model_id, booking_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING review_id, created_at`,
		row.UserID, row.VehicleModelID, row.BookingID, row.Rating, row.Comment).Scan(&row.ReviewID, &row.CreatedAt)
}
