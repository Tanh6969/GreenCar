package entities

import "time"

// BlogPost represents the blog_posts table.
type BlogPost struct {
	PostID       int        `json:"post_id"`
	UserID       int        `json:"user_id"`
	CategoryID   *int       `json:"category_id"`
	Title        string     `json:"title"`
	Slug         string     `json:"slug"`
	Excerpt      string     `json:"excerpt"`
	Content      string     `json:"content"`
	CoverImage   string     `json:"cover_image"`
	Status       string     `json:"status"` // draft | pending | published | rejected
	RejectReason string     `json:"reject_reason"`
	PublishedAt  *time.Time `json:"published_at"`
	CreatedAt    time.Time  `json:"created_at"`
	UpdatedAt    time.Time  `json:"updated_at"`
}

// BlogCategory represents the blog_categories table.
type BlogCategory struct {
	CategoryID int    `json:"category_id"`
	Name       string `json:"name"`
	Slug       string `json:"slug"`
}
