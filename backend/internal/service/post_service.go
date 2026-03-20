package service

import (
	"context"
	"time"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
)

type PostService struct {
	postRepo adapters.PostRepository
}

func NewPostService(postRepo adapters.PostRepository) *PostService {
	return &PostService{postRepo: postRepo}
}

func (s *PostService) CreatePost(ctx context.Context, title, content string, authorID int64) (*entities.Post, error) {
	post := &entities.Post{
		Title:     title,
		Content:   content,
		AuthorID:  authorID,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	err := s.postRepo.Create(ctx, post)
	if err != nil {
		return nil, err
	}
	return post, nil
}

func (s *PostService) GetPostByID(ctx context.Context, id string) (*entities.Post, error) {
	return s.postRepo.GetByID(ctx, id)
}

func (s *PostService) ListPosts(ctx context.Context, limit, offset int) ([]*entities.Post, error) {
	return s.postRepo.List(ctx, limit, offset)
}

func (s *PostService) UpdatePost(ctx context.Context, id, title, content string) (*entities.Post, error) {
	post, err := s.postRepo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	post.Title = title
	post.Content = content
	post.UpdatedAt = time.Now()

	err = s.postRepo.Update(ctx, post)
	if err != nil {
		return nil, err
	}
	return post, nil
}

func (s *PostService) DeletePost(ctx context.Context, id string) error {
	return s.postRepo.Delete(ctx, id)
}
