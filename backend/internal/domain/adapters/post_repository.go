package adapters

import (
	"context"

	"greencar/internal/domain/entities"
)

type PostRepository interface {
	Create(ctx context.Context, post *entities.Post) error
	GetByID(ctx context.Context, id string) (*entities.Post, error)
	List(ctx context.Context, limit, offset int) ([]*entities.Post, error)
	Update(ctx context.Context, post *entities.Post) error
	Delete(ctx context.Context, id string) error
}
