package service

import (
	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
)

type ReviewService struct {
	reviewRepo adapters.ReviewRepository
}

func NewReviewService(reviewRepo adapters.ReviewRepository) *ReviewService {
	return &ReviewService{reviewRepo: reviewRepo}
}

func (s *ReviewService) CreateReview(r *entities.Review) error {
	return s.reviewRepo.Create(r)
}
