package repository

import (
	"time"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
	"greencar/pkg/database"
)

type postRepository struct {
	db *database.DB
}

func NewPostRepository(db *database.DB) adapters.PostRepository {
	return &postRepository{db: db}
}

const postCols = `post_id, user_id, category_id, title, slug, excerpt, content, cover_image,
	status, COALESCE(reject_reason,''), published_at, created_at, updated_at`

func scanPost(row interface {
	Scan(...any) error
}) (*entities.BlogPost, error) {
	var p entities.BlogPost
	return &p, row.Scan(
		&p.PostID, &p.UserID, &p.CategoryID, &p.Title, &p.Slug, &p.Excerpt, &p.Content, &p.CoverImage,
		&p.Status, &p.RejectReason, &p.PublishedAt, &p.CreatedAt, &p.UpdatedAt,
	)
}

func (r *postRepository) ListPublished(limit, offset int) ([]*entities.BlogPost, error) {
	rows, err := r.db.Query(
		`SELECT `+postCols+` FROM blog_posts WHERE status = 'published' ORDER BY published_at DESC LIMIT $1 OFFSET $2`,
		limit, offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var posts []*entities.BlogPost
	for rows.Next() {
		p, err := scanPost(rows)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, rows.Err()
}

func (r *postRepository) GetBySlug(slug string) (*entities.BlogPost, error) {
	return scanPost(r.db.QueryRow(
		`SELECT `+postCols+` FROM blog_posts WHERE slug = $1 AND status = 'published'`, slug,
	))
}

func (r *postRepository) ListCategories() ([]*entities.BlogCategory, error) {
	rows, err := r.db.Query(`SELECT category_id, name, slug FROM blog_categories ORDER BY category_id`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var cats []*entities.BlogCategory
	for rows.Next() {
		var c entities.BlogCategory
		if err := rows.Scan(&c.CategoryID, &c.Name, &c.Slug); err != nil {
			return nil, err
		}
		cats = append(cats, &c)
	}
	return cats, rows.Err()
}

func (r *postRepository) GetByID(id int) (*entities.BlogPost, error) {
	return scanPost(r.db.QueryRow(
		`SELECT `+postCols+` FROM blog_posts WHERE post_id = $1`, id,
	))
}

func (r *postRepository) ListByUser(userID, limit, offset int) ([]*entities.BlogPost, error) {
	rows, err := r.db.Query(
		`SELECT `+postCols+` FROM blog_posts WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`,
		userID, limit, offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var posts []*entities.BlogPost
	for rows.Next() {
		p, err := scanPost(rows)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, rows.Err()
}

func (r *postRepository) Create(p *entities.BlogPost) error {
	p.CreatedAt = time.Now()
	p.UpdatedAt = time.Now()
	p.Status = "draft"
	return r.db.QueryRow(
		`INSERT INTO blog_posts (user_id, category_id, title, slug, excerpt, content, cover_image, status, created_at, updated_at)
		 VALUES ($1,$2,$3,$4,$5,$6,$7,'draft',$8,$9) RETURNING post_id`,
		p.UserID, p.CategoryID, p.Title, p.Slug, p.Excerpt, p.Content, p.CoverImage, p.CreatedAt, p.UpdatedAt,
	).Scan(&p.PostID)
}

func (r *postRepository) Update(p *entities.BlogPost) error {
	p.UpdatedAt = time.Now()
	_, err := r.db.Exec(
		`UPDATE blog_posts SET category_id=$1, title=$2, slug=$3, excerpt=$4, content=$5, cover_image=$6, updated_at=$7
		 WHERE post_id=$8`,
		p.CategoryID, p.Title, p.Slug, p.Excerpt, p.Content, p.CoverImage, p.UpdatedAt, p.PostID,
	)
	return err
}

func (r *postRepository) Delete(id int) error {
	_, err := r.db.Exec(`DELETE FROM blog_posts WHERE post_id = $1`, id)
	return err
}

func (r *postRepository) ListAll(limit, offset int) ([]*entities.BlogPost, error) {
	rows, err := r.db.Query(
		`SELECT `+postCols+` FROM blog_posts ORDER BY created_at DESC LIMIT $1 OFFSET $2`,
		limit, offset,
	)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var posts []*entities.BlogPost
	for rows.Next() {
		p, err := scanPost(rows)
		if err != nil {
			return nil, err
		}
		posts = append(posts, p)
	}
	return posts, rows.Err()
}

func (r *postRepository) SetStatus(id int, status, rejectReason string) error {
	var publishedAt *time.Time
	if status == "published" {
		now := time.Now()
		publishedAt = &now
	}
	_, err := r.db.Exec(
		`UPDATE blog_posts SET status=$1, reject_reason=$2, published_at=$3, updated_at=$4 WHERE post_id=$5`,
		status, rejectReason, publishedAt, time.Now(), id,
	)
	return err
}
