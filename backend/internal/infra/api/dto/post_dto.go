package dto

import "time"

type BlogCategoryResponse struct {
	CategoryID int    `json:"category_id"`
	Name       string `json:"name"`
	Slug       string `json:"slug"`
}

type BlogPostResponse struct {
	PostID       int                   `json:"post_id"`
	UserID       int                   `json:"user_id"`
	Category     *BlogCategoryResponse `json:"category,omitempty"`
	Title        string                `json:"title"`
	Slug         string                `json:"slug"`
	Excerpt      string                `json:"excerpt"`
	Content      string                `json:"content"`
	CoverImage   string                `json:"cover_image"`
	Status       string                `json:"status"`
	RejectReason string                `json:"reject_reason,omitempty"`
	PublishedAt  *time.Time            `json:"published_at"`
	CreatedAt    time.Time             `json:"created_at"`
	UpdatedAt    time.Time             `json:"updated_at"`
}

type CreatePostRequest struct {
	CategoryID *int   `json:"category_id"`
	Title      string `json:"title"`
	Slug       string `json:"slug"`
	Excerpt    string `json:"excerpt"`
	Content    string `json:"content"`
	CoverImage string `json:"cover_image"`
}

type UpdatePostRequest struct {
	CategoryID *int   `json:"category_id"`
	Title      string `json:"title"`
	Slug       string `json:"slug"`
	Excerpt    string `json:"excerpt"`
	Content    string `json:"content"`
	CoverImage string `json:"cover_image"`
}

type SetStatusRequest struct {
	Status       string `json:"status"`
	RejectReason string `json:"reject_reason"`
}
