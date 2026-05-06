package service

import (
	"errors"
	"strings"
	"unicode"

	"greencar/internal/domain/adapters"
	"greencar/internal/domain/entities"
)

type PostService struct {
	repo adapters.PostRepository
}

func NewPostService(repo adapters.PostRepository) *PostService {
	return &PostService{repo: repo}
}

func slugify(s string) string {
	s = strings.ToLower(s)
	var b strings.Builder
	for _, r := range s {
		if unicode.IsLetter(r) || unicode.IsDigit(r) {
			b.WriteRune(r)
		} else if r == ' ' || r == '-' {
			b.WriteByte('-')
		}
	}
	return strings.Trim(b.String(), "-")
}

// Public

func (s *PostService) ListPublished(limit, offset int) ([]*entities.BlogPost, error) {
	return s.repo.ListPublished(limit, offset)
}

func (s *PostService) GetBySlug(slug string) (*entities.BlogPost, error) {
	return s.repo.GetBySlug(slug)
}

func (s *PostService) ListCategories() ([]*entities.BlogCategory, error) {
	return s.repo.ListCategories()
}

// User

func (s *PostService) GetByID(id int) (*entities.BlogPost, error) {
	return s.repo.GetByID(id)
}

func (s *PostService) ListByUser(userID, limit, offset int) ([]*entities.BlogPost, error) {
	return s.repo.ListByUser(userID, limit, offset)
}

func (s *PostService) CreatePost(p *entities.BlogPost) error {
	if p.Slug == "" {
		p.Slug = slugify(p.Title)
	}
	return s.repo.Create(p)
}

func (s *PostService) UpdatePost(p *entities.BlogPost) error {
	existing, err := s.repo.GetByID(p.PostID)
	if err != nil {
		return err
	}
	if existing.UserID != p.UserID {
		return errors.New("forbidden")
	}
	if p.Slug == "" {
		p.Slug = slugify(p.Title)
	}
	return s.repo.Update(p)
}

func (s *PostService) SubmitForReview(postID, userID int) error {
	p, err := s.repo.GetByID(postID)
	if err != nil {
		return err
	}
	if p.UserID != userID {
		return errors.New("forbidden")
	}
	if p.Status != "draft" && p.Status != "rejected" {
		return errors.New("only draft or rejected posts can be submitted")
	}
	return s.repo.SetStatus(postID, "pending", "")
}

func (s *PostService) WithdrawPost(postID, userID int) error {
	p, err := s.repo.GetByID(postID)
	if err != nil {
		return err
	}
	if p.UserID != userID {
		return errors.New("forbidden")
	}
	if p.Status != "pending" {
		return errors.New("only pending posts can be withdrawn")
	}
	return s.repo.SetStatus(postID, "draft", "")
}

func (s *PostService) DeletePost(postID, userID int) error {
	p, err := s.repo.GetByID(postID)
	if err != nil {
		return err
	}
	if p.UserID != userID {
		return errors.New("forbidden")
	}
	return s.repo.Delete(postID)
}

// Admin

func (s *PostService) AdminListAll(limit, offset int) ([]*entities.BlogPost, error) {
	return s.repo.ListAll(limit, offset)
}

func (s *PostService) AdminSetStatus(postID int, status, rejectReason string) error {
	return s.repo.SetStatus(postID, status, rejectReason)
}

func (s *PostService) AdminDeletePost(postID int) error {
	return s.repo.Delete(postID)
}
