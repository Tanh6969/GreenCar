package dto

import (
	"time"

	"github.com/google/uuid"
)

type CreatePostRequest struct {
	Title   string `json:"title" required:"true"`
	Content string `json:"content" required:"true"`
}

type UpdatePostRequest struct {
	Title   string `json:"title" required:"true"`
	Content string `json:"content" required:"true"`
}

type PostResponse struct {
	ID        uuid.UUID `json:"id"`
	Title     string    `json:"title"`
	Content   string    `json:"content"`
	AuthorID  int64     `json:"author_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type PostListResponse struct {
	Data  []*PostResponse `json:"data"`
	Total int             `json:"total"`
}
