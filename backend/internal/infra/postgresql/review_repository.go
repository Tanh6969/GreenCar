package repository

import (
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

// ReviewRepository defines operations on reviews.
// It implements adapters.ReviewRepository
type ReviewRepository interface {
	adapters.ReviewRepository
}

type reviewRepository struct {
	db *database.DB
}

// NewReviewRepository creates a new review repository.
func NewReviewRepository(db *database.DB) ReviewRepository {
	return &reviewRepository{db: db}
}

func (r *reviewRepository) GetByID(id int) (*entities.Review, error) {
	var row entities.Review
	err := r.db.QueryRow(`SELECT review_id, user_id, vehicle_model_id, booking_id, rating, comment, created_at FROM reviews WHERE review_id = $1`, id).
		Scan(&row.ReviewID, &row.UserID, &row.VehicleModelID, &row.BookingID, &row.Rating, &row.Comment, &row.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &row, nil
}

func (r *reviewRepository) Create(row *entities.Review) error {
	return r.db.QueryRow(`INSERT INTO reviews (user_id, vehicle_model_id, booking_id, rating, comment, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING review_id, created_at`,
		row.UserID, row.VehicleModelID, row.BookingID, row.Rating, row.Comment).Scan(&row.ReviewID, &row.CreatedAt)
}

func (r *reviewRepository) Update(row *entities.Review) error {
	_, err := r.db.Exec(`UPDATE reviews SET rating = $1, comment = $2 WHERE review_id = $3`, row.Rating, row.Comment, row.ReviewID)
	return err
}

func (r *reviewRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM reviews WHERE review_id = $1`, id)
	return err
}

func (r *reviewRepository) List(limit, offset int) ([]*entities.Review, error) {
	// Not needed right now, mock it
	return nil, nil
}

func (r *reviewRepository) GetByVehicleID(vehicleID int, limit, offset int) ([]*entities.Review, error) {
	// Not needed right now, mock it
	return nil, nil
}

