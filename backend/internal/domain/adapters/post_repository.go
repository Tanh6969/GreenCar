package adapters

import "greencar/internal/domain/entities"

// PostRepository defines storage operations for blog posts.
type PostRepository interface {
	// Public
	ListPublished(limit, offset int) ([]*entities.BlogPost, error)
	GetBySlug(slug string) (*entities.BlogPost, error)
	ListCategories() ([]*entities.BlogCategory, error)

	// User
	GetByID(id int) (*entities.BlogPost, error)
	ListByUser(userID, limit, offset int) ([]*entities.BlogPost, error)
	Create(p *entities.BlogPost) error
	Update(p *entities.BlogPost) error
	Delete(id int) error

	// Admin
	ListAll(limit, offset int) ([]*entities.BlogPost, int, error)
	SetStatus(id int, status, rejectReason string) error
}
