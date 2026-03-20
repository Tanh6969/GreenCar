package repository

import (
	"context"
	"time"

	"github.com/google/uuid"

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

func (r *postRepository) Create(ctx context.Context, post *entities.Post) error {
	post.ID = uuid.New()
	query := `
		INSERT INTO posts (id, title, content, author_id, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6)
	`
	_, err := r.db.ExecContext(ctx, query,
		post.ID, post.Title, post.Content, post.AuthorID,
		post.CreatedAt, post.UpdatedAt,
	)
	return err
}

func (r *postRepository) GetByID(ctx context.Context, id string) (*entities.Post, error) {
	query := `
		SELECT id, title, content, author_id, created_at, updated_at
		FROM posts
		WHERE id = $1
	`
	post := &entities.Post{}
	err := r.db.QueryRowContext(ctx, query, id).Scan(
		&post.ID, &post.Title, &post.Content, &post.AuthorID,
		&post.CreatedAt, &post.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return post, nil
}

func (r *postRepository) List(ctx context.Context, limit, offset int) ([]*entities.Post, error) {
	query := `
		SELECT id, title, content, author_id, created_at, updated_at
		FROM posts
		ORDER BY created_at DESC
		LIMIT $1 OFFSET $2
	`
	rows, err := r.db.QueryContext(ctx, query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []*entities.Post
	for rows.Next() {
		post := &entities.Post{}
		err := rows.Scan(
			&post.ID, &post.Title, &post.Content, &post.AuthorID,
			&post.CreatedAt, &post.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		posts = append(posts, post)
	}
	return posts, rows.Err()
}

func (r *postRepository) Update(ctx context.Context, post *entities.Post) error {
	post.UpdatedAt = time.Now()
	query := `
		UPDATE posts
		SET title = $2, content = $3, updated_at = $4
		WHERE id = $1
	`
	_, err := r.db.ExecContext(ctx, query,
		post.ID, post.Title, post.Content, post.UpdatedAt,
	)
	return err
}

func (r *postRepository) Delete(ctx context.Context, id string) error {
	query := `DELETE FROM posts WHERE id = $1`
	_, err := r.db.ExecContext(ctx, query, id)
	return err
}
